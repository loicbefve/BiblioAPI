# Description :

API du site de la bibliothèque.

## Technologies :
- Express.js (Serveur http)
- 
## Documentation :
- La recherche

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
   yarn start
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
