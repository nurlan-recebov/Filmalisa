const token = localStorage.getItem("userToken");

if (!token) {
  window.location.href = "login.html";
}

const getMovies = async () => {
  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/categories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const resData = await response.json();
    const categories = resData.data;
    // const allMovies = categories.flatMap((category) => category.movies);

    // const evenCategoryMovies = categories
    //   .filter((_, index) => index % 2 === 0)
    //   .flatMap((cat) => cat.movies);

    // const oddCategoryMovies = categories
    //   .filter((_, index) => index % 2 !== 0)
    //   .flatMap((cat) => cat.movies);

    // renderOddMovies(oddCategoryMovies, ".action-section-content");
    // renderEvenMovies(evenCategoryMovies, ".comedy-section-content");
    // renderSliderMovies(allMovies, ".home-swiper-wrapper");
    // initSwiper();

    const allMovies = categories.flatMap((category) => category.movies);
    renderSliderMovies(allMovies, ".home-swiper-wrapper");
    initSwiper();

    renderDynamicCategories(categories);
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
    observeParents: true,
  });
};


const renderDynamicCategories = (categories) => {
  const container = document.querySelector(".movies-container");
  
  container.innerHTML = "";

  const reversedCategories = [...categories].reverse();

  container.innerHTML = reversedCategories.map((cat, index) => {
    if (cat.movies.length === 0) return ""; 

    const isComedy = index % 2 !== 0; 
    
    return `
      <section class="${isComedy ? 'home-comedy-section' : 'home-action-section'}">
        <div class="home-section-heading">
          ${isComedy ? `<h4>${cat.name}</h4>` : `<h3>${cat.name}</h3>`}
          <img src="./../../assets/icons/Home Page/next-icon.svg" alt="next" />
        </div>
        <div class="${isComedy ? 'comedy-section-content' : 'action-section-content'}">
          ${cat.movies.map(movie => isComedy ? renderComedyCard(movie) : renderActionCard(movie)).join("")}
        </div>
      </section>
    `;
  }).join("");
};

const renderActionCard = (movie) => `
  <div class="action-card">
    <img src="${movie.cover_url}" alt="${movie.title}" />
    <div class="action-card-content">
      <p class="action-film-category">${movie.category.name}</p>
      <p class="action-film-title">${movie.title}</p>
    </div>
  </div>
`;

const renderComedyCard = (movie) => `
  <div class="comedy-card">
    <img src="${movie.cover_url}" alt="${movie.title}" />
    <div class="comedy-card-content">
      <p class="comedy-film-category">${movie.category.name}</p>
      <img src="./../../assets/icons/Home Page/rating-icon.svg" alt="rating" />
      <p class="comedy-film-title">${movie.title}</p>
    </div>
  </div>
`;

const renderSliderMovies = (movies, categoryCards) => {
  const container = document.querySelector(categoryCards);
  container.innerHTML = movies
    .map(
      (movie) => `
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
  `,
    )
    .join("");
};

getMovies();
