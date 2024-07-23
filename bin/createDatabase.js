require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Update these values as per your configuration this is the default configuration
// in the docker-compose file
const baseConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres',
  password: process.env.DB_PASSWORD,
};

const biblioConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
};

// Load the SQL file
const sqlFilePath = path.join(__dirname, '../db/empty_tables.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

const createDatabase = async () => {
  const client = new Client(baseConfig);

  try {
    await client.connect();

    // Check if the database already exists if not create it
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
    if (res.rowCount > 0) {
      console.log(`Database "${process.env.DB_NAME}" already exists`);
    } else {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('Database created successfully');
    }

  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
};

const populateDatabase = async () => {
  const client = new Client(biblioConfig);

  try {
    await client.connect();

    // Insert the empty tables
    await client.query(sqlQuery);
    console.log('Database tables created successfully');

  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
};

createDatabase().then(() => populateDatabase());