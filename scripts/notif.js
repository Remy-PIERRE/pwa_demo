// on attend que le client click sur le bouton de notification //
const button = document.querySelector("#notifications");
button.addEventListener("click", async () => {
	// on vérifie que le client puisse gérer les notifications //
	if (!"Notification" in window) {
		alert("Ce navigateur ne prend pas en compte les notifications !");
	}

	// si les notifications sont activées, on peut directement en envoyer une pour tester //
	else if (Notification.permission === "granted") {
		const notification = new Notification("Ceci est une notification !");
	}

	// si l'utilisateur à déjà parétré son refus //
	else if (Notification.permission === "denied") {
		alert("Les notifications ne sont pas autorisées sur ce poste !");
	}

	// autrement, on demande l'autorisation à l'utilisateur d'utiliser ce service //
	// la fenêtre qui apparait pour valider la demande dépend du navigateur utilisé //
	else if (Notification.permission !== "denied") {
		const permission = await Notification.requestPermission();

		// on envoie enfin la notification de test//
		if (permission === "granted") {
			const notification = new Notification("Ceci est une notification !");
		}
	}
});
