# Présentation des PWA

## PWA, Kesako ?

Une Progressive Web App (PWA) est une application web qui utilise les dernières technologies pour combiner les meilleures caractéristiques des sites web et des applications mobiles. L'objectif principal des PWA est d'offrir une expérience utilisateur fluide et performante, quelle que soit la plateforme ou le périphérique utilisé.

Documentation : [PWA](https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps)

### Avantages

- Installation simplifiée : les utilisateurs peuvent installer une PWA directement depuis le navigateur sans passer par un store.
- Accessibilité : les PWA fonctionnent sur de nombreuses plates-formes et appareils.
- Fonctionnement hors ligne : les PWA peuvent fonctionner même en l'absence de connexion Internet grâce à la mise en cache des ressources.
- Mises à jour automatiques : les PWA se mettent à jour automatiquement, assurant aux utilisateurs l'accès aux dernières fonctionnalités et améliorations.
- Sécurité : les PWA sont servies via HTTPS et garantissent un niveau élevé de sécurité.
- Réduction des coûts de développement : les PWA permettent de développer une seule application compatible avec plusieurs plates-formes, réduisant ainsi les coûts de développement.

### Inconvénients

- Limitations d'accès aux fonctionnalités natives : Bien que les PWA offrent de nombreuses fonctionnalités natives, certaines fonctionnalités avancées peuvent être limitées par rapport aux applications natives.
- Dépendance du navigateur : Les PWA dépendent des fonctionnalités du navigateur, et certaines fonctionnalités avancées peuvent ne pas être prises en charge uniformément sur tous les navigateurs.
- Taille limite de stockage local : Les PWA ont une limite de stockage local plus petite par rapport aux applications natives, ce qui peut être un inconvénient pour les applications nécessitant beaucoup d'espace de stockage.
- Performance sur les anciens navigateurs : Bien que conçues pour être progressives, les PWA peuvent ne pas offrir la même expérience optimale sur les navigateurs plus anciens.

## Manifest

Le fichier manifest.json est central dans la création d'une PWA. Il fournit les informations requises au navigateur sur l'application et permet ainsi l'installation de cette dernière sur l'appareil de l'utilisateur.
Il fournit entre autre le nom de l'application, les couleurs de l'interface, les icones à utiliser et ainsi de suite.

Documentation : [Manifest](https://developer.mozilla.org/fr/docs/Mozilla/Add-ons/WebExtensions/manifest.json)

- le fichier est nommé "manifest.json"
- il est placé à la racine du projet
- les données sont au format json
- les pages HTML l'utilisant doivent le charger gràce à l'utilisation d'une balise :

```html
<link rel="manifest" src="manifest.json" />
```

On peut vérifier son bon fonctionnement depuis la console Chrome : "application/manifest".

![Chrome console, manifest](/images/manifest_chrome_console.png)

## Service worker

### Kesako ?

Un service worker est un script indépendant de la page web qui y fait appel et est exécuté de manière asychrone en arrière plan.

Il permet entre autre :

- de gérer et mettre en cache les données et fichiers utilisés par l'application
- d'intercépter les requêtes reseau et d'y répondre si besoin
- de répondre à des evenements tels que l'installation ou l'activation de l'application
- de faciliter la mise en oeuvre des notifications push

D'une manière globale, il améliore l'experience utilisateur (sécurité, fluidité, hors ligne, ...) et la rapproche de celle d'une application native.

Documentation : [Service worker](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API)

### Mise en place

- création du fichier "sw.js" à la racine du projet (il contiendra le service worker)
- création du fichier "app.js" dans le dossier scripts (le service worker doit être appelé pour démarrer)
- ajout de la balise script depuis la page HTML

```html
<script src="scripts/app.js"></script>
```

Certaines plateformes ou navigateurs ne sont pas compatibles avec l'utilisation de service worker, il convient donc de vérifier si l'installation de ce dernier est possible :

app.js

```js
// on vérifie si le service est supporté ... //
if ("serviceWorker" in navigator) {
	console.log("Les services workers sont supportés ici !");

	// ... puis on l'enregistre dans l'application //
	try {
		const registration = await navigator.serviceWorker.register("/sw.js");
		console.log("Le service worker est enregistré !", registration);
	} catch (error) {
		console.log("Une erreur à eut lieu !", error.message);
	}
}
```

On peut vérifier son bon fonctionnement depuis la console Chrome : "application/service workers".

![Chrome console, service workers](/images/service_worker_chrome_console.png)
