import express, { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { mapSearchImprimeListToApi } from '../mappers/imprimes';
import { mapSearchFactumsListToApi } from '../mappers/factums';
import { mapSearchFondsJohanniqueListToApi } from '../mappers/fonds_johannique';
import { mapSearchFondsDocumentaireListToApi } from '../mappers/fonds_documentaire';
import { mapSearchManuscritsListToApi } from '../mappers/manuscrits';
import { mapSearchIndexPaysLorrainListToApi } from '../mappers/index_pays_lorrain';

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

router.get('/search/imprimes', async (req: Request, res: Response, _next: NextFunction) => {

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

router.get('/search/factums', async (req: Request, res: Response, _next: NextFunction) => {
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

router.get('/search/fonds_johannique', async (req: Request, res: Response, _next: NextFunction) => {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { author, title, keywords } = req.query;
  let cleanedAuthorParam = processParam(author);
  let cleanedTitleParam = processParam(title);
  let cleanedKeywordsParam = processParam(keywords);

  try {
    const dbResult = await db.searchFondsJohannique(cleanedAuthorParam, cleanedTitleParam, cleanedKeywordsParam)
    const apiResult = mapSearchFondsJohanniqueListToApi(dbResult);
    res.json(apiResult);
  } catch (error) {
    console.error('Failed querying the DB for searchFondsJohannique', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.get('/search/fonds_documentaire', async (req: Request, res: Response, _next: NextFunction) => {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { author, title, keywords } = req.query;
  let cleanedAuthorParam = processParam(author);
  let cleanedTitleParam = processParam(title);
  let cleanedKeywordsParam = processParam(keywords);

  try {
    const dbResult = await db.searchFondsDocumentaire(cleanedAuthorParam, cleanedTitleParam, cleanedKeywordsParam)
    const apiResult = mapSearchFondsDocumentaireListToApi(dbResult);
    res.json(apiResult);
  } catch (error) {
    console.error('Failed querying the DB for searchFondsDocumentaire', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.get('/search/manuscrits', async (req: Request, res: Response, _next: NextFunction) => {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { keywords } = req.query;
  let cleanedKeywordsParam = processParam(keywords);

  try {
    const dbResult = await db.searchManuscrits(cleanedKeywordsParam)
    const apiResult = mapSearchManuscritsListToApi(dbResult);
    res.json(apiResult);
  } catch (error) {
    console.error('Failed querying the DB for searchManuscrits', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.get('/search/index_pays_lorrain', async (req: Request, res: Response, _next: NextFunction) => {
  /* GET URI QUERY PARAMETERS AND VALIDATE THEM */
  const { keywords } = req.query;
  let cleanedKeywordsParam = processParam(keywords);

  try {
    const dbResult = await db.searchIndexPaysLorrain(cleanedKeywordsParam)
    const apiResult = mapSearchIndexPaysLorrainListToApi(dbResult);
    res.json(apiResult);
  } catch (error) {
    console.error('Failed querying the DB for searchManuscrits', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats/imprimes', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const dbResult = await db.statsImprimes();
    res.json(dbResult);
  } catch (error) {
    console.error('Failed querying the DB for statsImprimes', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats/factums', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const dbResult = await db.statsFactums();
    res.json(dbResult);
  } catch (error) {
    console.error('Failed querying the DB for statsImprimes', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats/fonds_documentaire', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const dbResult = await db.statsFondsDocumentaire();
    res.json(dbResult);
  } catch (error) {
    console.error('Failed querying the DB for statsImprimes', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats/fonds_johannique', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const dbResult = await db.statsFondsJohannique();
    res.json(dbResult);
  } catch (error) {
    console.error('Failed querying the DB for statsImprimes', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats/manuscrits', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const dbResult = await db.statsManuscrits();
    res.json(dbResult);
  } catch (error) {
    console.error('Failed querying the DB for statsImprimes', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats/index_pays_lorrain', async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const dbResult = await db.statsIndexPaysLorrain();
    res.json(dbResult);
  } catch (error) {
    console.error('Failed querying the DB for statsImprimes', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
