import { FondsJohanniqueSearchDBModel } from '../db/fonds_johannique';

export interface SearchFondsJohanniqueApiModel {
  metadatas: {
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
  },
  urls: string[]
}

// Function to map DB model to API model
export function mapSearchFondsJohanniqueToApi(fondsJohannique: FondsJohanniqueSearchDBModel): SearchFondsJohanniqueApiModel {
  return {
    metadatas: {
      epi: fondsJohannique.epi,
      travee: fondsJohannique.travee,
      tablette: fondsJohannique.tablette,
      cote: fondsJohannique.cote,
      ordre: fondsJohannique.ordre,
      lieu: fondsJohannique.lieu,
      format: fondsJohannique.format,
      auteur: fondsJohannique.auteur,
      titre: fondsJohannique.titre,
      annee: fondsJohannique.annee,
      tome: fondsJohannique.tome,
      etat: fondsJohannique.etat,
      commentaire: fondsJohannique.commentaire,
    },
    urls: fondsJohannique.urls ? fondsJohannique.urls.split(',') : []
  };
}

// Function to map a list of searchFondsJohannique
export function mapSearchFondsJohanniqueListToApi(fondsJohannique: FondsJohanniqueSearchDBModel[]): SearchFondsJohanniqueApiModel[] {
  return fondsJohannique.map(mapSearchFondsJohanniqueToApi);
}
