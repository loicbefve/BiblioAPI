import pool from './pool';
import { QueryResult } from 'pg';
import { StatsDBModel } from './index';

export interface ManuscritsSearchDBModel {
  id: number;
  commentaires: string;
}

export async function searchManuscrits(keywords: string|undefined): Promise<ManuscritsSearchDBModel[]> {

  let query =
    `SELECT 
        man.id,
        man.commentaires
    `;

  let secondPart = `
    FROM manuscrits as man 
  `;

  let groupPart = ' GROUP BY man.id, man.commentaires'
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

  const result: QueryResult<ManuscritsSearchDBModel> = await pool.query(query, queryParams)
  return result.rows;

}

export async function statsManuscrits(): Promise<StatsDBModel> {
  let query =
    `SELECT 
        count(*) as count
     FROM manuscrits`;

  const result: QueryResult<StatsDBModel> = await pool.query(query)
  return result.rows[0];
}