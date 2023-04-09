const express = require('express');
const router = express.Router();
const pool = require('../db/index');

/* GET home page. */
router.get('/searchImprimes', function (req, res, next) {
  /* GET URI QUERY PARAMETERS */
  const query = req.query;
  const authorParam = decodeURIComponent(query.author);
  const titleParam = decodeURIComponent(query.title);
  const keywordsParam = decodeURIComponent(query.keywords);

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

  const finalQuery = `SELECT imp.*, GROUP_CONCAT(ind.url) as urls, ${finalCondition}  as score
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
          score: res.score,
        },
        urls: res.urls ? res.urls.split(',') : [],
      };
    });

    console.log(finalQuery);

    res.json(json_response);
  });
});

router.get('/searchFactums', function (req, res, next) {
  /* GET URI QUERY PARAMETERS */
  const query = req.query;
  const authorParam = decodeURIComponent(query.author);
  const titleParam = decodeURIComponent(query.title);
  const keywordsParam = decodeURIComponent(query.keywords);

  /* TRANSFORM URI QUERY PARAMETERS INTO SQL STATEMENTS */
  const authorQuery =
    authorParam !== '' ? `MATCH(auteur) AGAINST('${authorParam}')` : '';

  const titleQuery =
    titleParam !== '' ? `MATCH(titre) AGAINST('${titleParam}')` : '';

  const keywordsQuery =
    keywordsParam !== ''
      ? `MATCH(fac.cote,type,auteur,titre,couverture,langue,edition,datation,contenu,etat,notes,emplacement) AGAINST ('${keywordsParam}')`
      : '';

  /* I JOINED THE CONDITIONS TOGETHER FILTERING EMPTY ONES */
  const joinedConditions = [authorQuery, titleQuery, keywordsQuery]
    .filter((query) => query !== '')
    .join(' AND ');

  /* IF NO CONDITIONS AT ALL THEN THE CONDITION IS 1=1 */
  const finalCondition = joinedConditions === '' ? '1=1' : joinedConditions;

  const finalQuery = `SELECT fac.*, GROUP_CONCAT(ind.url) as urls 
                      FROM factums as fac 
                      LEFT JOIN index_fiches_total as ind 
                      ON (fac.cote=ind.cote) 
                      WHERE ${finalCondition} 
                      GROUP BY 
                        fac.id,
                        fac.cote,
                        fac.tome,
                        fac.type,
                        fac.auteur,
                        fac.titre,
                        fac.couverture,
                        fac.langue,
                        fac.edition,
                        fac.datation,
                        fac.contenu,
                        fac.etat,
                        fac.notes,
                        fac.emplacement
                        `;

  /* QUERY THE DATABASE */
  pool.query(finalQuery, function (error, results) {
    if (error) throw error;
    /* Transform the result into a JSON object to send */
    const json_response = results.map((res) => {
      return {
        metadatas: {
          cote: res.cote,
          tome: res.tome,
          type: res.type,
          auteur: res.auteur,
          titre: res.titre,
          couverture: res.couverture,
          langue: res.langue,
          edition: res.edition,
          datation: res.datation,
          contenu: res.contenu,
          etat: res.etat,
          notes: res.notes,
          emplacement: res.emplacement,
        },
        urls: res.urls ? res.urls.split(',') : [],
      };
    });

    res.json(json_response);
  });
});

router.get('/searchFondsJohannique', function (req, res, next) {
  /* GET URI QUERY PARAMETERS */
  const query = req.query;
  const authorParam = decodeURIComponent(query.author);
  const titleParam = decodeURIComponent(query.title);
  const keywordsParam = decodeURIComponent(query.keywords);

  /* TRANSFORM URI QUERY PARAMETERS INTO SQL STATEMENTS */
  const authorQuery =
    authorParam !== '' ? `MATCH(auteur) AGAINST('${authorParam}')` : '';

  const titleQuery =
    titleParam !== '' ? `MATCH(titre) AGAINST('${titleParam}')` : '';

  const keywordsQuery =
    keywordsParam !== ''
      ? `MATCH(auteur,titre,annee,fon.cote,etat,metrage_ou_commentaire,carton) AGAINST ('${keywordsParam}')`
      : '';

  /* I JOINED THE CONDITIONS TOGETHER FILTERING EMPTY ONES */
  const joinedConditions = [authorQuery, titleQuery, keywordsQuery]
    .filter((query) => query !== '')
    .join(' AND ');

  /* IF NO CONDITIONS AT ALL THEN THE CONDITION IS 1=1 */
  const finalCondition = joinedConditions === '' ? '1=1' : joinedConditions;

  const finalQuery = `SELECT fon.*, GROUP_CONCAT(ind.url) as urls 
                      FROM fonds_johannique as fon 
                      LEFT JOIN index_fiches_total as ind 
                      ON (fon.cote=ind.cote) 
                      WHERE ${finalCondition} 
                      GROUP BY 
                        fon.id,
                        fon.epi,
                        fon.travee,
                        fon.tablette,
                        fon.auteur,
                        fon.titre,
                        fon.annee,
                        fon.cote,
                        fon.tome,
                        fon.etat,
                        fon.metrage_ou_commentaire,
                        fon.carton
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
          auteur: res.auteur,
          titre: res.titre,
          annee: res.annee,
          cote: res.cote,
          tome: res.tome,
          etat: res.etat,
          metrage_ou_commentaire: res.metrage_ou_commentaire,
          carton: res.carton,
        },
        urls: res.urls ? res.urls.split(',') : [],
      };
    });

    res.json(json_response);
  });
});

router.get('/searchFondsDocumentaire', function (req, res, next) {
  const query = req.query;

  const authorParam = decodeURIComponent(query.author);
  const titleParam = decodeURIComponent(query.title);
  const keywordsParam = decodeURIComponent(query.keywords);

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
