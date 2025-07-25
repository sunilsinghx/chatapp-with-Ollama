import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const { Pool } = pg;



export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});


async function testConnection() {
  try {
    // Try to connect and run a simple query
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');  // current timestamp
    console.log('Connected! Current time:', res.rows[0]);
    client.release(); // release client back to the pool
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection();