DROP TABLE IF EXISTS imprimes;
CREATE TABLE imprimes (
  id uuid PRIMARY KEY,
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
  commentaire TEXT,
  tsvector_titre TSVECTOR,
  tsvector_auteur TSVECTOR,
  tsvector_combined TSVECTOR
);

DROP FUNCTION IF EXISTS update_tsvector_imprimes() CASCADE;
CREATE FUNCTION update_tsvector_imprimes() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsvector_titre := setweight(to_tsvector('french', NEW.titre), 'A');
    NEW.tsvector_auteur := setweight(to_tsvector('french', NEW.auteur), 'A');
    NEW.tsvector_combined :=
            setweight(to_tsvector('french', NEW.titre), 'A') ||
            setweight(to_tsvector('french', NEW.auteur), 'A') ||
            setweight(to_tsvector('french', NEW.lieu), 'B') ||
            setweight(to_tsvector('french', NEW.annee), 'B') ||
            setweight(to_tsvector('french', NEW.commentaire), 'C') ||
            setweight(to_tsvector('french', NEW.cote), 'D') ||
            setweight(to_tsvector('french', NEW.format), 'D') ||
            setweight(to_tsvector('french', NEW.etat), 'D');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdateimprimee BEFORE INSERT OR UPDATE
    ON imprimes FOR EACH ROW EXECUTE FUNCTION update_tsvector_imprimes();



DROP TABLE IF EXISTS factums;
CREATE TABLE factums (
  id uuid PRIMARY KEY,
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
  emplacement TEXT,
  tsvector_titre TSVECTOR,
  tsvector_auteur TSVECTOR,
  tsvector_combined TSVECTOR
);

DROP FUNCTION IF EXISTS update_tsvector_factums() CASCADE;
CREATE FUNCTION update_tsvector_factums() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsvector_titre := setweight(to_tsvector('french', NEW.titre), 'A');
    NEW.tsvector_auteur := setweight(to_tsvector('french', NEW.auteur), 'A');
    NEW.tsvector_combined :=
            setweight(to_tsvector('french', NEW.titre), 'A') ||
            setweight(to_tsvector('french', NEW.auteur), 'A') ||
            setweight(to_tsvector('french', NEW.contenu), 'B') ||
            setweight(to_tsvector('french', NEW.datation), 'B') ||
            setweight(to_tsvector('french', NEW.notes), 'C') ||
            setweight(to_tsvector('french', NEW.langue), 'C') ||
            setweight(to_tsvector('french', NEW.type), 'C') ||
            setweight(to_tsvector('french', NEW.cote), 'D') ||
            setweight(to_tsvector('french', NEW.format), 'D') ||
            setweight(to_tsvector('french', NEW.couverture), 'D') ||
            setweight(to_tsvector('french', NEW.edition), 'D') ||
            setweight(to_tsvector('french', NEW.emplacement), 'D') ||
            setweight(to_tsvector('french', NEW.etat), 'D');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdatefactums BEFORE INSERT OR UPDATE
    ON factums FOR EACH ROW EXECUTE FUNCTION update_tsvector_factums();


DROP TABLE IF EXISTS fonds_documentaire;
CREATE TABLE fonds_documentaire (
  id uuid PRIMARY KEY,
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
  emplacement_initial_dans_la_bibliotheque TEXT,
  tsvector_titre TSVECTOR,
  tsvector_auteur TSVECTOR,
  tsvector_combined TSVECTOR
);

