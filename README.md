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

index.html :

```html
<link rel="manifest" src="manifest.json" />
```

manifest.json :

```json
{
	"name": "PWA-Demo",
	"short_name": "PWA-Demo",
	"start_url": "index.html",
	"display": "standalone",
	"background_color": "#172554",
	"theme_color": "#172554",
	"orientation": "portrait-primary",
	"icons": [
		{
			"src": "images/pwa_72.png",
			"type": "image/png",
			"sizes": "72x72"
		},
		{
			"src": "images/pwa_128.png",
			"type": "image/png",
			"sizes": "128x128"
		},
		{
			"src": "images/pwa_192.png",
			"type": "image/png",
			"sizes": "192x192"
		}
	]
}
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
- création du fichier "app.js" dans le dossier scripts (le service worker doit être téléchargé sur le client)
- ajout de la balise script depuis la page HTML

```html
<script type="module" src="scripts/app.js"></script>
```

Certaines plateformes ou navigateurs ne sont pas compatibles avec l'utilisation de service worker, il convient donc de vérifier si l'installation de ce dernier est possible :

app.js :

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

### Cycle de vie

Lorsqu'il est mis en place, le service qorker suit les étapes suivantes :

- téléchargement
- installation
- activation

Le téléchargement ( ou mise à jour ) aura lieu si :

- à la première connection à une page / application controllée par un service worker
- si un évenement du service est déclenché et qu'il n'a pas été mis à jour depuis plus de 24h
- si le service worker à été modifié (taille en octet)

Si une autre version du service worker est déjà installée, la nouvelle version version sera téléchargée en arrière plan et restera en attente le temps qu'il reste des pages chargées utilisant le précédent. Après cela, la version actuelle est activée.
( depuis le dev tool, on peut forcer la mise à jour du service worker ).

On peut capter les évenements "install" et "activate" depuis le service worker :

sw.js :

```js
self.addEventListener("install", () => {
	console.log("Le service worker est installé !");
});

self.addEventListener("activate", () => {
	console.log("Le serice worker est activé !");
});
```

On peut également capter les requêtes émisent depuis la page ouverte :

```js
self.addEventListener("fetch", (event) => {
	console.log("Une requête est envoyée ! ", event);
});
```

### Mise en cache de nos fichiers

Pour pouvoir fonctionner hors ligne, notre application (par l'intermédiaire du service worker) va devoir dans une premier temps mettre en cache les données et fichiers utilisés puis dans un second les récupérer depuis ce cache.
Ainsi, même sans connection, images, css, script, ... seront déjà sur le poste du client et pourront être distribués rapidement.

Mise en place du cache :

```js
// donner un nom au cache pour éviter tout conflit avec une autre application //
const cacheName = "DemoSW-v1";
// la liste des fichiers à mettre en cache //
const assets = [
	"/",
	"/index.html",
	"/scripts/app.js",
	"/style/main.css",
	"/images",
];

