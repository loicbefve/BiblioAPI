# Description :

API du site de la bibliothèque.

## Technologies :
- Express.js (Serveur http)

## Lancer l'environnement de développement :

### Prérequis :
*Les versions indiquées sont indicatives, ils s'agit des versions avec lesquelles 
l'application a été développé. L'application peut fonctionner avec des versions supérieures
cependant cela n'est pas garanti.*
- Node.js (v18.17.0)
- Yarn (v1.22.19)
- Docker et Docker Compose (Pour le local uniquement)

### Installation :
1. Commencer par installer les dépendances du projet :
    ```bash
    yarn install
    ```
2. Démarrer la base de données :
    ```bash
    docker-compose up -d
    ```
3. Si c'est la première fois que vous lancez l'application, il faut créer la base de données :
    ```bash
    yarn db:create
    ```

### Lancer l'application :

Pour lancer l'application en mode développement, il suffit de lancer la commande suivante :
   ```bash
   yarn run dev
   ```

## Peupler la base de données :
*Cette section explique comment insérer les lignes issues du recollement dans la base de données.*

:warning: **Attention :** Cette opération est irréversible. Il est recommandé de sauvegarder la base de données avant de lancer cette commande.

Le script va lire les fichiers `csv` situés dans le répertoire `csv_database` du projet.
Le nom des fichiers est très important, car il permet de déterminer la table dans laquelle insérer les données ainsi que
 la date de mise à jour qui sera envoyé par l'API. 

Le nom des fichiers doit respecter le format suivant : `{date}_{nom_de_la_table}.csv`.
**Exemple** : `2021-01-01_imprimes.csv`
- `date` : La date de mise à jour des données au format `YYYY-MM-DD`.
- `nom_de_la_table` : Le nom de la table dans laquelle insérer les données parmi :
  - `imprimes`
  - `factums`
  - `fonds_documentaire`
  - `fonds_johannique`
  - `index_pays_lorrain`
  - `manuscrits`
  - `index_fiches_total`

Le contenu de chaque fichier doit également respecter le nom des colonnes de cette table dans la base de données.  
:caution: **Attention :** Pensez à vérifier que le schéma de la base de données est à jour avec cette documentation.

| Nom de la table    | Colonnes                                                                                                                                                                                         |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| imprimes           | id, epi, travee, tablette, cote, ordre, lieu, format, auteur, titre, annee, tome, etat, commentaire                                                                                              |
| factums            | id, cote, tome ,type, auteur, titre, couverture, langue, edition, datation, contenu, etat, notes, emplacement                                                                                    |
| fonds_documentaire | id, n_carton, fonds, type_de_document, auteur, auteur_bis, titre, couverture, langue, edition, datation, contenu, etat, ancien_propietaire, notes, don, emplacement_initial_dans_la_bibliotheque |
| fonds_johannique   | id, epi, travee, tablette, auteur, titre, annee, cote, tome, etat, metrage_ou_commentaire, carton                                                                                                |
| index_pays_lorrain | id, commentaires                                                                                                                                                                                 |
| manuscrits         | id, commentaires                                                                                                                                                                                 |
| index_fiches_total | id, numero, url, initiale, classe, cote, tome                                                                                                                                                    |


Une fois ces conditions réunies, il suffit d'exécuter la commande suivante :
```bash
yarn db:populate
```

## Index de recherche sur les tables
*Cette partie explique comment a été configuré la recherche sur les documents*

Nous utilisons la `FULLTEXT search` de Postgresql pour effectuer les recherches sur les tables.

Nous définissons un vecteur (`tsvector`) sur les colonnes que nous voulons indexer.
La plupart des tables qui proposent une recherche par titre, auteur et mot clés disposent
donc de trois vecteurs.

Le tableau ci-dessous présente le poids donné à chaque colonne lors de la recherche par mots clés :

| Table              | Colonne                                  | Poids |
|--------------------|------------------------------------------|-------|
| imprimes           | titre                                    | A     |
| imprimes           | auteur                                   | A     |
| imprimes           | lieu                                     | B     |
| imprimes           | annee                                    | B     |
| imprimes           | commentaire                              | C     |
| imprimes           | cote                                     | D     |
| imprimes           | format                                   | D     |
| imprimes           | etat                                     | D     |
| factums            | titre                                    | A     |
| factums            | auteur                                   | A     |
| factums            | contenu                                  | B     |
| factums            | datation                                 | B     |
| factums            | notes                                    | C     |
| factums            | langue                                   | C     |
| factums            | type                                     | C     |
| factums            | cote                                     | D     |
| factums            | format                                   | D     |
| factums            | couverture                               | D     |
| factums            | edition                                  | D     |
| factums            | emplacement                              | D     |
| factums            | etat                                     | D     |
| fonds_documentaire | titre                                    | A     |
| fonds_documentaire | auteur                                   | A     |
| fonds_documentaire | auteur_bis                               | A     |
| fonds_documentaire | contenu                                  | B     |
| fonds_documentaire | datation                                 | B     |
| fonds_documentaire | notes                                    | C     |
| fonds_documentaire | langue                                   | C     |
| fonds_documentaire | type_de_document                         | C     |
| fonds_documentaire | fonds                                    | C     |
| fonds_documentaire | couverture                               | D     |
| fonds_documentaire | emplacement                              | D     |
| fonds_documentaire | n_carton                                 | D     |
| fonds_documentaire | edition                                  | D     |
| fonds_documentaire | ancien_proprietaire                      | D     |
| fonds_documentaire | don                                      | D     |
| fonds_documentaire | emplacement_initial_dans_la_bibliotheque | D     |
| fonds_documentaire | etat                                     | D     |
| fonds_johannique   | titre                                    | A     |
| fonds_johannique   | auteur                                   | A     |
| fonds_johannique   | annee                                    | B     |
| fonds_johannique   | cote                                     | C     |
| fonds_johannique   | metrage_ou_commentaire                   | C     |
| fonds_johannique   | carton                                   | D     |
| fonds_johannique   | etat                                     | D     |