DROP FUNCTION IF EXISTS update_tsvector_fonds_documentaire() CASCADE;
CREATE FUNCTION update_tsvector_fonds_documentaire() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsvector_titre := setweight(to_tsvector('french', NEW.titre), 'A');
    NEW.tsvector_auteur := setweight(to_tsvector('french', NEW.auteur), 'A');
    NEW.tsvector_combined :=
            setweight(to_tsvector('french', NEW.titre), 'A') ||
            setweight(to_tsvector('french', NEW.auteur), 'A') ||
            setweight(to_tsvector('french', NEW.auteur_bis), 'A') ||
            setweight(to_tsvector('french', NEW.contenu), 'B') ||
            setweight(to_tsvector('french', NEW.datation), 'B') ||
            setweight(to_tsvector('french', NEW.notes), 'C') ||
            setweight(to_tsvector('french', NEW.langue), 'C') ||
            setweight(to_tsvector('french', NEW.type_de_document), 'C') ||
            setweight(to_tsvector('french', NEW.fonds), 'C') ||
            setweight(to_tsvector('french', NEW.couverture), 'D') ||
            setweight(to_tsvector('french', NEW.emplacement), 'D') ||
            setweight(to_tsvector('french', NEW.n_carton), 'D') ||
            setweight(to_tsvector('french', NEW.edition), 'D') ||
            setweight(to_tsvector('french', NEW.ancien_propietaire), 'D') ||
            setweight(to_tsvector('french', NEW.don), 'D') ||
            setweight(to_tsvector('french', NEW.emplacement_initial_dans_la_bibliotheque), 'D') ||
            setweight(to_tsvector('french', NEW.etat), 'D');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdatefondsdocumentaires BEFORE INSERT OR UPDATE
    ON fonds_documentaire FOR EACH ROW EXECUTE FUNCTION update_tsvector_fonds_documentaire();



DROP TABLE IF EXISTS fonds_johannique;
CREATE TABLE fonds_johannique (
  id uuid PRIMARY KEY,
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
  carton TEXT,
  tsvector_auteur TSVECTOR,
  tsvector_titre TSVECTOR,
  tsvector_combined TSVECTOR
);

DROP FUNCTION IF EXISTS update_tsvector_fonds_johannique() CASCADE;
CREATE FUNCTION update_tsvector_fonds_johannique() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsvector_titre := setweight(to_tsvector('french', NEW.titre), 'A');
    NEW.tsvector_auteur := setweight(to_tsvector('french', NEW.auteur), 'A');
    NEW.tsvector_combined :=
            setweight(to_tsvector('french', NEW.titre), 'A') ||
            setweight(to_tsvector('french', NEW.auteur), 'A') ||
            setweight(to_tsvector('french', NEW.annee), 'B') ||
            setweight(to_tsvector('french', NEW.cote), 'C') ||
            setweight(to_tsvector('french', NEW.metrage_ou_commentaire), 'C') ||
            setweight(to_tsvector('french', NEW.carton), 'D') ||
            setweight(to_tsvector('french', NEW.etat), 'D');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdatefondsjohannique BEFORE INSERT OR UPDATE
    ON fonds_johannique FOR EACH ROW EXECUTE FUNCTION update_tsvector_fonds_johannique();


DROP TABLE IF EXISTS index_pays_lorrain;
CREATE TABLE index_pays_lorrain (
  id uuid PRIMARY KEY,
  commentaires TEXT,
  tsvector_commentaires TSVECTOR
);

DROP FUNCTION IF EXISTS update_tsvector_index_pays_lorrain() CASCADE;
CREATE FUNCTION update_tsvector_index_pays_lorrain() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsvector_commentaires := setweight(to_tsvector('french', NEW.commentaires), 'A');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdateindexpayslorrain BEFORE INSERT OR UPDATE
    ON index_pays_lorrain FOR EACH ROW EXECUTE FUNCTION update_tsvector_index_pays_lorrain();



DROP TABLE IF EXISTS manuscrits;
CREATE TABLE manuscrits (
  id uuid PRIMARY KEY,
  commentaires TEXT,
  tsvector_commentaires TSVECTOR
);

DROP FUNCTION IF EXISTS update_tsvector_manuscrits() CASCADE;
CREATE FUNCTION update_tsvector_manuscrits() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsvector_commentaires := setweight(to_tsvector('french', NEW.commentaires), 'A');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdatemanuscrits BEFORE INSERT OR UPDATE
    ON manuscrits FOR EACH ROW EXECUTE FUNCTION update_tsvector_manuscrits();


DROP TABLE IF EXISTS index_fiches_total;
CREATE TABLE index_fiches_total (
  id uuid PRIMARY KEY,
  numero TEXT,
  url TEXT,
  initiale TEXT,
  classe TEXT,
  cote VARCHAR(20),
  tome TEXT
);

CREATE INDEX imprimes_cote_idx ON imprimes(cote);
CREATE INDEX index_fiches_total_cote_idx ON index_fiches_total(cote);


