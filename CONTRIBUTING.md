# Contribuer à Kuma

## Langues
- **Code** : tout en anglais (variables, fonctions, fichiers, clés de traduction).
- **Commentaires et commits** : en français et en anglais quand c'est possible et adapté, sinon en français.
  Exemple de commit : `Ajout de l'écran de connexion / Add login screen`
- **Textes affichés** : jamais écrits en dur dans le code.
  - Écran : `frontend/src/locales/fr.json` et `en.json`, avec exactement les mêmes clés.
  - Backend : messages visibles par l'utilisateur via `nestjs-i18n`.
- **Orthographe** : vérifiée par la CI. Un terme technique inconnu s'ajoute dans `cspell.json`, une vraie faute se corrige.

## Branches et fusion
- On ne pousse pas directement sur `main` : une branche par sujet (`feat/...`, `fix/...`), puis une pull request.
- La CI doit être verte avant toute fusion.

## Multi-entreprise
- Toute donnée métier porte un `tenant_id` dès sa création.
- Aucune requête ne doit pouvoir lire ou modifier les données d'une autre entreprise.

## Secrets
- Aucun mot de passe, jeton ou clé dans Git.
- Les variables attendues sont listées dans `deploy/.env.example`, sans valeurs réelles.

## Nommage
- Conteneurs : `kuma-<env>-<service>` (ex. `kuma-dev-postgres`).
- Réseau : `kuma-<env>-net`.
- Fichiers compose : `deploy/compose.<env>.yml`.
- Images : `ghcr.io/kanimbahub/kuma-frontend`, `kuma-backend`, `kuma-worker`.

## Environnement de dev
- Serveurs : chemins standard (`/opt/kuma`, `/etc/kuma`, `/var/lib/kuma`, `/var/log/kuma`).
- Démarrer PostgreSQL et Redis :
  `docker compose -f deploy/compose.dev.yml up -d`
