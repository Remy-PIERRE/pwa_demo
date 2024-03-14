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
		const cachesToDelete = keyList.filter(
			(key) => key !== cacheName && key !== "films"
		);
		await Promise.all(cachesToDelete.map(deleteCache));
	};

	// on prolonge l'évenement "activate" jusqu'à ceque le cache soit nettoyé //
	event.waitUntil(deleteOldCaches());
});

// on récupère les fichiers en cache lorsque l'application les réclame //
self.addEventListener("fetch", async (event) => {
	// caches.match() renvoie une Promesse si la requête correspond à une ressource possédée dans le cache //
	// sinon la méthode renvoie "undefined"
	const fetchInterception = async () => {
		const cachedResponse = await caches.match(event.request);

		// si on posséde la ressource, on interrompe la requête pour envoyer notre réponse //
		if (cachedResponse) {
			// console.log("Ce fichier vient du cache !", event.request);
			return cachedResponse;
		}
		// sinon la requête n'est pas interrompue //
		else {
			// console.log("Celui ci ne vient pas du cache !", event.request);
			return fetch(event.request);
		}
	};

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

	// const addFilms = async () => {
	// 	const cache = await caches.open("films");

	// 	try {
	// 		const response = await fetch(event.request);

	// 		if (!response.ok) throw new Error();

	// 		console.log("Réussite de l'envoie des données !");
	// 		return response;
	// 	} catch (error) {
	// 		console.log("Echec de l'envoie des données !");
	// 		cache.add(event.request);
	// 		return new Response();
	// 	}
	// };

	// on intercèpte une requête ciblée (ici vers la BDD) //
	if (
		event.request.url.includes("/films.json") &&
		event.request.method === "GET"
	) {
		return event.respondWith(fetchFilms());
	}

	// if (event.request.url.includes("/films/") && event.request.method === "PUT") {
	// 	return event.respondWith(addFilms());
	// }

	// event.respondWith() permet d'intercépter les requêtes et d'émettre une réponse personnalisée si besoin //
	event.respondWith(fetchInterception());
});

// on intercepte la notification pish envoyée depuis le serveur //
self.addEventListener("push", (event) => {
	const data = event.data ? event.data.json() : {};
	// on emet une notification en fonction des données reçues //
	event.waitUntil(self.registration.showNotification(data.title, data));
});
