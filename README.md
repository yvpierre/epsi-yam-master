# EPSI - YAMS MASTER
### Équipe 
- Pierre Yvenou
- Alexis Bertin
### Debrief de l'avancement au 12/05/2024, 23h50 : 
- Le jeu fonctionne dans l'ensemble jusqu'au mode versus bot où il est possible de lancer une partie, de jouer, mais le bot ne répond malheuresement pas car la logique n'a pas pu être implémentée.
- Le frontend comprend des fonctionnalités qui n'ont pas pu être développés mais qui sont tout de même présentes dans les menus histoire de donner une idée de ce à quoi pourrait ressembler le jeu avec plus de développements
- Ci-dessous on peut retrouver une liste des différentes pages avec des explications sur les différents modes par exemple.
- Le jeu devrait idéalement être lancé sur mobile, l'UI est design pour.

Menu principal:
- Jouer
- Replays
- Paramètres

Modes de jeu:
- Solo (vs bot)
- Multi en ligne
- Multi local

IA pour le bot: plus ou moins précis et des plus ou moins bonnes décisions

Menu en jeu:
- Paramètres
- Musique (on/off)
- Abandonner

Pour chaque mode de difficulté (bot plus dur et moins de temps):
- Tranquille (2min/tour)
- Normal (1min/tour)
- Express (30sec/tour)
- Impossible (15s/tour)

UI :
- Typo et DA casino

Implémenter :
- Docker pour lancer les différents serveurs
- MMR (classement)
- Animations
- Nombre de joueurs en ligne
- Bouton aide
- Shi/Fu/Mi pour savoir qui commence la partie
- Swagger pour le serveur web socket
- setTimeout pour que le bot prenne un peu de temps à jouer
- Pourcentage de chances d'avoir la combinaison de dés

