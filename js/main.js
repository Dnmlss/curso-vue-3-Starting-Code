const API = "https://api.github.com/users/";

const requestMaxTimeMs = 3000;

// Utilizamos el metodo createApp para crear una instancia de Vue
const app = Vue.createApp({
	data() {
		return {
			search: null, // Creamos una variable search para almacenar el valor del input
			result: null, // Creamos una variable result para almacenar el resultado de la peticion
			error: null, // Creamos una variable error para almacenar el error de la peticion
			favorites: new Map(), // Creamos una variable favorites para almacenar los usuarios favoritos
		};
	},
	created() {
		const savedFavorites = JSON.parse(
			window.localStorage.getItem("favorites") // Obtenemos los favoritos del localStorage
		);

		if (savedFavorites) {
			const favorites = new Map(
				savedFavorites.map((favorite) => [favorite.login, favorite])
			);
			this.favorites = favorites;
		}
	},

	computed: {
		isFavorite() {
			return this.favorites.has(this.result.login);
		},

		allFavorites() {
			return Array.from(this.favorites.values());
		},
	},

	methods: {
		async doSearch() {
			this.result = this.error = null; // Limpiamos los valores de result y error

			const foundInFavorites = this.favorites.get(this.search); // Buscamos si el usuario ya esta en favoritos

			const shouldRequestAgain = (() => {
				if (!!foundInFavorites) {
					if (foundInFavorites.lastRequestTime) {
						const { lastRequestTime } = foundInFavorites;
						const now = Date.now();
						return now - lastRequestTime > requestMaxTimeMs;
					}
				}
				return false;
			})(); // IIFE

			if (!!foundInFavorites && !shouldRequestAgain) {
				console.log("Found and we use the cached version");
				return (this.result = foundInFavorites);
			} // Si el usuario esta en favoritos, lo mostramos y salimos de la funcion

			try {
				console.log("Not found or cached version is too old");
				const response = await fetch(API + this.search); // Hacemos la peticion a la API de github con el valor de busqueda
				if (!response.ok) throw new Error("User Not Found"); // Si la respuesta no es correcta lanzamos un error
				const data = await response.json(); // Convertimos la respuesta en un objeto JSON
				console.log(data);
				this.result = data;
				if (foundInFavorites) {
					foundInFavorites.lastRequestTime = Date.now(); // Actualiza la propiedad 'lastRequestTime' de foundInFavorites con el tiempo actual.
				}
			} catch (error) {
				console.error(error);
				this.error = error; // Si hay un error lo almacenamos en la variable error
			} finally {
				this.search = null; // Limpiamos el valor del input
			}
		},

		addFavorite() {
			this.result.lastRequestTime = Date.now();
			this.favorites.set(this.result.login, this.result); // Añadimos el usuario a la lista de favoritos. primero su id, luego el objeto completo
			this.updateFavorite(); // Actualizamos la lista de favoritos en el localStorage
		},

		removeFavorite() {
			this.favorites.delete(this.result.login);
			this.updateFavorite();
		},

		showFavorites(favorite) {
			this.result = favorite;
		},

		checkFavorites(id) {
			return this.result?.login === id;
		},

		updateFavorite() {
			window.localStorage.setItem(
				"favorites",
				JSON.stringify(this.allFavorites)
			);
		},
	},
});
