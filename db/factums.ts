import pool from './pool';
import { QueryResult } from 'pg';
import { StatsDBModel } from './index';

export interface FactumsSearchDBModel {
  id: number;
  cote: string;
  tome: string;
  type: string;
  auteur: string;
  titre: string;
  couverture: string;
  langue: string;
  edition: string;
  datation: string;
  contenu: string;
  etat: string;
  notes: string;
  emplacement: string;
  urls: string;
}

export async function searchFactums(author: string|undefined, title: string|undefined, keywords: string|undefined): Promise<FactumsSearchDBModel[]> {

  let baseQuery =
    `SELECT 
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
        fac.emplacement,
        STRING_AGG(ind.url, \',\') as urls`;

  let secondPart = `
    FROM factums as fac 
    LEFT JOIN index_fiches_total as ind 
    ON (fac.cote=ind.cote)
  `;

  const queryParams = [];
  const tsQueryConditions = [];
  const scoreConditions = [];

  if (author) {
    tsQueryConditions.push(`tsvector_auteur @@ to_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_auteur, to_tsquery('french', $${queryParams.length + 1}))`);
    queryParams.push(author);
  }

  if (title) {
    tsQueryConditions.push(`tsvector_titre @@ to_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_titre, to_tsquery('french', $${queryParams.length + 1}))`);
    queryParams.push(title);
  }

  if (keywords) {
    tsQueryConditions.push(`tsvector_combined @@ to_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_combined, to_tsquery('french', $${queryParams.length + 1}))`);
    queryParams.push(keywords);
  }

  if (tsQueryConditions.length > 0) {
    baseQuery += `, ${scoreConditions.join(' + ')} as score`;
    baseQuery += secondPart;
    baseQuery += ` WHERE (${tsQueryConditions.join(' OR ')})`;
  } else {
    baseQuery += secondPart;
  }

  const finalQuery =
    baseQuery +
    ' GROUP BY fac.id, fac.cote, fac.tome, fac.type, fac.auteur, fac.titre, fac.couverture, fac.langue, fac.edition, fac.datation, fac.contenu, fac.etat, fac.notes, fac.emplacement' +
    ' ORDER BY score DESC';

  const result: QueryResult<FactumsSearchDBModel> = await pool.query(finalQuery, queryParams)
  return result.rows;

}

export async function statsFactums(): Promise<StatsDBModel> {
  let query =
    `SELECT 
        count(*) as count
     FROM factums`;

  const result: QueryResult<StatsDBModel> = await pool.query(query)
  return result.rows[0];
}