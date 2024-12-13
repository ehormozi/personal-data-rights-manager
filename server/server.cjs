require('dotenv').config();

const { Pool } = require('pg');
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const server = express();

  server.get('/api/authorizations', async (_req, res) => {
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
        `SELECT atg.name AS group, at.name AS type, at.description, a.time, s.name AS service
        FROM public.actions a
        INNER JOIN public.action_types at
        ON a.type = at.id
        INNER JOIN public.action_type_groups atg
        ON at.group = atg.id
        LEFT JOIN public.services s
        ON a.service = s.id
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE u.username = 'erfan'
        AND a.time >= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - INTERVAL '14 days';`,
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
        `SELECT COUNT(a.*) AS revoke_count
        FROM public.actions a
        INNER JOIN public.users u
        ON a.user = u.id
        INNER JOIN public.action_types at
        ON a.type = at.id
        WHERE u.username = 'erfan'
        AND at.name = 'revoke'
        AND a.time >= NOW() - INTERVAL '30 days';`,
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
        FROM public.actions a
        INNER JOIN public.users u
        ON a.user = u.id
        INNER JOIN public.action_types at
        ON a.type = at.id
        WHERE u.username = 'erfan'
        AND at.name = 'data_breach'
        AND a.time >= NOW() - INTERVAL '24 months';`,
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
        `SELECT date_part('week', a.time) AS week, COUNT(*) AS count
        FROM public.actions a
        INNER JOIN public.action_types at
        ON a.type = at.id
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE a.time >= NOW() - INTERVAL '4 weeks'
        AND at.name = 'grant'
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
        `SELECT date_part('week', a.time) AS week, COUNT(*) AS count
        FROM public.actions a
        INNER JOIN public.action_types at
        ON a.type = at.id
        INNER JOIN public.users u
        ON a.user = u.id
        WHERE a.time >= NOW() - INTERVAL '4 weeks'
        AND at.name = 'revoke'
        AND u.username = 'erfan'
        GROUP BY week`,
      );
      res.status(200).json(result.rows);
    } finally {
      client.release();
    }
  });

  server.all('*', (req, res) => handle(req, res));

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});
