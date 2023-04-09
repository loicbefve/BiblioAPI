const mysql = require('mysql');
const config = require('../config/dbConfig');

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: config.maxConnections,
  multipleStatements: false,
});

// Export the pool object to use in other parts of your application
module.exports = pool;
