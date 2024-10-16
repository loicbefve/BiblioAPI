import express, { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { mapSearchImprimeListToApi, mapSearchImprimeToApi } from '../mappers/imprimes';
import { mapSearchFactumsListToApi } from '../mappers/factums';

const router = express.Router();

// UTILS
function cleanParam(param: string): string {
  let cleaned_param = param.replace(/@/g, '');
  cleaned_param = cleaned_param.replace(/[+-](\s|$)/g, '$1');
  return cleaned_param;
}

function processParam(param: any): string | undefined {
  if (!param) return undefined;
  else if (typeof param !== 'string') return undefined;
  return cleanParam(decodeURIComponent(param));
}

router.get('/searchImprimes', async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { author, title, keywords } = req.query;
  let cleanedAuthorParam = processParam(author);
  let cleanedTitleParam = processParam(title);
  let cleanedKeywordsParam = processParam(keywords);

  try {
    const dbResult = await db.searchImprimes(cleanedAuthorParam, cleanedTitleParam, cleanedKeywordsParam)
    const apiResult = mapSearchImprimeListToApi(dbResult);
    res.json(apiResult);
  } catch (error) {
    console.error('Failed querying the DB for searchImprimes', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.get('/searchFactums', async (req: Request, res: Response, _next: NextFunction) => {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { author, title, keywords } = req.query;
  let cleanedAuthorParam = processParam(author);
  let cleanedTitleParam = processParam(title);
  let cleanedKeywordsParam = processParam(keywords);

  try {
    const dbResult = await db.searchFactums(cleanedAuthorParam, cleanedTitleParam, cleanedKeywordsParam)
    const apiResult = mapSearchFactumsListToApi(dbResult);
    res.json(apiResult);
  } catch (error) {
    console.error('Failed querying the DB for searchFactums', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.get('/searchFondsJohannique', function(req: Request, res: Response, _next: NextFunction) {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { author, title, keywords } = req.query;
  let cleanedAuthorParam = processParam(author);
  let cleanedTitleParam = processParam(title);
  let cleanedKeywordsParam = processParam(keywords);


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
  pool.query(finalQuery, queryParams)
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

router.get('/searchFondsDocumentaire', async (req: Request, res: Response, _next: NextFunction) => {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { author, title, keywords } = req.query;
  let cleanedAuthorParam = processParam(author);
  let cleanedTitleParam = processParam(title);
  let cleanedKeywordsParam = processParam(keywords);

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

  pool.query(finalQuery, queryParams)
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

router.get('/searchManuscrits', async (req: Request, res: Response, _next: NextFunction) => {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { keywords } = req.query;
  let cleanedKeywordsParam = processParam(keywords);

  var baseQuery = 'SELECT * FROM manuscrits WHERE 1=1';

  const queryParams = [];

  if (keywordsParam) {
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    baseQuery += ' AND MATCH(commentaires) AGAINST (? IN BOOLEAN MODE)';
    queryParams.push(cleanedKeywordsParam);
  }

  const finalQuery = baseQuery;

  pool.query(finalQuery, queryParams)
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

router.get('/searchIndexPaysLorrain', async (req: Request, res: Response, _next: NextFunction) => {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { author, title, keywords } = req.query;
  let cleanedKeywordsParam = processParam(keywords);

  var baseQuery = 'SELECT * FROM index_pays_lorrain WHERE 1=1';

  const queryParams = [];

  if (keywordsParam) {
    const cleanedKeywordsParam = cleanParam(keywordsParam);
    baseQuery += ' AND MATCH(commentaires) AGAINST (? IN BOOLEAN MODE)';
    queryParams.push(cleanedKeywordsParam);
  }

  const finalQuery = baseQuery;

  pool.query(finalQuery, queryParams)
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
