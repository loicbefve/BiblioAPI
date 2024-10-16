import { ManuscritsSearchDBModel } from '../db/manuscrits';

export interface SearchManuscritsApiModel {
  metadatas: {
    commentaires: string;
  }
}

// Function to map DB model to API model
export function mapSearchManuscritsToApi(manuscrit: ManuscritsSearchDBModel): SearchManuscritsApiModel {
  return {
    metadatas: {
      commentaires: manuscrit.commentaires,
    }
  };
}

// Function to map a list of searchManuscrits
export function mapSearchManuscritsListToApi(manuscrits: ManuscritsSearchDBModel[]): SearchManuscritsApiModel[] {
  return manuscrits.map(mapSearchManuscritsToApi);
}
