import * as imprimesDb from './imprimes';
import * as factumsDb from './factums';
import * as fondsJohanniqueDb from './fonds_johannique';
import * as fondsDocumentaireDb from './fonds_documentaire';
import * as fondsManuscritsDb from './manuscrits';

export const db = {
  ...imprimesDb,
  ...factumsDb,
  ...fondsJohanniqueDb,
  ...fondsDocumentaireDb,
  ...fondsManuscritsDb
}



