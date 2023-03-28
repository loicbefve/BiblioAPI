const express = require('express');
const router = express.Router();
const pool = require('../db/index');

/* GET home page. */
router.get('/searchImprimes', function (req, res, next) {
  const query = req.query;

  const authorParam = query.author;
  const titleParam = query.title;
  const keywordsParam = query.keywords;
  console.log(authorParam);
  console.log(titleParam);
  console.log(keywordsParam);

  const authorQuery = authorParam
    ? `MATCH(auteur) AGAINST('${authorParam}')`
    : '';

  const titleQuery = titleParam ? `MATCH(titre) AGAINST('${titleParam}')` : '';

  const keywordsQuery = keywordsParam
    ? `MATCH(cote,type,auteur,titre,couverture,langue,edition,datation,contenu,etat,notes,emplacement) AGAINST ('${keywordsParam}')`
    : '';

  const completeCondition = [authorQuery, titleQuery, keywordsQuery]
    .filter((q) => q !== '')
    .join(' AND ');

  const finalQuery = `SELECT * FROM imprimes WHERE ${completeCondition}`;

  console.log(finalQuery);

  pool.query(finalQuery, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });

  res.render('index', { title: 'Express' });
});

router.get('/searchFactums', function (req, res, next) {
  const query = req.query;

  const authorParam = query.author;
  const titleParam = query.title;
  const keywordsParam = query.keywords;
  console.log(authorParam);
  console.log(titleParam);
  console.log(keywordsParam);

  const authorQuery = authorParam
    ? `MATCH(auteur) AGAINST('${authorParam}')`
    : '';

  const titleQuery = titleParam ? `MATCH(titre) AGAINST('${titleParam}')` : '';

  const keywordsQuery = keywordsParam
    ? `MATCH(cote,type,auteur,titre,couverture,langue,edition,datation,contenu,etat,notes,emplacement) AGAINST ('${keywordsParam}')`
    : '';

  const completeCondition = [authorQuery, titleQuery, keywordsQuery]
    .filter((q) => q !== '')
    .join(' AND ');

  const finalQuery = `SELECT * FROM factums WHERE ${completeCondition}`;

  console.log(finalQuery);

  pool.query(finalQuery, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });

  res.render('index', { title: 'Express' });
});

router.get('/searchFondsJohannique', function (req, res, next) {
  const query = req.query;

  const authorParam = query.author;
  const titleParam = query.title;
  const keywordsParam = query.keywords;
  console.log(authorParam);
  console.log(titleParam);
  console.log(keywordsParam);

  const authorQuery = authorParam
    ? `MATCH(auteur) AGAINST('${authorParam}')`
    : '';

  const titleQuery = titleParam ? `MATCH(titre) AGAINST('${titleParam}')` : '';

  const keywordsQuery = keywordsParam
    ? `MATCH(cote,type,auteur,titre,couverture,langue,edition,datation,contenu,etat,notes,emplacement) AGAINST ('${keywordsParam}')`
    : '';

  const completeCondition = [authorQuery, titleQuery, keywordsQuery]
    .filter((q) => q !== '')
    .join(' AND ');

  const finalQuery = `SELECT * FROM fonds_johannique WHERE ${completeCondition}`;

  console.log(finalQuery);

  pool.query(finalQuery, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });

  res.render('index', { title: 'Express' });
});

router.get('/searchFondsDocumentaire', function (req, res, next) {
  const query = req.query;

  const authorParam = query.author;
  const titleParam = query.title;
  const keywordsParam = query.keywords;
  console.log(authorParam);
  console.log(titleParam);
  console.log(keywordsParam);

  const authorQuery = authorParam
    ? `MATCH(auteur, auteur_bis) AGAINST('${authorParam}')`
    : '';

  const titleQuery = titleParam ? `MATCH(titre) AGAINST('${titleParam}')` : '';

  const keywordsQuery = keywordsParam
    ? `MATCH(cote,type,auteur,titre,couverture,langue,edition,datation,contenu,etat,notes,emplacement) AGAINST ('${keywordsParam}')`
    : '';

  const completeCondition = [authorQuery, titleQuery, keywordsQuery]
    .filter((q) => q !== '')
    .join(' AND ');

  const finalQuery = `SELECT * FROM fonds_documentaire WHERE ${completeCondition}`;

  console.log(finalQuery);

  pool.query(finalQuery, function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
  });

  res.render('index', { title: 'Express' });
});

module.exports = router;
