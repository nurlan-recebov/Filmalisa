
// --- COMMENT API LOGIC ---
const commentsList = document.getElementById("commentsList");
const commentBtn = document.querySelector(".comment-btn");
const commentInput = document.querySelector(".comment-input");

function getRelativeDate(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const inputDate = new Date(date);
    if (inputDate.toDateString() === today.toDateString()) return "Today";
    if (inputDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return inputDate.toLocaleDateString();
}

function renderComments(comments) {
    commentsList.innerHTML = "";
    console.log('[DEBUG] renderComments called with:', comments);
    if (!comments || comments.length === 0) {
        commentsList.innerHTML = "<p>No comments yet.</p>";
        return;
    }
    comments.forEach((comment) => {
        const div = document.createElement("div");
        div.classList.add("comment-item");
        div.innerHTML = `
            <div class="comment-left">
                <img src="../../assets/images/profilePhote.svg" alt="Profile">
                <div class="user-info">
                    <div class="user-name">${comment.user_name || "User"}</div>
                    <div class="comment-text">${comment.text}</div>
                </div>
            </div>
            <div class="comment-time">
                ${getRelativeDate(comment.created_at || new Date())}
            </div>
        `;
        commentsList.appendChild(div);
    });
}


async function fetchComments() {
    try {
        const response = await fetch(
            `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        const data = await response.json();
        console.log('[DEBUG] fetchComments API response:', data);
        renderComments(data.comments || []);
    } catch (error) {
        console.log("Movie fetch error:", error);
    }
}

async function postComment(text) {
    try {
        await fetch(
            `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}/comment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: JSON.stringify({ text }),
            }
        );
        fetchComments();
    } catch (error) {
        console.log("Comment post error:", error);
    }
}

if (commentBtn && commentInput) {
    commentBtn.addEventListener("click", () => {
        const text = commentInput.value.trim();
        if (!text) return;
        postComment(text);
        commentInput.value = "";
    });
    commentInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            commentBtn.click();
        }
    });
}

fetchComments();


// details modal
// Fetch and render movie details for detailed.html
const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MjYxLCJpYXQiOjE3NzE2NzU0NTksImV4cCI6MTgwMjc3OTQ1OX0.9Cjid2OSYOxzvJ1UzxHwp--2LsA8ZO365ljtP0JIt7c";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

