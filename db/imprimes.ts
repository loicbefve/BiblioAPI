import pool from './pool';
import { QueryResult } from 'pg';

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
  let baseQuery =
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
    ' GROUP BY imp.id, imp.epi, imp.travee, imp.tablette, imp.cote, imp.ordre, imp.lieu, imp.format, imp.auteur, imp.titre, imp.annee, imp.tome, imp.etat, imp.commentaire' +
    ' ORDER BY score DESC';

  console.log(finalQuery);
  const result: QueryResult<ImprimesSearchDBModel> = await pool.query(finalQuery, queryParams)
  return result.rows;

}