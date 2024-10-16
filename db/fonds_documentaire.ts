import pool from './pool';
import { QueryResult } from 'pg';

export interface FondsDocumentaireSearchDBModel {
  id: number;
  n_carton: string;
  fonds: string;
  type_de_document: string;
  auteur: string;
  auteur_bis: string;
  titre: string;
  couverture: string;
  langue: string;
  edition: string;
  datation: string;
  contenu: string;
  etat: string;
  ancien_proprietaire: string;
  notes: string;
  don: string;
  emplacement_initial_dans_la_bibliotheque: string;
}



export async function searchFondsDocumentaire(author: string|undefined, title: string|undefined, keywords: string|undefined): Promise<FondsDocumentaireSearchDBModel[]> {
  let query =
    `SELECT 
        fon.id,
        fon.n_carton,
        fon.fonds,
        fon.type_de_document,
        fon.auteur,
        fon.auteur_bis,
        fon.titre,
        fon.couverture,
        fon.langue,
        fon.edition,
        fon.datation,
        fon.contenu,
        fon.etat,
        fon.ancien_proprietaire,
        fon.notes,
        fon.don,
        fon.emplacement_initial_dans_la_bibliotheque`;

  let secondPart = `
     FROM fonds_documentaire as fon 
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
    query += `, ${scoreConditions.join(' + ')} as score`;
    query += secondPart;
    query += ` WHERE (${tsQueryConditions.join(' OR ')})`;
  } else {
    query += secondPart;
  }

  const result: QueryResult<FondsDocumentaireSearchDBModel> = await pool.query(query, queryParams)
  return result.rows;

}