async function fetchAndRenderMovie() {
    try {
        const res = await fetch(API_URL, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        if (!data.result) throw new Error("API Error");
        const movie = data.data.find(f => f.id === parseInt(movieId));
        if (!movie) throw new Error("Movie not found");
        console.log('Fetched movie object:', movie);

        // Background image
        const bgImg = document.querySelector('.background-image');
        if (bgImg) {
            bgImg.src = movie.background_url || movie.cover_url || '../../assets/images/photo.jpg';
            bgImg.onerror = () => { bgImg.src = '../../assets/images/photo.jpg'; };
        }

        // Overlay text
        const nameEl = document.querySelector('.overlay-text .name');
        const titleEl = document.querySelector('.overlay-text .title');
        const subtitleCategoryEl = document.querySelector('.overlay-text .category');
        if (nameEl) nameEl.textContent = movie.title || '-';
        if (titleEl) titleEl.textContent = movie.title || '-';
        if (subtitleCategoryEl) subtitleCategoryEl.textContent = (movie.category && movie.category.name) ? movie.category.name : '-';

        // Main poster
        const moviePosterDiv = document.querySelector('#moviePosterDiv img');
        if (moviePosterDiv) {
            moviePosterDiv.src = movie.cover_url || '../../assets/images/detaPhoto.svg';
            moviePosterDiv.onerror = () => { moviePosterDiv.src = '../../assets/images/detaPhoto.svg'; };
        }

        // Description
        const descriptionEl = document.querySelector('.details__description');
        if (descriptionEl) descriptionEl.textContent = movie.overview || '-';

        // Rating
        const ratingBtn = document.querySelector('.btn-rating');
        if (ratingBtn) ratingBtn.innerHTML = `<img src="../../assets/images/ratingBtn.svg" alt="Rating">${movie.imdb ? movie.imdb : '-'}`;

        // Watch button
        const watchBtn = document.querySelector('.details__actions .btn-primary');
        if (watchBtn) {
            watchBtn.onclick = () => {
                if (movie.watch_url) {
                    window.open(movie.watch_url, '_blank');
                } else {
                    alert('No watch link available.');
                }
            };
        }

        // Favorite (+) button logic
        const favBtn = document.querySelector('.details__actions .btn-icon');
        if (favBtn) {
            const favImg = favBtn.querySelector('img');
            // Set initial state based on favorites
            let favorites = [];
            try {
                favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            } catch (e) { favorites = []; }
            let isFavorite = favorites.some(f => f.id === movie.id);
            if (favImg) {
                if (isFavorite) {
                    favImg.src = '../../assets/images/Home%20Page/green-check.svg';
                    favImg.alt = 'Added';
                    favImg.classList.add('favorite-check-icon');
                } else {
                    favImg.src = '../../assets/images/detaPlus.svg';
                    favImg.alt = 'Add';
                    favImg.classList.remove('favorite-check-icon');
                }
            }
            favBtn.onclick = () => {
                let favorites = [];
                try {
                    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                } catch (e) { favorites = []; }
                let isFavorite = favorites.some(f => f.id === movie.id);
                if (!isFavorite) {
                    favorites.push({
                        id: movie.id,
                        title: movie.title,
                        cover_url: movie.cover_url,
                        imdb: movie.imdb,
                        category: movie.category?.name || '',
                        overview: movie.overview || ''
                    });
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    if (favImg) {
                        favImg.src = '../../assets/images/Home%20Page/green-check.svg';
                        favImg.alt = 'Added';
                        favImg.classList.add('favorite-check-icon');
                    }
                } else {
                    favorites = favorites.filter(f => f.id !== movie.id);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    if (favImg) {
                        favImg.src = '../../assets/images/detaPlus.svg';
                        favImg.alt = 'Add';
                        favImg.classList.remove('favorite-check-icon');
                    }
                }
            };
        }

        // Trailer modal logic with YouTube embed fix
        const videoModal = document.getElementById("videoModal");
        const videoFrame = document.getElementById("videoFrame");
        const videoTitle = document.getElementById("videoTitle");
        const playBtn = document.getElementById("playBtn");
        const closeBtn = document.querySelector(".video-modal .close");
        const posterImg = document.querySelector(".details__image img");

        // Helper to get valid YouTube embed URL
        function getYouTubeEmbedUrl(url) {
            if (!url) return '';
            // If already an embed link
            if (url.includes('youtube.com/embed/')) return url;
            // If it's a watch?v= link
            const match = url.match(/[?&]v=([\w-]{11})/);
            if (match) return `https://www.youtube.com/embed/${match[1]}`;
            // If it's a youtu.be short link
            const short = url.match(/youtu\.be\/([\w-]{11})/);
            if (short) return `https://www.youtube.com/embed/${short[1]}`;
            // Otherwise, return as is
            return url;
        }

        const trailerUrl = getYouTubeEmbedUrl(movie.fragman);

        if (posterImg && videoModal && videoTitle && videoFrame) {
            posterImg.addEventListener("click", () => {
                videoModal.style.display = "flex";
                videoTitle.textContent = movie.title || '-';
                videoFrame.src = trailerUrl;
            });
        }
        if (playBtn && videoFrame && trailerUrl) {
            playBtn.onclick = () => {
                videoFrame.src = trailerUrl + "?autoplay=1";
                playBtn.style.display = 'none';
            };
        }
        if (closeBtn && videoModal && videoFrame && playBtn) {
            closeBtn.onclick = () => {
                videoFrame.src = '';
                videoModal.style.display = "none";
                playBtn.style.display = '';
            };
        }
        if (videoModal && videoFrame && playBtn) {
            videoModal.addEventListener("click", (e) => {
                if (e.target === videoModal) {
                    videoFrame.src = '';
                    videoModal.style.display = "none";
                    playBtn.style.display = '';
                }
            });
        }

        // Info fields: only show what exists in API
        const infoItems = document.querySelectorAll('.details__info .info-item .info-value');
        // 0: Type (not available)
        if (infoItems[0]) infoItems[0].parentElement.style.display = 'none';
        // 1: Status (not available)
        if (infoItems[1]) infoItems[1].parentElement.style.display = 'none';
        // 2: No. of episodes (not available)
        if (infoItems[2]) infoItems[2].parentElement.style.display = 'none';
        // 3: First air date (not available)
        if (infoItems[3]) infoItems[3].parentElement.style.display = 'none';
        // 4: Last air date (not available)
        if (infoItems[4]) infoItems[4].parentElement.style.display = 'none';
        // 5: Episode run time (use run_time_min)
        if (infoItems[5]) infoItems[5].textContent = movie.run_time_min ? `${movie.run_time_min} min` : '-';
        // 6: Genres (not available)
        if (infoItems[6]) infoItems[6].parentElement.style.display = 'none';

        // Cast (not available)
        const castContainer = document.querySelector('.details-actor');
        if (castContainer) {
            castContainer.innerHTML = '<div style="color:#ccc;">No cast information available.</div>';
        }
    } catch (error) {
        console.error(error);
        alert("Movie data could not be loaded.");
    }
}

if (movieId) {
    fetchAndRenderMovie();
} else {
    alert("No movie ID provided in URL.");
}






const form = document.getElementById("commentForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Formun default submit davranışını dayandırır

    const commentText = document.getElementById("commentInput").value;

    // Token varsa onu əlavə edirsən
    const token = localStorage.getItem("userToken");

    try {
        const response = await fetch("https://api.sarkhanrahimli.dev/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // əgər auth tələb olunursa
            },
            body: JSON.stringify({
                comment: commentText
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Comment submitted successfully!");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong!");
    }
});