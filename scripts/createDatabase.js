require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Update these values as per your configuration this is the default configuration
// in the docker-compose file
const baseConfig = {
  user: process.env.POSTGRES_USER || 'root',
  host: process.env.DB_HOST,
  database: 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'root',
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
      return false;
    } else {
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log('Database created successfully');
      if (process.env.DB_USER === 'root') {
        console.log('No need to create a user');
        return true;
      } else {
        await client.query(`CREATE USER ${process.env.DB_USER} WITH PASSWORD '${process.env.DB_PASSWORD}'`);
        await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} TO ${process.env.DB_USER}`);
        await client.query(`ALTER DATABASE ${process.env.DB_NAME} OWNER TO ${process.env.DB_USER};`);
        console.log(`User ${process.env.DB_USER} created successfully`);
      }
      return true;
    }

  } catch (err) {
    console.error('Error creating database:', err);
    return false;
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

if (process.env.DB_HOST === undefined || process.env.DB_USER === undefined || process.env.DB_NAME === undefined || process.env.DB_PASSWORD === undefined) {
  console.error('Please make sure to create a .env file with the appropriate environment variables.');
  process.exit(1);
}

createDatabase().then(( res) => {if (res === true) populateDatabase()});