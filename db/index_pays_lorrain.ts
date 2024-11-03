import pool from './pool';
import { QueryResult } from 'pg';
import { StatsDBModel } from './index';

export interface IndexPaysLorrainSearchDBModel {
  id: number;
  commentaires: string;
}

export async function searchIndexPaysLorrain(keywords: string|undefined): Promise<IndexPaysLorrainSearchDBModel[]> {

  let query =
    `SELECT 
        ipl.id,
        ipl.commentaires
    `;

  let secondPart = `
    FROM index_pays_lorrain as ipl 
  `;

  let groupPart = ' GROUP BY ipl.id, ipl.commentaires'
  let orderPart = ' ORDER BY score DESC';

  const queryParams = [];
  const tsQueryConditions = [];
  const scoreConditions = [];

  if (keywords) {
    tsQueryConditions.push(`tsvector_commentaires @@ plainto_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_commentaires, plainto_tsquery('french', $${queryParams.length + 1}))`);
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

  const result: QueryResult<IndexPaysLorrainSearchDBModel> = await pool.query(query, queryParams)
  return result.rows;

}

export async function statsIndexPaysLorrain(): Promise<StatsDBModel> {
  let query =
    `SELECT 
        count(*) as count
     FROM index_pays_lorrain`;

  const result: QueryResult<StatsDBModel> = await pool.query(query)
  return result.rows[0];
}