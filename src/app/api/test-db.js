import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    res.status(200).json(result.rows[0]);
  } finally {
    client.release();
  }
};
