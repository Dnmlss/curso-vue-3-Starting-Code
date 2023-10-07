const API = "https://api.github.com/users/";

// Creamos una funcion asincrona para hacer la peticion a la API de github

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
			window.localStorage.getItem("favorites")
		); // Obtenemos los favoritos del localStorage
		if (savedFavorites) {
			const favorites = new Map(
				savedFavorites.map((favorite) => [favorite.id, favorite])
			);
			this.favorites = favorites;
		}
	},
	computed: {
		isFavorite() {
			return this.favorites.has(this.result.id);
		},
		allFavorites() {
			return Array.from(this.favorites.values());
		},
	},

	methods: {
		async doSearch() {
			this.result = this.error = null; // Limpiamos los valores de result y error
			try {
				const response = await fetch(API + this.search); // Hacemos la peticion a la API de github
				if (!response.ok) throw new Error("User Not Found"); // Si la respuesta no es correcta lanzamos un error
				const data = await response.json(); // Convertimos la respuesta en un objeto JSON
				console.log(data);
				this.result = data;
			} catch (error) {
				this.error = error; // Si hay un error lo almacenamos en la variable error
			} finally {
				this.search = null; // Limpiamos el valor del input
			}
		},
		addFavorite() {
			this.favorites.set(this.result.id, this.result); // Añadimos el usuario a la lista de favoritos
			this.updateFavorite(); // Actualizamos la lista de favoritos en el localStorage
		},
		removeFavorite() {
			this.favorites.delete(this.result.id);
			this.updateFavorite();
		},

		showFavorites(favorite) {
			this.result = favorite;
		},

		updateFavorite() {
			window.localStorage.setItem(
				"favorites",
				JSON.stringify(this.allFavorites)
			);
		},
	},
});

// Montamos la instancia app para dar acceso a Vue a una pieza de nuestro DOM por medio de un selector, en este caso ID #app.
const mountedApp = app.mount("#app");
