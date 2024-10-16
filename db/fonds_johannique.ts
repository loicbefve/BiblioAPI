import pool from './pool';
import { QueryResult } from 'pg';

export interface FondsJohanniqueSearchDBModel {
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



export async function searchFondsJohannique(author: string|undefined, title: string|undefined, keywords: string|undefined): Promise<FondsJohanniqueSearchDBModel[]> {
  let baseQuery =
    `SELECT 
        fon.id,
        fon.epi,
        fon.travee,
        fon.tablette,
        fon.auteur,
        fon.titre,
        fon.annee,
        fon.cote,
        fon.tome,
        fon.etat,
        fon.metrage_ou_commentaire,
        fon.carton,
        STRING_AGG(ind.url, ',') as urls`;

  let secondPart = `
     FROM fonds_johannique as fon 
     LEFT JOIN index_fiches_total as ind 
     ON (fon.cote=ind.cote)
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
    ' GROUP BY fon.id, fon.epi, fon.travee, fon.tablette, fon.auteur, fon.titre, fon.annee, fon.cote, fon.tome, fon.etat, fon.metrage_ou_commentaire, fon.carton' +
    ' ORDER BY score DESC';

  const result: QueryResult<FondsJohanniqueSearchDBModel> = await pool.query(finalQuery, queryParams)
  return result.rows;

}