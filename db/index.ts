import * as imprimesDb from './imprimes';
import * as factumsDb from './factums';

export const db = {
  ...imprimesDb,
  ...factumsDb
}



