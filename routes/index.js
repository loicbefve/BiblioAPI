const express = require('express');
const router = express.Router();
const pool = require('../db/index');
// UTILS
function cleanParam(param) {
  let cleaned_param = param.replace(/@/g, '');
  cleaned_param = cleaned_param.replace(/[+-](\s|$)/g, '$1');
  console.log(cleaned_param);
  return cleaned_param;
}

/* GET home page. */
router.get('/searchImprimes', function (req, res, next) {
  /* GET URI QUERY PARAMETERS */
  const query = req.query;
  const authorParam = decodeURIComponent(query.author);
  const titleParam = decodeURIComponent(query.title);
  const keywordsParam = decodeURIComponent(query.keywords);

  var baseQuery =
    'SELECT imp.*, GROUP_CONCAT(ind.url) as urls FROM imprimes as imp LEFT JOIN index_fiches_total as ind ON (imp.cote=ind.cote) WHERE 1=1';

  const queryParams = [];

  if (authorParam) {
    const cleanedAuthorParam = cleanParam(authorParam);
    baseQuery += ' AND MATCH(auteur) AGAINST(? IN BOOLEAN MODE)';
    queryParams.push(cleanedAuthorParam);
  }

  if (titleParam) {
    const cleanedTitleParam = cleanParam(titleParam);
    baseQuery += ' AND MATCH(titre) AGAINST(? IN BOOLEAN MODE)';
    queryParams.push(cleanedTitleParam);
  }

  if (keywordsParam) {
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    baseQuery +=
      ' AND MATCH(imp.cote,lieu,format,auteur,titre,annee,etat,commentaire) AGAINST (? IN BOOLEAN MODE)';
    queryParams.push(cleanedKeywordsParam);
  }
  const finalQuery =
    baseQuery +
    ' GROUP BY imp.id, imp.epi, imp.travee, imp.tablette, imp.cote, imp.ordre, imp.lieu, imp.format, imp.auteur, imp.titre, imp.annee, imp.tome, imp.etat, imp.commentaire';

  console.log(finalQuery);

  /* QUERY THE DATABASE */
  pool.query(finalQuery, queryParams, function (error, results) {
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

  var baseQuery =
    'SELECT fac.*, GROUP_CONCAT(ind.url) as urls FROM factums as fac LEFT JOIN index_fiches_total as ind ON (fac.cote=ind.cote) WHERE 1=1';

  const queryParams = [];

  if (authorParam) {
    const cleanedAuthorParam = cleanParam(authorParam);
    baseQuery += ' AND MATCH(auteur) AGAINST(? IN BOOLEAN MODE)';
    queryParams.push(cleanedAuthorParam);
  }

  if (titleParam) {
    const cleanedTitleParam = cleanParam(titleParam);
    baseQuery += ' AND MATCH(titre) AGAINST(? IN BOOLEAN MODE)';
    queryParams.push(cleanedTitleParam);
  }

  if (keywordsParam) {
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    baseQuery +=
      ' AND MATCH(fac.cote,type,auteur,titre,couverture,langue,edition,datation,contenu,etat,notes,emplacement) AGAINST (? IN BOOLEAN MODE)';
    queryParams.push(cleanedKeywordsParam);
  }
  const finalQuery =
    baseQuery +
    ' GROUP BY fac.id, fac.cote, fac.tome, fac.type, fac.auteur, fac.titre, fac.couverture, fac.langue, fac.edition, fac.datation, fac.contenu, fac.etat, fac.notes, fac.emplacement';

  /* QUERY THE DATABASE */
  pool.query(finalQuery, queryParams, function (error, results) {
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

  var baseQuery =
    'SELECT fon.*, GROUP_CONCAT(ind.url) as urls FROM fonds_johannique as fon LEFT JOIN index_fiches_total as ind ON (fon.cote=ind.cote) WHERE 1=1';

  const queryParams = [];

  if (authorParam) {
    const cleanedAuthorParam = cleanParam(authorParam);
    baseQuery += ' AND MATCH(auteur) AGAINST(? IN BOOLEAN MODE)';
    queryParams.push(cleanedAuthorParam);
  }

  if (titleParam) {
    const cleanedTitleParam = cleanParam(titleParam);
    baseQuery += ' AND MATCH(titre) AGAINST(? IN BOOLEAN MODE)';
    queryParams.push(cleanedTitleParam);
  }

  if (keywordsParam) {
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    baseQuery +=
      ' AND MATCH(auteur,titre,annee,fon.cote,etat,metrage_ou_commentaire,carton) AGAINST (? IN BOOLEAN MODE)';
    queryParams.push(cleanedKeywordsParam);
  }
  const finalQuery =
    baseQuery +
    ' GROUP BY fon.id, fon.epi, fon.travee, fon.tablette, fon.auteur, fon.titre, fon.annee, fon.cote, fon.tome, fon.etat, fon.metrage_ou_commentaire, fon.carton';

  /* QUERY THE DATABASE */
  pool.query(finalQuery, queryParams, function (error, results) {
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

  var baseQuery = 'SELECT * FROM fonds_documentaire WHERE 1=1';

  const queryParams = [];

  if (authorParam) {
    const cleanedAuthorParam = cleanParam(authorParam);
    baseQuery += ' AND MATCH(auteur,auteur_bis) AGAINST(? IN BOOLEAN MODE)';
    queryParams.push(cleanedAuthorParam);
  }

  if (titleParam) {
    const cleanedTitleParam = cleanParam(titleParam);
    baseQuery += ' AND MATCH(titre) AGAINST(? IN BOOLEAN MODE)';
    queryParams.push(cleanedTitleParam);
  }

  if (keywordsParam) {
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    baseQuery +=
      ' AND MATCH(n_carton,fonds,type_de_document,auteur,auteur_bis,titre,couverture,langue,edition,datation,contenu,etat,ancien_propietaire,notes,don,emplacement_initial_dans_la_bibliotheque) AGAINST (? IN BOOLEAN MODE)';
    queryParams.push(cleanedKeywordsParam);
  }

  const finalQuery = baseQuery;

  pool.query(finalQuery, queryParams, function (error, results, fields) {
    if (error) throw error;

    const json_response = results.map((res) => {
      return {
        metadatas: {
          carton: res.n_carton,
          fonds: res.fonds,
          type_de_document: res.type_de_document,
          auteur: res.auteur,
          auteur_bis: res.auteur_bis,
          titre: res.titre,
          couverture: res.couverture,
          langue: res.langue,
          edition: res.edition,
          datation: res.datation,
          contenu: res.contenu,
          etat: res.etat,
          ancien_proprietaire: res.ancien_proprietaire,
          notes: res.notes,
          don: res.don,
          emplacement_initiale_dans_la_bibliotheque:
            res.emplacement_initiale_dans_la_bibliotheque,
        },
        urls: [],
      };
    });

    res.json(json_response);
  });
});

router.get('/searchManuscrits', function (req, res, next) {
  const query = req.query;

  const keywordsParam = decodeURIComponent(query.keywords);

  var baseQuery = 'SELECT * FROM manuscrits WHERE 1=1';

  const queryParams = [];

  if (keywordsParam) {
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    baseQuery += ' AND MATCH(commentaires) AGAINST (? IN BOOLEAN MODE)';
    queryParams.push(cleanedKeywordsParam);
  }

  const finalQuery = baseQuery;

  pool.query(finalQuery, queryParams, function (error, results, fields) {
    if (error) throw error;

    const json_response = results.map((res) => {
      return {
        metadatas: {
          commentaires: res.commentaires,
        },
      };
    });

    res.json(json_response);
  });
});
router.get('/searchIndexPaysLorrain', function (req, res, next) {
  const query = req.query;

  const keywordsParam = decodeURIComponent(query.keywords);

  var baseQuery = 'SELECT * FROM index_pays_lorrain WHERE 1=1';

  const queryParams = [];

  if (keywordsParam) {
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    baseQuery += ' AND MATCH(commentaires) AGAINST (? IN BOOLEAN MODE)';
    queryParams.push(cleanedKeywordsParam);
  }

  const finalQuery = baseQuery;

  pool.query(finalQuery, queryParams, function (error, results, fields) {
    if (error) throw error;

    const json_response = results.map((res) => {
      return {
        metadatas: {
          commentaires: res.commentaires,
        },
      };
    });

    res.json(json_response);
  });
});

module.exports = router;
