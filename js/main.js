const API = "https://api.github.com/users/";

// Creamos una funcion asincrona para hacer la peticion a la API de github

// Utilizamos el metodo createApp para crear una instancia de Vue
const app = Vue.createApp({
	data() {
		return {
			search: null, // Creamos una variable search para almacenar el valor del input
		};
	},
	methods: {
		async doSearch() {
			const response = await fetch(API + this.search); // Hacemos la peticion a la API de github
			const data = await response.json(); // Convertimos la respuesta en un objeto JSON
			console.log(data);
		},
	},
});

// Montamos la instancia app para dar acceso a Vue a una pieza de nuestro DOM por medio de un selector, en este caso ID #app.
const mountedApp = app.mount("#app");
