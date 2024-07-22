const pg = require('pg');
const config = require('../config/dbConfig');
const { Pool } = require('pg');

const pool = new Pool(config);

// Export the pool object to use in other parts of the application
module.exports = {
  query: (text, params) => pool.query(text, params)
};