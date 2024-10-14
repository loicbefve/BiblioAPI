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
        STRING_AGG(ind.url, ',') as urls
     FROM imprimes as imp
     LEFT JOIN index_fiches_total as ind
     ON (imp.cote = ind.cote)
     WHERE 1 = 1`;

  const queryParams = [];
  const tsQueryConditions = [];

  if (author) {
    tsQueryConditions.push(`tsvector_auteur @@ to_tsquery('french', $${queryParams.length + 1})`);
    queryParams.push(author);
  }

  if (title) {
    tsQueryConditions.push(`tsvector_titre @@ to_tsquery('french', $${queryParams.length + 1})`);
    queryParams.push(title);
  }

  if (keywords) {
    tsQueryConditions.push(`tsvector_combined @@ to_tsquery('french', $${queryParams.length + 1})`);
    queryParams.push(keywords);
  }

  if (tsQueryConditions.length > 0) {
    baseQuery += ` AND (${tsQueryConditions.join(' OR ')})`;
  }

  const finalQuery =
    baseQuery +
    ' GROUP BY imp.id, imp.epi, imp.travee, imp.tablette, imp.cote, imp.ordre, imp.lieu, imp.format, imp.auteur, imp.titre, imp.annee, imp.tome, imp.etat, imp.commentaire';


  const result: QueryResult<ImprimesSearchDBModel> = await pool.query(finalQuery, queryParams)
  return result.rows;

}