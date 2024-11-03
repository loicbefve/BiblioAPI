import pool from './pool';
import { QueryResult } from 'pg';
import { StatsDBModel } from './index';
import logger from 'morgan';

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
  console.log('searchFondsJohannique');
  let query =
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

  let groupPart = ' GROUP BY fon.id, fon.epi, fon.travee, fon.tablette, fon.auteur, fon.titre, fon.annee, fon.cote, fon.tome, fon.etat, fon.metrage_ou_commentaire, fon.carton'
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
    tsQueryConditions.push(`tsvector_titre @@ plainto_tsquery('french', $${queryParams.length + 1})`);
    scoreConditions.push(`ts_rank(tsvector_titre, plainto_tsquery('french', $${queryParams.length + 1}))`);
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


  const result: QueryResult<FondsJohanniqueSearchDBModel> = await pool.query(query, queryParams)
  return result.rows;

}

export async function statsFondsJohannique(): Promise<StatsDBModel> {
  let query =
    `SELECT 
        count(*) as count
     FROM fonds_johannique`;

  const result: QueryResult<StatsDBModel> = await pool.query(query)
  return result.rows[0];
}