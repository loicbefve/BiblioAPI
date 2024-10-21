import pool from './pool';
import { QueryResult } from 'pg';
import { StatsDBModel } from './index';

export interface ManuscritsSearchDBModel {
  id: number;
  commentaires: string;
}

export async function searchManuscrits(keywords: string|undefined): Promise<ManuscritsSearchDBModel[]> {

  let baseQuery =
    `SELECT 
        man.id,
        man.commentaires
    `;

  let secondPart = `
    FROM manuscrits as man 
  `;

  const queryParams = [];
  const tsQueryConditions = [];
  const scoreConditions = [];

  if (keywords) {
    tsQueryConditions.push(`tsvector_commentaires @@ to_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_commentaires, to_tsquery('french', $${queryParams.length + 1}))`);
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
    ' GROUP BY man.id, man.commentaires' +
    ' ORDER BY score DESC';

  const result: QueryResult<ManuscritsSearchDBModel> = await pool.query(finalQuery, queryParams)
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