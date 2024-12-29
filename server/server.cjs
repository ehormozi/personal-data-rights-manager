require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const next = require('next');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const cors = require('cors');

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
        AND a.time >= (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') - INTERVAL '140 days'
        ORDER BY a.time DESC;`,
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
        `SELECT dr.id AS id, drt.name AS type, s.name AS service, a.name AS asset, drs.name AS status, dr.updated_at AS updated_at
        FROM public.data_requests dr
        INNER JOIN public.data_request_types drt
        ON dr.type = drt.id
        INNER JOIN public.services s
        ON dr.service = s.id
        INNER JOIN public.assets a
        ON dr.asset = a.id
        INNER JOIN public.data_request_statuses drs
        ON dr.status = drs.id
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

  server.all('*', (req, res) => handle(req, res));

  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});