// on met en cache les fichiers lors de l'installation du sw //
self.addEventListener("install", async (event) => {
	// l'objet caches permet d'accéder au cache - asynchrone ! //
	const preCache = async () => {
		const cache = await caches.open(cacheName);

		// cache.addAll() permet de mettre en cache un array de fichiers //
		// attention aux erreurs de frappe dans les url qui déclencheront une erreur pour toute la méthode //
		return cache.addAll(assets);
	};

	// event.waitUntil étend la durée de l'évenement en cours //
	// "install" ne prendra donc fin qu'une fois tous les fichiers mis en cache //
	event.waitUntil(preCache());
});
```

On peut vérifier l'état du cache depuis le dev tool :

![Etat du cache, chrome console](/images/dev_tool_cache_interface.png)

Récupération des fichiers en cache :

```js
// on récupère les fichiers en cache lorsque l'application les réclame //
self.addEventListener("fetch", async (event) => {
	// caches.match() renvoie une Promesse si la requête correspond à une ressource possédée dans le cache //
	// sinon la méthode renvoie "undefined"
	const fetchInterception = async () => {
		const cachedResponse = await caches.match(event.request);

		// si on posséde la ressource, on interrompe la requête pour envoyer notre réponse //
		if (cachedResponse) {
			console.log("Ce fichier vient du cache !", event.request);
			return cachedResponse;
		}
		// sinon la requête n'est pas interrompue //
		else {
			console.log("Celui ci ne vient pas du cache !", event.request);
			return fetch(event.request);
		}
	};

	// event.respondWith() permet d'intercépter les requêtes et d'émettre une réponse personnalisée si besoin //
	event.respondWith(fetchInterception());
});
```

### Versioning

Lors des mises à jours successives du service worker, il sera utile de supprimer les version précédentes du cache.

On modifie le nom du cache :

```js
const cacheName = "DemoSW-v2";
```

On supprime les versions du caches qui ne correspondent pas à ce nom :

```js
// lorsque le sw actuel est activé, les anciennes versions du cache ne seront plus uilisées //
self.addEventListener("activate", (event) => {
	// on supprime le cache possédant la cléf précisée //
	const deleteCache = async (key) => {
		await caches.delete(key);
	};

	// on récupère le liste des caches stoqués sur le navigateur //
	const deleteOldCaches = async () => {
		const keyList = await caches.keys();
		// on supprime toutes les versions sauf celle correspondant au nom de version actuel //
		const cachesToDelete = keyList.filter((key) => key !== cacheName);
		await Promise.all(cachesToDelete.map(deleteCache));
	};

	// on prolonge l'évenement "activate" jusqu'à ceque le cache soit nettoyé //
	event.waitUntil(deleteOldCaches());
});
```

## Service worker et API

Nous savons maintenant stoquer les assets de notre application en cache. Qu'en est-il des données venant d'une API ?

### Contexte

Notre application nous permet d'afficher et de gérer une liste de films. Les données concernant les films seront stoqués sur une base de donnée exterieure.
Nous souhaitons distribuer les données des films stoqués en cache lorsque l'application sera hors ligne et ainsi pouvoir utiliser ses fonctionnalités même sans connection à internet.

### Création de la base de donnée

Dans cet exemple, j'utilise une base de données Firebase RealtimeDatabase. On peut utiliser ses fonctionnalités CRUD très simplement gràce à l'API fetch du navigateur.

J'utilise la route ".../films.json" pour stoquer ma liste de film et j'y ai intégré quelques exemples pour pouvoir lesafficher depuis l'application.

Documentation : [Firebase](https://firebase.google.com/docs?hl=fr)
Documentation : [Realtime Database](https://firebase.google.com/docs/database?hl=fr)

### Récupération des données et distribution dans l'application

Le fichier "/scripts/db.js" s'occupe de récupérer les données depuis la BDD et les distribue dans le DOM de mon application en passant par l'utilisation d'un template.

Il faudra veiller à utiliser une url valide correspondant à votre environnement Firebase pour que cela fonctionne.

### Mise en cache de la réponse

Depuis le service worker, nous allons intercépter la requête faite par l'application depuis le block eventListener : "fetch", puis nous stoquerons la réponse dans le cache.

sw.js :

```js
self.addEventListener("fetch", async (event) => {
	// ... //

	// callback appelé depuis event.respondWith() plus bas //
	const fetchFilms = async () => {
		// on utilise un autre cache que pour les assets : ces données seront mises à jour plus régulierement //
		const cache = await caches.open("films");

		// on déclenche manuellement la requête ici, on souhaite intéragir avec la réponse //
		try {
			const response = await fetch(event.request);
			// il faut gérer le cas ou la réponse est négative //
			if (!response.ok) {
				console.log("La base de donnée nous à envoyé une réponse négative !");
				throw new Error();
			}

			console.log("La base de donnée nous à envoyé les données !");
			// cache.put() permet de stoquer dans le cache une paire "requête" : "réponse" que l'on pourra réutiliser //
			// on clone() la réponse par sécurité //
			await cache.put(event.request, response.clone());
			// on peut maintenant renvoyer la réponse telle quel cvcers l'application //
			return response;
		} catch (error) {
			// pas de gestion d'erreur particulière pour le moment //
		}
	};

	// on intercèpte une requête ciblée (ici vers la BDD) //
	if (event.request.url.includes("/films.json")) {
		return event.respondWith(fetchFilms());
	}

	// on conserve la réponse précédente pour tous les autres cas //
	event.respondWith(fetchInterception());
});
```

La réponse est maintenant stoquée dans le cache !

![Etat du cache, chrome console](/images/dev_tool_cache_fetch.png)

Le résultat depuis l'application :

![Les films sont maintenant affichés](/images/app_affichage_des_films.png)

### Stratégie d'utilisation du cache

Il existe plusieurs manière de gérer la distribution de nos données, par exemple :

- "cache first" : on utilise le cache systématiquement s'il existe
- "DB first" : on utilise la BDD si elle est accessible, sinon le cache

Firebase propose des outils qui permettent de vérifier si la base de données à été modifiée depuis la dernière mise en cache et ainsi choisir l'option la plus optimale selon la situation. Néanmoins, le cours présent se focalise sur la mise en place du service worker, nous n'utiliserons pas ces fonctionnalités.

Nous mettrons en place donc une solution "DB first" : le cache ne sera utiilisé pour nos données "film" uniquement si la base de données n'est pas accessible.

sw.js :

```js
self.addEventListener("fetch", async (event) => {
	// ... //

	const fetchFilms = async () => {
		const cache = await caches.open("films");

		try {
			// ... //
		} catch (error) {
			console.log("La requête à echoué (pas de connection internet) !");
			// on vérifie si la requête est stoquée en cache //
			const cachedResponse = await caches.match(event.request);
			// si c'est le cas ... //
			if (cachedResponse) {
				console.log("On envoie les données stoquée dans le cache !");
				// ... on renvoie simplement la réponse associées stoquée //
				return cachedResponse;
			}

			// ni BDD ni cache .. il faudra trouver une autre solution //
			console.log("La requête à échoué et les données ne sont pas en cache !");
		}
	};

	// on intercèpte une requête ciblée (ici vers la BDD) //
	if (event.request.url.includes("/films.json")) {
		return event.respondWith(fetchFilms());
	}

	// on conserve la réponse précédente pour tous les autres cas //
	event.respondWith(fetchInterception());
});
```

Si ma requête à bien été stoquée en cache précédement, je peux maintenant accéder à ma liste de films en étant hors ligne !

![Les films sont affichés même hors ligne](/images/app_affichage_films_hors_ligne.png)
