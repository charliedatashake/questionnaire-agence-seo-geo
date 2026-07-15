# Formulaire fiche agence In Extenso

Formulaire charté In Extenso pour collecter la matière différenciante des agences (SEO local / GEO). Front statique (GitHub Pages), backend Google Apps Script qui écrit dans le Google Sheet "In Extenso - Fiche de différenciation par agence (SEO-GEO)".

## Architecture

- `index.html` : formulaire une question par écran, brouillon localStorage, liste des agences chargée depuis le Sheet via Apps Script
- `apps-script.gs` : backend à coller dans Apps Script (lié au Sheet), 2 endpoints (liste des agences, enregistrement des réponses)
- Le Sheet reste la source unique : onglet `Informations agences` = pilotage (Statut passe à "Rempli" automatiquement), onglet `Réponses` = données brutes, onglet `Pilotage` = compteurs

## Déploiement Apps Script (5 min, à faire une fois par Charlie)

1. Ouvrir le Sheet → Extensions → Apps Script
2. Coller le contenu de `apps-script.gs`, enregistrer
3. Déployer → Nouveau déploiement → type "Application web"
   - Exécuter en tant que : Moi
   - Accès : Tout le monde
4. Copier l'URL de déploiement (`https://script.google.com/macros/s/.../exec`)
5. Dans `index.html`, remplacer `APPS_SCRIPT_URL` par cette URL, commit + push

## Liens pré-remplis par agence

Format : `https://charliedatashake.github.io/fiche-agence-inextenso/?a=<slug>`

Le slug = dernier segment de l'URL de la page agence sur inextenso.fr.
Exemple : `https://www.inextenso.fr/agence/expert-comptable-bordeaux/` → `?a=expert-comptable-bordeaux`

## Pilotage

- Statut "Rempli" posé automatiquement dans `Informations agences` (col F) à chaque soumission
- Onglet `Pilotage` : réponses reçues / agences ciblées, détail par priorité
- Une agence peut soumettre plusieurs fois : chaque envoi = une ligne dans `Réponses`, la plus récente fait foi

## Modifier les questions

Les questions vivent dans `index.html` (tableau `QUESTIONS`). Si on ajoute/supprime une question, mettre à jour aussi `COLS` dans `apps-script.gs` et les en-têtes de l'onglet `Réponses` (même ordre).
