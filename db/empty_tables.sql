CREATE TABLE imprimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  epi TEXT,
  travee TEXT,
  tablette TEXT,
  cote TEXT,
  ordre TEXT,
  lieu TEXT,
  format TEXT,
  auteur TEXT,
  titre TEXT,
  annee TEXT,
  tome TEXT,
  etat TEXT,
  commentaire TEXT
);

CREATE TABLE factums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cote TEXT,
  tome TEXT,
  type TEXT,
  auteur TEXT,
  titre TEXT,
  couverture TEXT,
  langue TEXT,
  edition TEXT,
  datation TEXT,
  contenu TEXT,
  etat TEXT,
  notes TEXT,
  emplacement TEXT
);

CREATE TABLE fonds_documentaire (
  id INT AUTO_INCREMENT PRIMARY KEY,
  n_carton TEXT,
  fonds TEXT,
  type_de_document TEXT,
  auteur TEXT,
  auteur_bis TEXT,
  titre TEXT,
  couverture TEXT,
  langue TEXT,
  edition TEXT,
  datation TEXT,
  contenu TEXT,
  etat TEXT,
  ancien_propietaire TEXT,
  notes TEXT,
  don TEXT,
  emplacement_initial_dans_la_bibliotheque TEXT
);

CREATE TABLE fonds_johannique (
  id INT AUTO_INCREMENT PRIMARY KEY,
  epi TEXT,
  travee TEXT,
  tablette TEXT,
  auteur TEXT,
  titre TEXT,
  annee TEXT,
  cote TEXT,
  etat TEXT,
  metrage_ou_commentaire TEXT,
  carton TEXT
);

CREATE TABLE index_pays_lorrain (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commentaires TEXT
);

CREATE TABLE manuscrits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commentaires TEXT
);

CREATE TABLE index_fiches_total (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero TEXT,
  url TEXT,
  initiale TEXT,
  classe TEXT,
  cote TEXT,
  tome TEXT
);



