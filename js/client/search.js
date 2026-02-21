const input = document.getElementById("search");
const button = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("movies");

let allMovies = [];

button.addEventListener("click", searchMovies);

async function getMovies() {
    try {
        // LOADING
        moviesContainer.innerHTML = "<h1>Loading...</h1>";

     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MjYxLCJpYXQiOjE3NzE2NzIwMDYsImV4cCI6MTgwMjc3NjAwNn0.YTduWyNO5MHl0mQJYxs7Nqier0Yas5RfWVtsvd2oUC4";
        const res = await fetch("https://api.sarkhanrahimli.dev/api/filmalisa/movies", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();
        allMovies = result.data;

        showMovies(allMovies);

    } catch (error) {
        moviesContainer.innerHTML = "<h1>Error loading movies</h1>";
        console.log(error);
    }
}

function showMovies(movies) {
    moviesContainer.innerHTML = "";

    if (movies.length === 0) {
        moviesContainer.innerHTML = "<h1>Film tapılmadı</h1>";
        return;
    }

    movies.forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie-card";

        div.innerHTML = `
            <img src="${movie.cover_url}" alt="movie" class="movie-poster">
            <div class="movie-info">
                <p class="movie-genre">${movie.genre || "Movie"}</p>
                <p class="movie-rating">★★★★★</p>
                <h2 class="movie-title">${movie.title}</h2>
            </div>
        `;

        moviesContainer.appendChild(div);
    });
}

function searchMovies() {
    const value = input.value.toLowerCase().trim();

    const filteredMovies = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(value)
    );

    showMovies(filteredMovies);
}

getMovies();