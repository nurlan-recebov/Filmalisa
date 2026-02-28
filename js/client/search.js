const input = document.getElementById("search");
const button = document.getElementById("searchBtn");
const moviesContainer = document.getElementById("movies");
const loader = document.getElementById("loader");


let allMovies = [];
const token = localStorage.getItem("userToken");

if (!token) {
  window.location.href = "login.html";
}

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchMovies();
});

button.addEventListener("click", searchMovies);

async function getMovies() {
  loader.classList.remove("loader-hidden");
  try {

    const res = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/movies",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await res.json();
    allMovies = result.data;

    showMovies(allMovies);
  } catch (error) {
    moviesContainer.innerHTML = "<h1>Error loading movies</h1>";
    console.log(error);
  }
  finally {
    setTimeout(() => {
      loader.classList.add("loader-hidden");
    }, 500);
  }
}

function showMovies(movies) {
  moviesContainer.innerHTML = "";

  if (movies.length === 0) {
    moviesContainer.innerHTML = "<h1>Film tapılmadı</h1>";
    return;
  }

  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "movie-card";

    div.innerHTML = `
      <img src="${movie.cover_url}" alt="movie" class="movie-poster">
      <div class="movie-info">
          <p class="movie-genre">${movie.genre || "Movie"}</p>
          <p class="movie-rating"><img src="./../../assets/icons/Home Page/rating-icon.svg" alt=""></p>
          <h2 class="movie-title">${movie.title}</h2>
      </div>
    `;

    div.addEventListener("click", () => {
      window.location.href = `detailed.html?id=${movie.id}`;
    });

    moviesContainer.appendChild(div);
  });
}

function searchMovies() {
  const value = input.value.toLowerCase().trim();

  const filteredMovies = allMovies.filter((movie) =>
    movie.title.toLowerCase().includes(value),
  );

  showMovies(filteredMovies);
}

getMovies();
