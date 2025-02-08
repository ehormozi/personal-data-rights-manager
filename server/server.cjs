require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const next = require('next');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const cors = require('cors');
const nodemailer = require('nodemailer');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const server = express();
  server.use(express.json());
  server.use(cors());

  server.get('/api/count-authorizations-by-service', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT s.name AS service, COUNT(a.asset) AS assets
        FROM public.authorizations a
        INNER JOIN public.services s
        ON a.service = s.id
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE u.username = 'erfan'
        GROUP BY s.id;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/recent-activity', async (_req, res) => {
    const client = await pool.connect();
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
        INNER JOIN public.users u
        ON e.user = u.id
        WHERE u.username = 'erfan'
        AND e.time >= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - INTERVAL '140 days'
        ORDER BY e.time DESC;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/assets-count-sum', async (_req, res) => {
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

  server.get('/api/granted-assets-count-sum', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COUNT(*), SUM(sensitivity)
        FROM (
          SELECT DISTINCT a.asset, assets.sensitivity as sensitivity
          FROM public.authorizations a
          INNER JOIN public.assets assets
          ON a.asset = assets.id
          INNER JOIN public.users u
          ON a.user = u.id
          WHERE u.username = 'erfan'
        );`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/recent-revokes-count', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COUNT(e.*) AS revoke_count
        FROM public.events e
        INNER JOIN public.users u
        ON e.user = u.id
        INNER JOIN public.event_types et
        ON e.type = et.id
        WHERE u.username = 'erfan'
        AND et.name = 'revoke'
        AND e.time >= NOW() - INTERVAL '30 days';`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/recent-breaches-count', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COUNT(*) AS breach_count
        FROM public.events e
        INNER JOIN public.users u
        ON e.user = u.id
        INNER JOIN public.event_types et
        ON e.type = et.id
        WHERE u.username = 'erfan'
        AND et.name = 'data_breach'
        AND e.time >= NOW() - INTERVAL '24 months';`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/user-mfa-enabled', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT u.mfa_enabled AS mfa_enabled
        FROM public.users u
        WHERE u.username = 'erfan';`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/count-by-asset-catgory', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT ac.name AS category, COUNT(*) AS count
        FROM public.authorizations a
        INNER JOIN public.assets assets
        ON a.asset = assets.id
        INNER JOIN public.users u
        ON a.user = u.id
        INNER JOIN public.asset_categories ac
        ON assets.category = ac.id
        WHERE u.username = 'erfan'
        GROUP BY ac.id;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/permissions-granted-weeks', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT date_part('week', e.time) AS week, COUNT(*) AS count
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        INNER JOIN public.users u
        ON e.user = u.id
        WHERE e.time >= NOW() - INTERVAL '4 weeks'
        AND et.name = 'grant'
        AND u.username = 'erfan'
        GROUP BY week`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/permissions-revoked-weeks', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT date_part('week', e.time) AS week, COUNT(*) AS count
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        INNER JOIN public.users u
        ON e.user = u.id
        WHERE e.time >= NOW() - INTERVAL '4 weeks'
        AND et.name = 'revoke'
        AND u.username = 'erfan'
        GROUP BY week`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/count-all-authorizations', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COUNT(*) AS count
        FROM public.authorizations a
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE u.username = 'erfan';`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/count-sensitive-authorizations', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COUNT(*) AS count
        FROM public.authorizations a
        INNER JOIN public.assets assets
        ON a.asset = assets.id
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE assets.sensitivity = 3
        AND u.username = 'erfan';`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/top-service', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT s.name AS service, COUNT(*) AS count
        FROM public.authorizations a
        INNER JOIN public.services s
        ON a.service = s.id
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE u.username = 'erfan'
        GROUP BY s.name
        ORDER BY count DESC
        LIMIT 1;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/all-user-authorizations', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT a.id AS id, s.name AS service, assets.name AS asset, assets.sensitivity AS sensitivity
        FROM public.authorizations a
        INNER JOIN public.services s
        ON a.service = s.id
        INNER JOIN public.assets assets
        ON a.asset = assets.id
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE u.username = 'erfan'
        ORDER BY service ASC, asset ASC;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/count-all-requests', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT COUNT(*) AS count
        FROM public.data_requests dr
        INNER JOIN public.users u
        ON dr.user = u.id
        WHERE u.username = 'erfan';`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/count-requests-by-status', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT drs.name AS status, COUNT(*) AS count
        FROM public.data_requests dr
        INNER JOIN public.data_request_statuses drs
        ON dr.status = drs.id
        INNER JOIN public.users u
        ON dr.user = u.id
        WHERE u.username = 'erfan'
        GROUP BY drs.name;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/user-requests', async (_req, res) => {
    const client = await pool.connect();
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
        INNER JOIN public.users u
        ON dr.user = u.id
        WHERE u.username = 'erfan'
        ORDER BY dr.updated_at DESC;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/activity-summary', async (_req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT ec.name AS category, COUNT(*) AS count
        FROM public.events e
        INNER JOIN public.event_types et
        ON e.type = et.id
        INNER JOIN public.event_categories ec
        ON et.category = ec.id
        INNER JOIN public.users u
        ON e.user = u.id
        WHERE u.username = 'erfan'
        GROUP BY ec.name;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/activity-history', async (_req, res) => {
    const client = await pool.connect();
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
        INNER JOIN public.users u
        ON e.user = u.id
        WHERE u.username = 'erfan'
        ORDER BY e.time DESC;`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/service-last-activity/:serviceName', async (_req, res) => {
    const client = await pool.connect();
    const { serviceName } = _req.params;
    try {
      const result = await client.query(
        `SELECT MAX(e.time) AS last_activity
        FROM public.events e
        INNER JOIN public.services s
        ON e.service = s.id
        INNER JOIN public.users u
        ON e.user = u.id
        WHERE s.name = $1
        AND u.username = 'erfan';`,
        [serviceName],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get(
    '/api/count-service-permissions-by-sensitivity/:serviceName',
    async (_req, res) => {
      const client = await pool.connect();
      const { serviceName } = _req.params;
      try {
        const result = await client.query(
          `SELECT assets.sensitivity AS sensitivity, COUNT(*) AS count
          FROM public.authorizations a
          INNER JOIN public.services s
          ON a.service = s.id
          INNER JOIN public.assets assets
          ON a.asset = assets.id
          INNER JOIN public.users u
          ON a.user = u.id
          WHERE u.username = 'erfan'
          AND s.name = $1
          GROUP BY assets.sensitivity;`,
          [serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-requests-by-status/:serviceName',
    async (_req, res) => {
      const client = await pool.connect();
      const { serviceName } = _req.params;
      try {
        const result = await client.query(
          `SELECT drs.name AS status, COUNT(*) AS count
          FROM public.data_requests dr
          INNER JOIN public.data_request_statuses drs
          ON dr.status = drs.id
          INNER JOIN public.services s
          ON dr.service = s.id
          INNER JOIN public.users u
          ON dr.user = u.id
          WHERE u.username = 'erfan'
          AND s.name = $1
          GROUP BY drs.name;`,
          [serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-activities-by-category/:serviceName',
    async (_req, res) => {
      const client = await pool.connect();
      const { serviceName } = _req.params;
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
          INNER JOIN public.users u
          ON e.user = u.id
          WHERE u.username = 'erfan'
          AND s.name = $1
          GROUP BY ec.name;`,
          [serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-permissions-by-week/:serviceName',
    async (_req, res) => {
      const client = await pool.connect();
      const { serviceName } = _req.params;
      try {
        const result = await client.query(
          `SELECT date_part('week', e.time) AS week, COUNT(*) AS count
          FROM public.events e
          INNER JOIN public.event_types et
          ON e.type = et.id
          INNER JOIN public.services s
          ON e.service = s.id
          INNER JOIN public.users u
          ON e.user = u.id
          WHERE e.time >= NOW() - INTERVAL '4 weeks'
          AND et.name = 'grant'
          AND s.name = $1
          AND u.username = 'erfan'
          GROUP BY week;`,
          [serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-requests-by-week/:serviceName',
    async (_req, res) => {
      const client = await pool.connect();
      const { serviceName } = _req.params;
      try {
        const result = await client.query(
          `SELECT date_part('week', dr.created_at) AS week, COUNT(*) AS count
          FROM public.data_requests dr
          INNER JOIN public.data_request_statuses drs
          ON dr.status = drs.id
          INNER JOIN public.services s
          ON dr.service = s.id
          INNER JOIN public.users u
          ON dr.user = u.id
          WHERE dr.created_at >= NOW() - INTERVAL '4 weeks'
          AND s.name = $1
          AND u.username = 'erfan'
          GROUP BY week;`,
          [serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get(
    '/api/count-service-activities-by-week/:serviceName',
    async (_req, res) => {
      const client = await pool.connect();
      const { serviceName } = _req.params;
      try {
        const result = await client.query(
          `SELECT date_part('week', e.time) AS week, COUNT(*) AS count
          FROM public.events e
          INNER JOIN public.event_types et
          ON e.type = et.id
          INNER JOIN public.services s
          ON e.service = s.id
          INNER JOIN public.users u
          ON e.user = u.id
          WHERE e.time >= NOW() - INTERVAL '4 weeks'
          AND s.name = $1
          AND u.username = 'erfan'
          GROUP BY week;`,
          [serviceName],
        );
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    },
  );

  server.get('/api/service-permissions/:serviceName', async (_req, res) => {
    const client = await pool.connect();
    const { serviceName } = _req.params;
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
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE u.username = 'erfan'
        AND s.name = $1
        ORDER BY time DESC;`,
        [serviceName],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/service-requests/:serviceName', async (_req, res) => {
    const client = await pool.connect();
    const { serviceName } = _req.params;
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
        INNER JOIN public.users u
        ON dr.user = u.id
        WHERE u.username = 'erfan'
        AND s.name = $1
        ORDER BY dr.updated_at DESC;`,
        [serviceName],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/service-activity/:serviceName', async (_req, res) => {
    const client = await pool.connect();
    const { serviceName } = _req.params;
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
        INNER JOIN public.users u
        ON e.user = u.id
        WHERE u.username = 'erfan'
        AND s.name = $1
        ORDER BY e.time DESC;`,
        [serviceName],
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.get('/api/faqs', async (_req, res) => {
    const client = await pool.connect();
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

  server.post('/api/export-data', async (req, res) => {
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

  server.post('/api/handle-contact-form', async (req, res) => {
    const { name, email, message } = req.body;
    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
      // Store message in database
      await pool.query(
        `INSERT INTO 
        contact_messages (name, email, message, created_at)
        VALUES ($1, $2, $3, NOW())`,
        [name, email, message],
      );
      // Send confirmation email
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

  server.all('*', (req, res) => handle(req, res));

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});
