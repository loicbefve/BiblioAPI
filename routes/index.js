const express = require('express');
const router = express.Router();
const pool = require('../db/index');

/* GET home page. */
router.get('/searchImprimes', function (req, res, next) {
  /* GET URI QUERY PARAMETERS */
  const query = req.query;
  const authorParam = query.author;
  const titleParam = query.title;
  const keywordsParam = query.keywords;

  /* TRANSFORM URI QUERY PARAMETERS INTO SQL STATEMENTS */
  const authorQuery =
    authorParam !== ''
      ? `MATCH(auteur) AGAINST('${authorParam}' IN BOOLEAN MODE)`
      : '';

  const titleQuery =
    titleParam !== ''
      ? `MATCH(titre) AGAINST('${titleParam}' IN BOOLEAN MODE)`
      : '';

  const keywordsQuery =
    keywordsParam !== ''
      ? `MATCH(imp.cote,lieu,format,auteur,titre,annee,etat,commentaire) AGAINST ('${keywordsParam}' IN BOOLEAN MODE)`
      : '';

  /* I JOINED THE CONDITIONS TOGETHER FILTERING EMPTY ONES */
  const joinedConditions = [authorQuery, titleQuery, keywordsQuery]
    .filter((query) => query !== '')
    .join(' AND ');

  /* IF NO CONDITIONS AT ALL THEN THE CONDITION IS 1=1 */
  const finalCondition = joinedConditions === '' ? '1=1' : joinedConditions;

  const finalQuery = `SELECT imp.*, GROUP_CONCAT(ind.url) as urls 
                      FROM imprimes as imp 
                      LEFT JOIN index_fiches_total as ind 
                      ON (imp.cote=ind.cote) 
                      WHERE ${finalCondition} 
                      GROUP BY 
                        imp.id,
                        imp.epi,
                        imp.travee,
                        imp.tablette,
                        imp.cote,
                        imp.ordre,
                        imp.lieu,
                        imp.format,
                        imp.auteur,
                        imp.titre,
                        imp.annee,
                        imp.tome,
                        imp.etat,
                        imp.commentaire
                        `;

  /* QUERY THE DATABASE */
  pool.query(finalQuery, function (error, results) {
    if (error) throw error;
    /* Transform the result into a JSON object to send */
    const json_response = results.map((res) => {
      return {
        metadatas: {
          epi: res.epi,
          travee: res.travee,
          tablette: res.tablette,
          cote: res.cote,
          ordre: res.ordre,
          lieu: res.lieu,
          format: res.format,
          auteur: res.auteur,
          titre: res.titre,
          annee: res.annee,
          tome: res.tome,
          etat: res.etat,
          commentaire: res.commentaire,
        },
        urls: res.urls ? res.urls.split(',') : [],
      };
    });

    res.json(json_response);
  });
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
    ? `MATCH(auteur,titre,annee,cote,etat,metrage_ou_commentaire,carton) AGAINST ('${keywordsParam}')`
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
    ? `MATCH(n_carton,fonds,type_de_document,auteur,auteur_bis,titre,couverture,langue,edition,datation,contenu,etat,ancien_propietaire,notes,don,emplacement_initial_dans_la_bibliotheque) AGAINST ('${keywordsParam}')`
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
