import express from 'express';

const router = express.Router();
import db from '../db';
import logger from 'morgan';
import createError from 'http-errors';

// UTILS
function cleanParam(param: string): string {
  let cleaned_param = param.replace(/@/g, '');
  cleaned_param = cleaned_param.replace(/[+-](\s|$)/g, '$1');
  return cleaned_param;
}

/* GET home page. */
router.get('/searchImprimes', async function(req, res, next) {
  /* GET URI QUERY PARAMETERS */
  console.log(req.query);
  const { author, title, keywords } = req.query;
  if (author && typeof author !== 'string') {
    return res.status(400).json({ error: 'Invalid author parameter' });
  }
  if (title && typeof title !== 'string') {
    return res.status(400).json({ error: 'Invalid title parameter' });
  }
  if (keywords && typeof keywords !== 'string') {
    return res.status(400).json({ error: 'Invalid keywords parameter' });
  }

  // TODO: DB stuff should go to the db folder
  let baseQuery =
    `SELECT imp.*, STRING_AGG(ind.url, ',') as urls
     FROM imprimes as imp
              LEFT JOIN index_fiches_total as ind
                        ON (imp.cote = ind.cote)
     WHERE 1 = 1`;

  const queryParams = [];
  const tsQueryConditions = [];

  if (author) {
    const authorParam = decodeURIComponent(author);
    const cleanedAuthorParam = cleanParam(authorParam);
    tsQueryConditions.push(`tsvector_auteur @@ to_tsquery('french', $${queryParams.length + 1})`);
    queryParams.push(cleanedAuthorParam);
  }

  if (title) {
    const titleParam = decodeURIComponent(title);
    const cleanedTitleParam = cleanParam(titleParam);
    tsQueryConditions.push(`tsvector_titre @@ to_tsquery('french', $${queryParams.length + 1})`);
    queryParams.push(cleanedTitleParam);
  }

  if (keywords) {
    const keywordsParam = decodeURIComponent(keywords);
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    tsQueryConditions.push(`tsvector_combined @@ to_tsquery('french', $${queryParams.length + 1})`);
    queryParams.push(cleanedKeywordsParam);
  }

  if (tsQueryConditions.length > 0) {
    baseQuery += ` AND (${tsQueryConditions.join(' OR ')})`;
  }

  const finalQuery =
    baseQuery +
    ' GROUP BY imp.id, imp.epi, imp.travee, imp.tablette, imp.cote, imp.ordre, imp.lieu, imp.format, imp.auteur, imp.titre, imp.annee, imp.tome, imp.etat, imp.commentaire';


  /* QUERY THE DATABASE */
  try {


    const result = await db.query(finalQuery, queryParams);
    /* Transform the result into a JSON object to send */
    const json_response = result.rows.map((res) => {
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
          score: res.score
        },
        urls: res.urls ? res.urls.split(',') : []
      };
    });

    console.log(finalQuery);

    res.json(json_response);
  } catch (err) {
    console.error('Failed querying the DB for searchImprimes', err);
    return res.status(500).json({ error: 'Internal server error' });
  }

  // console.error('Failed querying the DB for searchImprimes',error);
  // res.status(500).json({ error: 'Internal server error' });

});

router.get('/searchFactums', function(req, res, next) {
  /* GET URI QUERY PARAMETERS */
  const query = req.query;
  const authorParam = decodeURIComponent(query.author);
  const titleParam = decodeURIComponent(query.title);
  const keywordsParam = decodeURIComponent(query.keywords);

  var baseQuery =
    'SELECT fac.*, STRING_AGG(ind.url, \',\') as urls FROM factums as fac LEFT JOIN index_fiches_total as ind ON (fac.cote=ind.cote) WHERE 1=1';

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
  db.query(finalQuery, queryParams)
    .then((results) => {
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
            emplacement: res.emplacement
          },
          urls: res.urls ? res.urls.split(',') : []
        };
      });

      res.json(json_response);
    })
    .catch((error) => {
      console.error('Failed querying the DB for searchFactums', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.get('/searchFondsJohannique', function(req, res, next) {
  /* GET URI QUERY PARAMETERS */
  const query = req.query;
  const authorParam = decodeURIComponent(query.author);
  const titleParam = decodeURIComponent(query.title);
  const keywordsParam = decodeURIComponent(query.keywords);

  var baseQuery =
    'SELECT fon.*, STRING_AGG(ind.url, \',\') as urls FROM fonds_johannique as fon LEFT JOIN index_fiches_total as ind ON (fon.cote=ind.cote) WHERE 1=1';

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
  db.query(finalQuery, queryParams)
    .then((results) => {
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
            carton: res.carton
          },
          urls: res.urls ? res.urls.split(',') : []
        };
      });

      res.json(json_response);
    })
    .catch((error) => {
      console.error('Failed querying the DB for searchFondsJohannique', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.get('/searchFondsDocumentaire', function(req, res, next) {
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

  db.query(finalQuery, queryParams)
    .then((results) => {
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
            res.emplacement_initiale_dans_la_bibliotheque
          },
          urls: []
        };
      });

      res.json(json_response);
    })
    .catch((error) => {
      console.error('Failed querying the DB for searchFondsDocumentaire', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.get('/searchManuscrits', function(req, res, next) {
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

  db.query(finalQuery, queryParams)
    .then((results) => {
      if (error) throw error;

      const json_response = results.map((res) => {
        return {
          metadatas: {
            commentaires: res.commentaires
          }
        };
      });

      res.json(json_response);
    })
    .catch((error) => {
      console.error('Failed querying the DB for searchManuscrits', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});
router.get('/searchIndexPaysLorrain', function(req, res, next) {
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

  db.query(finalQuery, queryParams)
    .then((results) => {

      const json_response = results.map((res) => {
        return {
          metadatas: {
            commentaires: res.commentaires
          }
        };
      });

      res.json(json_response);
    })
    .catch((error) => {
      console.error('Failed querying the DB for searchIndexPaysLorrain', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

export default router;