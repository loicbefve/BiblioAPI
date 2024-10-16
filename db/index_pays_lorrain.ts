import pool from './pool';
import { QueryResult } from 'pg';

export interface IndexPaysLorrainSearchDBModel {
  id: number;
  commentaires: string;
}

export async function searchIndexPaysLorrain(keywords: string|undefined): Promise<IndexPaysLorrainSearchDBModel[]> {

  let baseQuery =
    `SELECT 
        ipl.id,
        ipl.commentaires
    `;

  let secondPart = `
    FROM index_pays_lorrain as ipl 
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
    ' GROUP BY ipl.id, ipl.commentaires' +
    ' ORDER BY score DESC';

  const result: QueryResult<IndexPaysLorrainSearchDBModel> = await pool.query(finalQuery, queryParams)
  return result.rows;

}