DEVENIR UN HABITUEL — PROTOTYPE v1.0
Prologue + Émission 1 : L’Euro

CONTENU
- index.html
- style.css
- app.js
- assets/audio/gerard/ : 24 inserts authentiques de Gérard
- assets/audio/team/ : 3 inserts authentiques de l’équipe, en réserve

INSTALLATION GITHUB
Déposer le contenu de ce ZIP directement à la racine du dépôt GitHub Pages.
Ne pas mettre le dossier lui-même dans un sous-dossier.

IMPORTANT
- Aucun visuel généré par IA.
- Aucune voix synthétique / aucun clonage vocal.
- Les MP3 de Gérard proviennent du fichier inserts.zip fourni par l’utilisateur.
- Les choix sont déterministes : aucun Math.random() n’est utilisé pour la logique du jeu.
- La progression est enregistrée dans localStorage.
- Le prototype fonctionne sans serveur ni backend.
- Le débat complet de l’Euro n’est PAS embarqué dans cette version : le jeu le signale explicitement et utilise un insert authentique isolé à la place du passage long E1-A. On pourra remplacer cette scène dès que le master audio autorisé sera disponible.

TEST LOCAL
Ouvrir index.html dans un navigateur moderne.
Pour reproduire le comportement GitHub Pages au plus près, servir le dossier en HTTP :
python -m http.server 8000
puis ouvrir http://localhost:8000

COMMANDES
A/B/C/D au clavier sélectionnent les choix correspondants.
Bouton SON pour couper/réactiver l’audio.
Bouton ↺ pour recommencer.
