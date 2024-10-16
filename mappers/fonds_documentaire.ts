import { FondsDocumentaireSearchDBModel } from '../db/fonds_documentaire';

export interface SearchFondsDocumentaireApiModel {
  metadatas: {
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
  },
  urls: string[]
}

// Function to map DB model to API model
export function mapSearchFondsDocumentaireToApi(fondsDocumentaire: FondsDocumentaireSearchDBModel): SearchFondsDocumentaireApiModel {
  return {
    metadatas: {
      n_carton: fondsDocumentaire.n_carton,
      fonds: fondsDocumentaire.fonds,
      type_de_document: fondsDocumentaire.type_de_document,
      auteur: fondsDocumentaire.auteur,
      auteur_bis: fondsDocumentaire.auteur_bis,
      titre: fondsDocumentaire.titre,
      couverture: fondsDocumentaire.couverture,
      langue: fondsDocumentaire.langue,
      edition: fondsDocumentaire.edition,
      datation: fondsDocumentaire.datation,
      contenu: fondsDocumentaire.contenu,
      etat: fondsDocumentaire.etat,
      ancien_proprietaire: fondsDocumentaire.ancien_proprietaire,
      notes: fondsDocumentaire.notes,
      don: fondsDocumentaire.don,
      emplacement_initial_dans_la_bibliotheque: fondsDocumentaire.emplacement_initial_dans_la_bibliotheque
    },
    urls: []
  };
}

// Function to map a list of searchFondsDocumentaire
export function mapSearchFondsDocumentaireListToApi(fondsDocumentaire: FondsDocumentaireSearchDBModel[]): SearchFondsDocumentaireApiModel[] {
  return fondsDocumentaire.map(mapSearchFondsDocumentaireToApi);
}
