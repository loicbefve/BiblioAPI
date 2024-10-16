import { IndexPaysLorrainSearchDBModel } from '../db/index_pays_lorrain';

export interface SearchIndexPaysLorrainApiModel {
  metadatas: {
    commentaires: string;
  }
}

// Function to map DB model to API model
export function mapSearchIndexPaysLorrainToApi(manuscrit: IndexPaysLorrainSearchDBModel): SearchIndexPaysLorrainApiModel {
  return {
    metadatas: {
      commentaires: manuscrit.commentaires,
    }
  };
}

// Function to map a list of searchIndexPaysLorrain
export function mapSearchIndexPaysLorrainListToApi(indexPaysLorrain: IndexPaysLorrainSearchDBModel[]): SearchIndexPaysLorrainApiModel[] {
  return indexPaysLorrain.map(mapSearchIndexPaysLorrainToApi);
}
