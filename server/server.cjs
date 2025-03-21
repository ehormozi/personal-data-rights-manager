require('dotenv').config();

const next = require('next');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { Pool } = require('pg');
const { Parser } = require('json2csv');
const { RedisStore } = require('connect-redis');
const { createClient } = require('redis');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

const redisClient = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  },
});

let redisStore = new RedisStore({ client: redisClient, disableTouch: true });

app.prepare().then(() => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  redisClient.connect().catch(console.error);

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully!');
  });
  redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
  });

  const server = express();

  server.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );

  server.use(express.json());
  server.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

  server.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT id, first_name, last_name, email, password_hash FROM users WHERE email = $1',
        [email],
      );
      client.release();
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error('❌ Session save error:', err);
          return res.status(500).json({ error: 'Session save failed' });
        }
        res.json({
          user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
          },
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  server.post('/api/auth/logout', requireAuth, async (req, res) => {
    try {
      const sessionId = req.session.id;
      req.session.destroy(async (err) => {
        if (err) {
          return res.status(500).json({ error: 'Logout failed' });
        }
        await redisClient.del(`sess:${sessionId}`);
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error during logout' });
    }
  });

  server.post('/api/auth/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = await pool.connect();
      const query = `INSERT
        INTO users (username, first_name, last_name, email, password_hash)
        VALUES ($3, $1, $2, $3, $4)
        RETURNING id`;
      const result = await client.query(query, [
        firstName,
        lastName,
        email,
        hashedPassword,
      ]);
      const userId = result.rows[0].id;
      await client.query(
        `INSERT INTO notification_preferences (user_id, notification_category, enabled)
         SELECT $1, id, true FROM notification_categories`,
        [userId],
      );
      client.release();
      res.status(201).json({
        message: 'User registered successfully',
        userId: userId,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error registering user' });
    }
  });

  server.get('/api/auth/account-info', requireAuth, async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(
        'SELECT first_name, last_name, email FROM users WHERE id = $1',
        [req.session.userId],
      );
      client.release();
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching account info' });
    }
  });

  server.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const client = await pool.connect();
      const userQuery = await client.query(
        'SELECT id FROM public.users WHERE email = $1',
        [email],
      );
      if (userQuery.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const userId = parseInt(userQuery.rows[0].id);
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      await client.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3);',
        [userId, token, expiresAt],
      );
      client.release();
      console.log(
        `Password reset link: http://localhost:3000/reset-password?token=${token}`,
      );
      res.json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  server.post('/api/auth/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      const client = await pool.connect();
      const tokenQuery = await client.query(
        'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1',
        [token],
      );
      if (tokenQuery.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      const { user_id, expires_at } = tokenQuery.rows[0];
      if (new Date() > new Date(expires_at)) {
        return res.status(400).json({ error: 'Token expired' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
        hashedPassword,
        user_id,
      ]);
      await client.query(
        'DELETE FROM password_reset_tokens WHERE user_id = $1',
        [user_id],
      );
      client.release();
      res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  server.get('/api/auth/verify-reset-token', async (req, res) => {
    const { token } = req.query;
    try {
      const client = await pool.connect();
      const tokenQuery = await client.query(
        'SELECT expires_at FROM password_reset_tokens WHERE token = $1',
        [token],
      );
      client.release();
      if (tokenQuery.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid token.' });
      }
      const { expires_at } = tokenQuery.rows[0];
      if (new Date() > new Date(expires_at)) {
        return res.status(400).json({ error: 'Token expired.' });
      }
      res.json({ valid: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  server.get(
    '/api/count-authorizations-by-service',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      try {
        const result = await client.query(
          `SELECT s.name AS service, COUNT(a.asset) AS assets
          FROM public.authorizations a
          INNER JOIN public.services s
          ON a.service = s.id
          WHERE a.user = $1
          GROUP BY s.id;`,
          [userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get('/api/recent-activity', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT eg.name AS group, et.name AS type, et.description, e.time, s.name AS service
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        INNER JOIN public.event_groups eg
        ON et.group = eg.id
        LEFT JOIN public.services s
        ON e.service = s.id
        WHERE e.user = $1
        AND e.time >= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - INTERVAL '140 days'
        ORDER BY e.time DESC;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/assets-count-sum', requireAuth, async (req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COUNT(*), SUM(sensitivity)
        FROM public.assets;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/granted-assets-count-sum', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT COUNT(*), SUM(sensitivity)
        FROM (
          SELECT DISTINCT a.asset, assets.sensitivity as sensitivity
          FROM public.authorizations a
          INNER JOIN public.assets assets
          ON a.asset = assets.id
          WHERE a.user = $1
        );`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/recent-revokes-count', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT COUNT(e.*) AS revoke_count
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        WHERE e.user = $1
        AND et.name = 'revoke'
        AND e.time >= NOW() - INTERVAL '30 days';`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/recent-breaches-count', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT COUNT(*) AS breach_count
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        WHERE e.user = $1
        AND et.name = 'data_breach'
        AND e.time >= NOW() - INTERVAL '24 months';`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/user-mfa-enabled', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT u.mfa_enabled AS mfa_enabled
        FROM public.users u
        WHERE u.id = $1;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/count-by-asset-catgory', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT ac.name AS category, COUNT(*) AS count
        FROM public.authorizations a
        INNER JOIN public.assets assets
        ON a.asset = assets.id
        INNER JOIN public.asset_categories ac
        ON assets.category = ac.id
        WHERE a.user = $1
        GROUP BY ac.id;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get(
    '/api/permissions-granted-weeks',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      try {
        const result = await client.query(
          `SELECT date_part('week', e.time) AS week, COUNT(*) AS count
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        WHERE e.time >= NOW() - INTERVAL '4 weeks'
        AND et.name = 'grant'
        AND e.user = $1
        GROUP BY week`,
          [userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/permissions-revoked-weeks',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      try {
        const result = await client.query(
          `SELECT date_part('week', e.time) AS week, COUNT(*) AS count
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        WHERE e.time >= NOW() - INTERVAL '4 weeks'
        AND et.name = 'revoke'
        AND e.user = $1
        GROUP BY week`,
          [userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get('/api/count-all-authorizations', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT COUNT(*) AS count
        FROM public.authorizations a
        WHERE a.user = $1;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get(
    '/api/count-sensitive-authorizations',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      try {
        const result = await client.query(
          `SELECT COUNT(*) AS count
        FROM public.authorizations a
        INNER JOIN public.assets assets
        ON a.asset = assets.id
        WHERE assets.sensitivity = 3
        AND a.user = $1;`,
          [userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get('/api/top-service', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT s.name AS service, COUNT(*) AS count
        FROM public.authorizations a
        INNER JOIN public.services s
        ON a.service = s.id
        WHERE a.user = $1
        GROUP BY s.name
        ORDER BY count DESC
        LIMIT 1;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/all-user-authorizations', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT a.id AS id, s.name AS service, assets.name AS asset, assets.sensitivity AS sensitivity
        FROM public.authorizations a
        INNER JOIN public.services s
        ON a.service = s.id
        INNER JOIN public.assets assets
        ON a.asset = assets.id
        WHERE a.user = $1
        ORDER BY service ASC, asset ASC;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/count-all-requests', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT COUNT(*) AS count
        FROM public.data_requests dr
        WHERE dr.user = $1;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/count-requests-by-status', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT drs.name AS status, COUNT(*) AS count
        FROM public.data_requests dr
        INNER JOIN public.data_request_statuses drs
        ON dr.status = drs.id
        WHERE dr.user = $1
        GROUP BY drs.name;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/user-requests', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT dr.id AS id, drt.name AS type, s.name AS service, a.name AS asset, drs.name AS status, dr.updated_at AS updated_at, dra.name AS action
        FROM public.data_requests dr
        INNER JOIN public.data_request_types drt
        ON dr.type = drt.id
        INNER JOIN public.services s
        ON dr.service = s.id
        INNER JOIN public.assets a
        ON dr.asset = a.id
        INNER JOIN public.data_request_statuses drs
        ON dr.status = drs.id
        LEFT JOIN public.data_request_status_action_map drsam
        ON dr.status = drsam.status
        LEFT JOIN public.data_request_actions dra
        ON drsam.action = dra.id
        WHERE dr.user = $1
        ORDER BY dr.updated_at DESC;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/activity-summary', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT ec.name AS category, COUNT(*) AS count
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        INNER JOIN public.event_categories ec
        ON et.category = ec.id
        WHERE e.user = $1
        GROUP BY ec.name;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/activity-history', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT
          e.id AS id,
          e.time AS time,
          ec.name AS category,
          et.label AS event,
          et.description AS details,
          s.name AS service,
          ea.name AS action
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        INNER JOIN public.event_categories ec
        ON et.category = ec.id
        LEFT JOIN public.data_requests dr
        ON e.request = dr.id
        LEFT JOIN public.services s
        ON (
          (e.request IS NOT NULL AND dr.service = s.id)
          OR (e.request IS NULL AND e.service IS NOT NULL AND e.service = s.id)
        )
        LEFT JOIN public.event_type_action_map etam
        ON et.id = etam.event_type
        LEFT JOIN public.event_actions ea
        ON etam.event_action = ea.id
        WHERE e.user = $1
        ORDER BY e.time DESC;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get(
    '/api/service-last-activity/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT MAX(e.time) AS last_activity
        FROM public.events e
        INNER JOIN public.services s
        ON e.service = s.id
        WHERE s.name = $1
        AND s.user = $2;`,
          [serviceName, userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-permissions-by-sensitivity/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT assets.sensitivity AS sensitivity, COUNT(*) AS count
          FROM public.authorizations a
          INNER JOIN public.services s
          ON a.service = s.id
          INNER JOIN public.assets assets
          ON a.asset = assets.id
          WHERE a.user = $1
          AND s.name = $2
          GROUP BY assets.sensitivity;`,
          [userId, serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-requests-by-status/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT drs.name AS status, COUNT(*) AS count
          FROM public.data_requests dr
          INNER JOIN public.data_request_statuses drs
          ON dr.status = drs.id
          INNER JOIN public.services s
          ON dr.service = s.id
          WHERE dr.user = $1
          AND s.name = $2
          GROUP BY drs.name;`,
          [userId, serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-activities-by-category/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT ec.name AS category, COUNT(*) AS count
          FROM public.events e
          INNER JOIN public.event_types et
          ON e.type = et.id
          INNER JOIN public.event_categories ec
          ON et.category = ec.id
          INNER JOIN public.services s
          ON e.service = s.id
          WHERE e.user = $1
          AND s.name = $2
          GROUP BY ec.name;`,
          [userId, serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-permissions-by-week/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT date_part('week', e.time) AS week, COUNT(*) AS count
          FROM public.events e
          INNER JOIN public.event_types et
          ON e.type = et.id
          INNER JOIN public.services s
          ON e.service = s.id
          WHERE e.time >= NOW() - INTERVAL '4 weeks'
          AND et.name = 'grant'
          AND s.name = $1
          AND e.user = $2
          GROUP BY week;`,
          [serviceName, userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-requests-by-week/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT date_part('week', dr.created_at) AS week, COUNT(*) AS count
          FROM public.data_requests dr
          INNER JOIN public.data_request_statuses drs
          ON dr.status = drs.id
          INNER JOIN public.services s
          ON dr.service = s.id
          WHERE dr.created_at >= NOW() - INTERVAL '4 weeks'
          AND s.name = $1
          AND dr.user = $2
          GROUP BY week;`,
          [serviceName, userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-activities-by-week/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT date_part('week', e.time) AS week, COUNT(*) AS count
          FROM public.events e
          INNER JOIN public.event_types et
          ON e.type = et.id
          INNER JOIN public.services s
          ON e.service = s.id
          WHERE e.time >= NOW() - INTERVAL '4 weeks'
          AND s.name = $1
          AND e.user = $2'
          GROUP BY week;`,
          [serviceName, userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/service-permissions/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT
          a.id AS id,
          assets.name AS asset,
          assets.sensitivity AS sensitivity,
          (
            SELECT MAX(e.time)
            FROM public.events e
            INNER JOIN public.event_types et
            ON e.type = et.id
            WHERE e.service = a.service
            AND e.asset = a.asset
            AND e.user = a.user
            AND et.name = 'grant'
          ) AS time
        FROM public.authorizations a
        INNER JOIN public.services s
        ON a.service = s.id
        INNER JOIN public.assets assets
        ON a.asset = assets.id
        WHERE a.user = $1
        AND s.name = $2
        ORDER BY time DESC;`,
          [userId, serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/service-requests/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT dr.id AS id, drt.name AS type, s.name AS service, a.name AS asset, drs.name AS status, dr.updated_at AS updated_at, dra.name AS action
        FROM public.data_requests dr
        INNER JOIN public.data_request_types drt
        ON dr.type = drt.id
        INNER JOIN public.services s
        ON dr.service = s.id
        INNER JOIN public.assets a
        ON dr.asset = a.id
        INNER JOIN public.data_request_statuses drs
        ON dr.status = drs.id
        LEFT JOIN public.data_request_status_action_map drsam
        ON dr.status = drsam.status
        LEFT JOIN public.data_request_actions dra
        ON drsam.action = dra.id
        WHERE dr.user = $1
        AND s.name = $2
        ORDER BY dr.updated_at DESC;`,
          [userId, serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/service-activity/:serviceName',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      const { serviceName } = req.params;
      try {
        const result = await client.query(
          `SELECT
          e.id AS id,
          e.time AS time,
          ec.name AS category,
          et.label AS event,
          et.description AS details,
          s.name AS service,
          ea.name AS action
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        INNER JOIN public.event_categories ec
        ON et.category = ec.id
        LEFT JOIN public.data_requests dr
        ON e.request = dr.id
        LEFT JOIN public.services s
        ON e.service = s.id
        LEFT JOIN public.event_type_action_map etam
        ON et.id = etam.event_type
        LEFT JOIN public.event_actions ea
        ON etam.event_action = ea.id
        WHERE e.user = $1
        AND s.name = $2
        ORDER BY e.time DESC;`,
          [userId, serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get('/api/faqs', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT f.id AS id, f.question AS question, f.answer AS answer, fc.name as category
        FROM public.faqs f
        INNER JOIN public.faq_categories fc
        ON f.category_id = fc.id
        ORDER BY f.category_id ASC;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/user-support-requests', requireAuth, async (req, res) => {
    const client = await pool.connect();
    const userId = req.session.userId;
    try {
      const result = await client.query(
        `SELECT
          sr.id AS id,
          sr.subject AS subject,
          sr.message AS message,
          srs.name as status,
          sr.updated_at AS updated_at
        FROM public.support_requests sr
        INNER JOIN public.support_request_statuses srs
        ON sr.status = srs.id
        WHERE sr.user = $1
        ORDER BY sr.updated_at DESC;`,
        [userId],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get(
    '/api/user-notification-preferences',
    requireAuth,
    async (req, res) => {
      const client = await pool.connect();
      const userId = req.session.userId;
      try {
        const result = await client.query(
          `SELECT nc.name AS category, np.enabled as enabled
          FROM public.notification_preferences np
          INNER JOIN public.notification_categories nc
          ON np.notification_category = nc.id
          WHERE np.user_id = $1
          ORDER BY nc.id ASC;`,
          [userId],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.post('/api/export-data', requireAuth, async (req, res) => {
    const { data, format } = req.body;
    if (!data || !format) {
      return res
        .status(400)
        .json({ error: 'Invalid request. Data and format are required.' });
    }
    try {
      let fileBuffer;
      let mimeType;
      let fileName;
      if (format === 'CSV') {
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);
        fileBuffer = Buffer.from(csv, 'utf-8');
        mimeType = 'text/csv';
        fileName = 'exported_data.csv';
      } else if (format === 'JSON') {
        fileBuffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
        mimeType = 'application/json';
        fileName = 'exported_data.json';
      } else if (format === 'XLSX') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        worksheet.addRow(Object.keys(data[0]));
        data.forEach((row) => {
          worksheet.addRow(Object.values(row));
        });
        fileBuffer = await workbook.xlsx.writeBuffer();
        mimeType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileName = 'exported_data.xlsx';
      } else {
        return res.status(400).json({ error: 'Unsupported format.' });
      }
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.setHeader('Content-Type', mimeType);
      res.send(fileBuffer);
    } catch (error) {
      console.error('Error generating export file:', error);
      res.status(500).json({ error: 'Failed to generate export file.' });
    }
  });

  server.post('/api/handle-contact-form', requireAuth, async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
      await pool.query(
        `INSERT INTO 
        contact_messages (name, email, message, created_at)
        VALUES ($1, $2, $3, NOW())`,
        [name, email, message],
      );
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'We received your message',
        text: `Hi ${name},\n\nThank you for reaching out! Our team will get back to you shortly.\n\nBest,\nSupport Team`,
      });
      res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  server.all('*', requireAuth, async (req, res) => handle(req, res));

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('✅ Express ready on http://localhost:3001');
  });
});
