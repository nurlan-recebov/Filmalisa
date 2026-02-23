const token = localStorage.getItem("userToken");

if (!token) {
  window.location.href = "login.html";
}

const getMovies = async () => {
  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/movies",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const resData = await response.json();
    const movies = resData.data; 

    const actionMovies = movies.filter((m) => m.category.name === "Action");
    const comedyMovies = movies.filter((m) => m.category.name === "Thriller");

    renderActionMovies(actionMovies, ".action-section-content");
    renderComedyMovies(comedyMovies, ".comedy-section-content");
    renderSliderMovies(movies,".home-swiper-wrapper");
    initSwiper();
  } catch (error) {
    console.error("Xəta:", error);
  }
};

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    loop: true,
    autoplay: { delay: 2000, disableOnInteraction: false },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    observer: true,
    observeParents: true
  });
};

const renderComedyMovies = (movies, categoryCards) => {
  const container = document.querySelector(categoryCards);
  container.innerHTML = movies.map(movie => `
     <div class="comedy-card">
              <img
                src="${movie.cover_url}"
                alt="${movie.title}"
              />
              <div class="comedy-card-content">
                <p class="comedy-film-category">${movie.category.name}</p>
                <img
                  src="./../../assets/icons/Home Page/rating-icon.svg"
                  alt="rating"
                />
                <p class="comedy-film-title">${movie.title}</p>
              </div>
            </div>
  `).join("");
};

const renderActionMovies = (movies, categoryCards) => {
  const container = document.querySelector(categoryCards);
  container.innerHTML = movies.map(movie => `
<div class="action-card">
              <img
                src="${movie.cover_url}"
                alt="${movie.title}"
              />
              <div class="action-card-content">
                <p class="action-film-category">${movie.category.name}</p>
                <p class="action-film-title">${movie.title}</p>
              </div>
            </div>
  `).join("");
};

const renderSliderMovies = (movies, categoryCards) => {
  const container = document.querySelector(categoryCards);
  container.innerHTML = movies.map(movie => `
              <div class="home-swiper-slide swiper-slide">
                <img
                  src="${movie.cover_url}"
                  alt="${movie.title}"
                />
                <div class="slide-info">
                  <p class="slider-film-category">${movie.category.name}</p>
                  <img
                    src="./../../assets/icons/Home Page/rating-icon.svg"
                    alt="rating icon"
                  />
                  <h2>${movie.title}</h2>
                  <p>
                    In a time when monsters walk the Earth, humanity’s fight for
                    its future sets Godzilla and Kong on a collision course that
                    will see the two most powerful forces of nature on the
                    planet collide in a spectacular battle for the ages.
                  </p>
                  <a href="${movie.watch_url}" class="slider-watch-btn">Watch now</a>
                </div>
              </div>
  `).join("");
};

getMovies();
