import * as imprimesDb from './imprimes';
import * as factumsDb from './factums';
import * as fondsJohanniqueDb from './fonds_johannique';

export const db = {
  ...imprimesDb,
  ...factumsDb,
  ...fondsJohanniqueDb
}



