import pool from './pool';
import { QueryResult } from 'pg';
import { StatsDBModel } from './index';

export interface ImprimesSearchDBModel {
  id: number;
  epi: string;
  travee: string;
  tablette: string;
  cote: string;
  ordre: string;
  lieu: string;
  format: string;
  auteur: string;
  titre: string;
  annee: string;
  tome: string;
  etat: string;
  commentaire: string;
  urls: string;
}

export async function searchImprimes(author: string|undefined, title: string|undefined, keywords: string|undefined): Promise<ImprimesSearchDBModel[]> {
  let query =
    `SELECT 
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
        imp.commentaire,
        STRING_AGG(ind.url, ',') as urls`;

  let secondPart = `
     FROM imprimes as imp
     LEFT JOIN index_fiches_total as ind
     ON (imp.cote = ind.cote)
     `;

  let groupPart = ' GROUP BY imp.id, imp.epi, imp.travee, imp.tablette, imp.cote, imp.ordre, imp.lieu, imp.format, imp.auteur, imp.titre, imp.annee, imp.tome, imp.etat, imp.commentaire'
  let orderPart = ' ORDER BY score DESC';

  const queryParams = [];
  const tsQueryConditions = [];
  const scoreConditions = [];

  if (author) {
    tsQueryConditions.push(`tsvector_auteur @@ plainto_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_auteur, plainto_tsquery('french', $${queryParams.length + 1}))`);
    queryParams.push(author);
  }

  if (title) {
    tsQueryConditions.push(`tsvector_titre @@ plainplainto_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_titre, plainplainto_tsquery('french', $${queryParams.length + 1}))`);
    queryParams.push(title);
  }

  if (keywords) {
    tsQueryConditions.push(`tsvector_combined @@ plainto_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_combined, plainto_tsquery('french', $${queryParams.length + 1}))`);
    queryParams.push(keywords);
  }

  if (tsQueryConditions.length > 0) {
    query += `, ${scoreConditions.join(' + ')} as score`;
    query += secondPart;
    query += ` WHERE (${tsQueryConditions.join(' OR ')})`;
    query += groupPart;
    query += orderPart;
  } else {
    query += secondPart;
    query += groupPart;
  }



  const result: QueryResult<ImprimesSearchDBModel> = await pool.query(query, queryParams)
  return result.rows;

}

export async function statsImprimes(): Promise<StatsDBModel> {
  let query =
    `SELECT 
        count(*) as count
     FROM imprimes`;

  const result: QueryResult<StatsDBModel> = await pool.query(query)
  return result.rows[0];
}