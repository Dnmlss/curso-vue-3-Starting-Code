app.component("app-profile", {
	// creamos una propiedad y le decimos de que depende este componente. en este caso de result y isFavorite
	props: ["result", "isFavorite"],

	methods: {
		addFavorite() {
			this.$emit("add-favorite");
		},

		removeFavorite() {
			this.$emit("remove-favorite");
		},
	},

	template: /*html*/ `
    <div class="result">
    <a
        v-if="isFavorite"
        href="#"
        class="result__toggle-favorite"
        @click="removeFavorite"
        >Remove favorite ❌</a 
    >
    <a
        v-else
        href="#"
        class="result__toggle-favorite"
        @click="addFavorite"
        >Add favorite ⭐️</a
    >
    <h2 v-if="isFavorite" class="result__name">{{ result.name }} ⭐️</h2>
    <h2 v-else class="result__name">{{ result.name }} </h2>
    <img
        v-bind:src="result.avatar_url"
        :alt="result.name"
        class="result__avatar"
    />
    <p v-if="result.bio === null" class="result__bio">Perfil sin Biografía 🙃</p>
    <p v-else class="result__bio">{{ result.bio }}</p>
    <br />
        <a v-bind:href="result.html_url" class="a-github" target="_blank"
            >Ir al Github</a>
    <div class="cant-repos">
        <h4 class="public-repos">Public Repos: </h4>
        <span> {{ result.public_repos }} </span>
    </div>
</div>`,
});
