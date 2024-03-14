// on vérifie si le service est supporté ... //
if ("serviceWorker" in navigator) {
	console.log("Les services workers sont supportés ici !");

	// ... puis on l'enregistre dans l'application //
	const registration = await navigator.serviceWorker.register("/sw.js");
	console.log("Le service worker est enregistré !", registration);

	// on vérifie si l'application est abonnéeau service de notification //
	const subscription = await registration.pushManager.getSubscription();

	// si ce n'est pas le cas on l'enregistre //
	if (!subscription) {
		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			// on utilise ici une clef au format VAPID //
			applicationServerKey: "...",
		});
	}

	// il faut ensuite enregistrer l'abonnement sur le serveur //
	await fetch("url_service_notification_du_serveur", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
		},
		body: JSON.stringify(subscription),
	});
}

const addFilmButton = document.querySelector("#addFilmButton");
addFilmButton.addEventListener("click", () => {
	openAddFilmMenu();
});

const addFilmMenu = document.querySelector("#addFilmMenu");
addFilmMenu.addEventListener("click", (event) => {
	if (event.target === event.currentTarget) {
		closeAddFilmMenu();
	}
});

const addFilmForm = document.querySelector("#addFilmForm");
addFilmForm.addEventListener("submitsuccess", () => {
	closeAddFilmMenu();
});

function openAddFilmMenu() {
	const addFilmMenu = document.querySelector("#addFilmMenu");
	addFilmMenu.classList.toggle("opened");
}

function closeAddFilmMenu() {
	const addFilmMenu = document.querySelector("#addFilmMenu");
	addFilmMenu.classList.toggle("opened");
}
