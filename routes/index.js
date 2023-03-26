const express = require('express');
const router = express.Router();
const pool = require('../db/index');

/* GET home page. */
router.get('/', function (req, res, next) {
  pool.query('SELECT * FROM factums', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });

  const a = pool.query('SELECT * FROM factums');
  console.log(a);
  res.render('index', { title: 'Express' });
});

module.exports = router;
