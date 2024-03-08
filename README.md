# Présentation des PWA

## PWA, kesako ?

Une Progressive Web App (PWA) est une application web qui utilise les dernières technologies pour combiner les meilleures caractéristiques des sites web et des applications mobiles. L'objectif principal des PWA est d'offrir une expérience utilisateur fluide et performante, quelle que soit la plateforme ou le périphérique utilisé.

### Avantages :

- Installation simplifiée : les utilisateurs peuvent installer une PWA directement depuis le navigateur sans passer par un store.
- Accessibilité : les PWA fonctionnent sur de nombreuses plates-formes et appareils.
- Fonctionnement hors ligne : les PWA peuvent fonctionner même en l'absence de connexion Internet grâce à la mise en cache des ressources.
- Mises à jour automatiques : les PWA se mettent à jour automatiquement, assurant aux utilisateurs l'accès aux dernières fonctionnalités et améliorations.
- Sécurité : les PWA sont servies via HTTPS et garantissent un niveau élevé de sécurité.
- Réduction des coûts de développement : les PWA permettent de développer une seule application compatible avec plusieurs plates-formes, réduisant ainsi les coûts de développement.

### Inconvénients :

- Limitations d'accès aux fonctionnalités natives : Bien que les PWA offrent de nombreuses fonctionnalités natives, certaines fonctionnalités avancées peuvent être limitées par rapport aux applications natives.
- Dépendance du navigateur : Les PWA dépendent des fonctionnalités du navigateur, et certaines fonctionnalités avancées peuvent ne pas être prises en charge uniformément sur tous les navigateurs.
- Taille limite de stockage local : Les PWA ont une limite de stockage local plus petite par rapport aux applications natives, ce qui peut être un inconvénient pour les applications nécessitant beaucoup d'espace de stockage.
- Performance sur les anciens navigateurs : Bien que conçues pour être progressives, les PWA peuvent ne pas offrir la même expérience optimale sur les navigateurs plus anciens.

## Manifest

Le fichier manifest.json est central dans la création d'une PWA. Il fournit les informations requises au navigateur sur l'application et permet ainsi l'installation de cette dernière sur l'appareil de l'utilisateur.
Il fournit entre autre le nom de l'application, les couleurs de l'interface, les icones à utiliser et ainsi de suite.

- le fichier est nommé "manifest.json"
- il est placé à la racine du projet
- les données sont au format json
- les pages HTML l'utilisant doivent le charger gràce à l'utilisation d'une balise :

```html
<link rel="manifest" src="manifest.json" />
```

On peut vérifier son bon fonctionnement depuis la console Chrome : "application/manifest".
![Chrome console, manifest](/images/manifest_chrome_console.png)
