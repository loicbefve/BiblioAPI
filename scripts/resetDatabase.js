// resetDatabase.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'root',
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.POSTGRES_PASSWORD || 'root',
});

async function resetDatabase() {
  const client = await pool.connect();

  try {
    // Begin a transaction to reset the database
    await client.query('BEGIN;');

    // Disable foreign key checks
    await client.query('SET session_replication_role = replica;');

    // Get all table names from the 'public' schema
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);

    // Truncate all tables to remove all data and reset sequences
    for (const row of result.rows) {
      const tableName = row.table_name;
      console.log(`Truncating table: ${tableName}`);
      await client.query(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`);
    }

    // Re-enable foreign key checks
    await client.query('SET session_replication_role = DEFAULT;');

    // Commit the transaction
    await client.query('COMMIT;');
    console.log('Database reset successfully!');
  } catch (err) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK;');
    console.error('Error resetting the database:', err);
  } finally {
    // Release the client back to the pool
    client.release();
  }

  // Close the pool connection
  pool.end();
}

if (process.env.DB_HOST !== 'localhost') {
  console.error('This script can only be run on a local development environment.');
  process.exit(1);
}

if (process.env.DB_HOST === undefined || process.env.DB_USER === undefined || process.env.DB_NAME === undefined || process.env.DB_PASSWORD === undefined) {
  console.error('Please make sure to create a .env file with the appropriate environment variables.');
  process.exit(1);
}
resetDatabase();
