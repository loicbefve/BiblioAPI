import { FactumsSearchDBModel } from '../db/factums';

export interface SearchFactumsApiModel {
  metadatas: {
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
  },
  urls: string[]
}

// Function to map DB model to API model
export function mapSearchFactumsToApi(factums: FactumsSearchDBModel): SearchFactumsApiModel {
  return {
    metadatas: {
      cote: factums.cote,
      tome: factums.tome,
      type: factums.type,
      auteur: factums.auteur,
      titre: factums.titre,
      couverture: factums.couverture,
      langue: factums.langue,
      edition: factums.edition,
      datation: factums.datation,
      contenu: factums.contenu,
      etat: factums.etat,
      notes: factums.notes,
      emplacement: factums.emplacement
    },
    urls: factums.urls ? factums.urls.split(',') : []
  };
}

// Function to map a list of searchFactums
export function mapSearchFactumsListToApi(factums: FactumsSearchDBModel[]): SearchFactumsApiModel[] {
  return factums.map(mapSearchFactumsToApi);
}
