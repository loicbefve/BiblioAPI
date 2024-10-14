import { ImprimesSearchDBModel } from '../db/imprimes';

export interface SearchImprimesApiModel {
  metadatas: {
    epi: string,
    travee: string,
    tablette: string,
    cote: string,
    ordre: string,
    lieu: string,
    format: string,
    auteur: string,
    titre: string,
    annee: string,
    tome: string,
    etat: string,
    commentaire: string,
  },
  urls: string[]
}

// Function to map DB model to API model
export function mapSearchImprimeToApi(imprime: ImprimesSearchDBModel): SearchImprimesApiModel {
  return {
    metadatas: {
      epi: imprime.epi,
      travee: imprime.travee,
      tablette: imprime.tablette,
      cote: imprime.cote,
      ordre: imprime.ordre,
      lieu: imprime.lieu,
      format: imprime.format,
      auteur: imprime.auteur,
      titre: imprime.titre,
      annee: imprime.annee,
      tome: imprime.tome,
      etat: imprime.etat,
      commentaire: imprime.commentaire,
    },
    urls: imprime.urls ? imprime.urls.split(',') : []
  };
}

// Function to map a list of searchImprimes
export function mapSearchImprimeListToApi(imprimes: ImprimesSearchDBModel[]): SearchImprimesApiModel[] {
  return imprimes.map(mapSearchImprimeToApi);
}
