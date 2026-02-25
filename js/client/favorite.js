
const API_FAVORITES =
    "https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites";

const TOKEN = localStorage.getItem("userToken");
if (!TOKEN) window.location.href = "login.html";

const movieList = document.querySelector(".movie-list");

async function fetchFavorites() {
    try {
        const res = await fetch(API_FAVORITES, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        const data = await res.json();
        const favorites = data.data || [];

        renderFavorites(favorites);
    } catch (err) {
        console.error("Fetch favorites error:", err);
    }
}

function renderFavorites(movies) {
    movieList.innerHTML = "";

    if (!movies.length) {
        movieList.innerHTML = `
      <p style="color:#aaa; font-size:18px;">
        No favorite movies yet.
      </p>
    `;
        return;
    }

    movies.forEach((movie) => {
        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
      <img
        src="${movie.cover_url || "../../assets/images/test-image.png"}"
        alt="${movie.title}"
        class="movie-poster"
      />
      <div class="movie-info">
        <p class="movie-genre">${movie.category?.name || "-"}</p>
        <p class="movie-rating">⭐ ${movie.imdb || "-"}</p>
        <h2 class="movie-title">${movie.title}</h2>
      </div>
    `;

        card.addEventListener("click", () => {
            window.location.href = `detailed.html?id=${movie.id}`;
        });

        movieList.appendChild(card);
    });
}

fetchFavorites();