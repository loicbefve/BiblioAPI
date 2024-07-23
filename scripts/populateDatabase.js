const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load the SQL file
const sqlFilePath = path.join(__dirname, '../db/20230324T2337_biblio_dump.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

// Update the config to use environment variables
const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
};

const populateDatabase = async () => {
  const client = new Client(config);

  try {
    await client.connect();
    await client.query(sqlQuery);
    console.log('Database populated successfully');
  } catch (err) {
    console.error('Error populating database:', err);
  } finally {
    await client.end();
  }
};

populateDatabase();