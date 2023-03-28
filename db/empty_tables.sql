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
  id_texte TEXT,
  commentaires TEXT
);

CREATE TABLE manuscrits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_texte TEXT,
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








ALTER TABLE imprimes ADD FULLTEXT (cote,lieu,format,auteur,titre,annee,etat,commentaire);
ALTER TABLE imprimes ADD FULLTEXT (titre);
ALTER TABLE imprimes ADD FULLTEXT (auteur);

ALTER TABLE factums ADD FULLTEXT (cote,type,auteur,titre,couverture,langue,edition,datation,contenu,etat,notes,emplacement);
ALTER TABLE factums ADD FULLTEXT (auteur);
ALTER TABLE factums ADD FULLTEXT (titre);

ALTER TABLE fonds_documentaire ADD FULLTEXT (n_carton,fonds,type_de_document,auteur,auteur_bis,titre,couverture,langue,edition,datation,contenu,etat,ancien_propietaire,notes,don,emplacement_initial_dans_la_bibliotheque);
ALTER TABLE fonds_documentaire ADD FULLTEXT (auteur, auteur_bis);
ALTER TABLE fonds_documentaire ADD FULLTEXT (titre);

ALTER TABLE fonds_johannique ADD FULLTEXT (auteur,titre,annee,cote,etat,metrage_ou_commentaire,carton);
ALTER TABLE fonds_johannique ADD FULLTEXT (auteur);
ALTER TABLE fonds_johannique ADD FULLTEXT (titre);

ALTER TABLE index_pays_lorrain ADD FULLTEXT (commentaires);

ALTER TABLE manuscrits ADD FULLTEXT (commentaires);





