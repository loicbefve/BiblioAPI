import * as imprimesDb from './imprimes';
import * as factumsDb from './factums';
import * as fondsJohanniqueDb from './fonds_johannique';
import * as fondsDocumentaireDb from './fonds_documentaire';
import * as manuscritsDb from './manuscrits';
import * as indexPaysLorrainDb from './index_pays_lorrain';

export const db = {
  ...imprimesDb,
  ...factumsDb,
  ...fondsJohanniqueDb,
  ...fondsDocumentaireDb,
  ...manuscritsDb,
  ...indexPaysLorrainDb
}



