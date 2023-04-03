CREATE TABLE imprimes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  epi TEXT,
  travee TEXT,
  tablette TEXT,
  cote VARCHAR(20),
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
  cote VARCHAR(20),
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
  cote VARCHAR(20),
  tome TEXT,
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
  cote VARCHAR(20),
  tome TEXT
);






CREATE FULLTEXT INDEX keywords_idx ON imprimes(cote,lieu,format,auteur,titre,annee,etat,commentaire);
CREATE FULLTEXT INDEX titre_idx ON imprimes(titre);
CREATE FULLTEXT INDEX auteur_idx ON imprimes(auteur);
CREATE INDEX cote_idx ON imprimes(cote);

CREATE FULLTEXT INDEX keywords_idx ON factums(cote,type,auteur,titre,couverture,langue,edition,datation,contenu,etat,notes,emplacement);
CREATE FULLTEXT INDEX titre_idx ON factums(titre);
CREATE FULLTEXT INDEX auteur_idx ON factums(auteur);

CREATE FULLTEXT INDEX keywords_idx ON fonds_documentaire(n_carton,fonds,type_de_document,auteur,auteur_bis,titre,couverture,langue,edition,datation,contenu,etat,ancien_propietaire,notes,don,emplacement_initial_dans_la_bibliotheque);
CREATE FULLTEXT INDEX titre_idx ON fonds_documentaire(titre);
CREATE FULLTEXT INDEX auteur_idx ON fonds_documentaire(auteur);

CREATE FULLTEXT INDEX keywords_idx ON fonds_johannique(auteur,titre,annee,cote,etat,metrage_ou_commentaire,carton);
CREATE FULLTEXT INDEX titre_idx ON fonds_johannique(titre);
CREATE FULLTEXT INDEX auteur_idx ON fonds_johannique(auteur);

CREATE FULLTEXT INDEX commentaire_idx ON index_pays_lorrain(commentaires);

CREATE FULLTEXT INDEX commentaire_idx ON manuscrits(commentaires);

CREATE INDEX cote_idx ON index_fiches_total(cote);





