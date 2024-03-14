async function initDisplayFilmsCards() {
	// je récupère mes données //
	const dataFilms = await getFilms();
	// je réinitialise l'affichage de mes films et évite ainsi la multiplication des cartes affichées //
	resetDisplayFilms();
	// j'affiche les cartes "film" en fonction des données récupérées //
	displayFilms(dataFilms);
}

async function getFilms() {
	try {
		// requête "GET" vers la BDD , j'ajoute "/films.json" à la fin de l'url pour accéder à la collection "films"
		const response = await fetch("https://.../films.json");
		const data = await response.json();

		// les données sont prètes //
		console.log("data : ", data);
		return data;
	} catch (error) {
		// la requête à échoué, je gère l'erreur dans un block catch //
		console.log("Erreur lors de la récupération de la liste des films !");
	}
}

function displayFilms(dataFilms) {
	const container = document.querySelector("#filmsContainer");
	// pour chaque film ... //
	dataFilms.forEach((film, index) => {
		// attention il arrive parfois que certaines données envoyées par firebase soient vides //
		if (!film) return;

		// j'utilise un <template> pour faciliter la création de mes carte "film" //
		const template = document
			.querySelector("#filmTemplate")
			.content.cloneNode(true);
		// les données sont distribuées //
		template.querySelector(".film--container").setAttribute("data-id", index);
		template.querySelector(".film--title").innerHTML = `${film.title}`;
		template.querySelector(
			".film--type"
		).innerHTML = `Genre : <span>${film.type}</span>`;
		template.querySelector(
			".film--duration"
		).innerHTML = `Durée : <span>${film.duration}</span>`;
		// ma carte est attribuée à son contenant //
		container.appendChild(template);
	});
}

function resetDisplayFilms() {
	const container = document.querySelector("#filmsContainer");
	// je fait attention à ne pas supprimer le <template> pour pouvoir le réutiliser à chaque affichage //
	const childrens = container.querySelectorAll(":scope > .film--container");
	// je supprime toutes les cartes "film"
	childrens.forEach((child) => child.remove());
}

// on lance l'opération une première fois dès le chargement du fichier //
initDisplayFilmsCards();

const addFilmForm = document.querySelector("#addFilmForm");
addFilmForm.addEventListener("submit", async (event) => {
	event.preventDefault();

	if (
		[
			event.target.title.value,
			event.target.type.value,
			event.target.duration.value,
		].includes("")
	) {
		return console.log("Form not completed !");
	}

	const film = {
		title: event.target.title.value,
		type: event.target.type.value,
		duration: event.target.duration.value,
	};

	const films = [...document.querySelectorAll(".film--container")];
	let id = 0;

	if (films.length > 0) {
		id =
			+[...document.querySelectorAll(".film--container")]
				.map((elem) => elem.getAttribute("data-id"))
				.reduce((a, b) => {
					if (a > b) return a;
					else return b;
				}) + 1;
	}

	try {
		const response = await fetch(`https://.../films/${id}.json`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify(film),
		});
		const data = await response.json();

		if (Notification.permission === "granted") {
			const notification = new Notification(
				`Le film ${film.title} a bien été enregistré !`
			);
		}
	} catch (error) {
		console.log("L'enregistrement du film a échoué !");
	}

	createNewFilmCard(id, film);
	event.target.dispatchEvent(new CustomEvent("submitsuccess"));
});

function createNewFilmCard(id, film) {
	const template = document
		.querySelector("#filmTemplate")
		.content.cloneNode(true);

	template.querySelector(".film--container").setAttribute("data-id", id);
	template.querySelector(".film--title").innerHTML = `${film.title}`;
	template.querySelector(
		".film--type"
	).innerHTML = `Genre : <span>${film.type}</span>`;
	template.querySelector(
		".film--duration"
	).innerHTML = `Durée : <span>${film.duration}</span>`;

	const container = document.querySelector("#filmsContainer");
	container.appendChild(template);
}
