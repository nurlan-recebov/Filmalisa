const token = localStorage.getItem("userToken");

// Token yoxdursa loginə atır
if (!token) {
  window.location.href = "login.html";
}

const API = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";

const getMovies = async () => {
  try {
    const response = await fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = await response.json();
    const movies = resData.data;

    // Slider render
    renderSliderMovies(movies, ".home-swiper-wrapper");
    initSwiper();

    // Category üzrə filmləri göstər
    renderMoviesByCategory(movies, ".movies-container");

  } catch (error) {
    console.error("Xəta:", error);
  }
};

// ======================
// SWIPER INIT
// ======================
const initSwiper = () => {
  new Swiper(".swiper", {
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

// ======================
// SLIDER RENDER
// ======================
const renderSliderMovies = (movies, selector) => {
  const container = document.querySelector(selector);

  container.innerHTML = movies.map(movie => `
    <div class="home-swiper-slide swiper-slide">
      <img src="${movie.cover_url}" alt="${movie.title}" />
      <div class="slide-info">
        <p class="slider-film-category">${movie.category.name}</p>
        <h2>${movie.title}</h2>
        <p>
          ${movie.description || "No description available."}
        </p>
        <a href="./detailed.html?id=${movie.id}" class="slider-watch-btn">
          Watch now
        </a>
      </div>
    </div>
  `).join("");
};

// ======================
// CATEGORY GROUP RENDER
// ======================
const renderMoviesByCategory = (movies, containerSelector) => {
  const container = document.querySelector(containerSelector);

  // Filmləri category-yə görə qruplaşdırırıq
  const grouped = movies.reduce((acc, movie) => {
    const categoryName = movie.category.name;

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push(movie);
    return acc;
  }, {});

  // HTML qururuq
  container.innerHTML = Object.keys(grouped)
    .map(category => `
      <div class="category-section">
        <h2 class="category-title">${category}</h2>
        <div class="category-movies">
          ${grouped[category].map(movie => `
            <a href="./detailed.html?id=${movie.id}" class="movie-card">
              <img src="${movie.cover_url}" alt="${movie.title}" />
              <p class="movie-title">${movie.title}</p>
            </a>
          `).join("")}
        </div>
      </div>
    `)
    .join("");
};

getMovies();