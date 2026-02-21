async function getMovies() {
    try {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MjYxLCJpYXQiOjE3NzE2NzIwMDYsImV4cCI6MTgwMjc3NjAwNn0.YTduWyNO5MHl0mQJYxs7Nqier0Yas5RfWVtsvd2oUC4";

        const res = await fetch("https://api.sarkhanrahimli.dev/api/filmalisa/movies", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();
        console.log(result);

        const moviesContainer = document.getElementById("movies");

        result.data.forEach(movie => {
            const div = document.createElement("div");
            div.className = 'movie-card'

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

    } catch (error) {
        console.log(error);
    }
}

getMovies();