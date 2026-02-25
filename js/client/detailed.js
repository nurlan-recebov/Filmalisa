// --- detailed.js ---

const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
const ADMIN_COMMENT_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments";
const TOKEN = localStorage.getItem("userToken"); // frontend user token

if (!TOKEN) window.location.href = "login.html";

// URL-dən movieId alırıq
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// --- COMMENTS LOGIC ---
const commentsList = document.getElementById("commentsList");
const commentBtn = document.querySelector(".comment-btn");
const commentInput = document.querySelector(".comment-input");

// Funksiya: tarixləri qısaltmaq
function getRelativeDate(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const inputDate = new Date(date);
    if (inputDate.toDateString() === today.toDateString()) return "Today";
    if (inputDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return inputDate.toLocaleDateString();
}

// Funksiya: commentləri render et
function renderComments(comments) {
    commentsList.innerHTML = "";
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
                    <div class="user-name">${comment.user_name || comment.user?.full_name || "User"}</div>
                    <div class="comment-text">${comment.text || comment.comment}</div>
                </div>
            </div>
            <div class="comment-time">${getRelativeDate(comment.created_at || comment.created_at || new Date())}</div>
        `;
        commentsList.appendChild(div);
    });
}

// LocalStorage-dan commentləri yükle
function loadLocalComments() {
    const storedComments = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
    renderComments(storedComments);
}

// Backend-dən commentləri çək
async function fetchComments() {
    try {
        const res = await fetch(ADMIN_COMMENT_API, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const data = await res.json();

        // Movie id ilə filter et
        const movieComments = (data.data || []).filter(c => c.movie?.id == movieId);

        // LocalStorage-a yaz və render et
        localStorage.setItem(`comments_${movieId}`, JSON.stringify(movieComments));
        renderComments(movieComments);
    } catch (err) {
        console.log("Fetch comments error:", err);
    }
}

// Yeni comment POST et
async function postComment(text) {
    if (!text) return;

    const newComment = {
        user_name: "You",
        text,
        created_at: new Date().toISOString(),
    };

    // 1️⃣ LocalStorage-a əlavə et
    let storedComments = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
    storedComments.unshift(newComment);
    localStorage.setItem(`comments_${movieId}`, JSON.stringify(storedComments));

    // 2️⃣ Dərhal render et
    renderComments(storedComments);

    // 3️⃣ Backend-ə POST et
    try {
        await fetch(`${API_URL}/${movieId}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({ comment: text }), // ← burda dəyişiklik
        });
    } catch (err) {
        console.log("Comment post error:", err);
    }
}

// Event listener: comment göndərmə
if (commentBtn && commentInput) {
    commentBtn.addEventListener("click", () => {
        const text = commentInput.value.trim();
        if (!text) return;
        postComment(text);
        commentInput.value = "";
    });
    commentInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") commentBtn.click();
    });
}

// --- MOVIE DETAILS LOGIC (orijinal kod) ---
async function fetchAndRenderMovie() {
    try {
        const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${TOKEN}` } });
        const data = await res.json();
        if (!data.result) throw new Error("API Error");

        const movie = data.data.find(f => f.id === parseInt(movieId));
        if (!movie) throw new Error("Movie not found");

        // Background
        const bgImg = document.querySelector(".background-image");
        if (bgImg) {
            bgImg.src = movie.background_url || movie.cover_url || '../../assets/images/photo.jpg';
            bgImg.onerror = () => { bgImg.src = '../../assets/images/photo.jpg'; };
        }

        // Overlay text
        const nameEl = document.querySelector(".overlay-text .name");
        const titleEl = document.querySelector(".overlay-text .title");
        const categoryEl = document.querySelector(".overlay-text .category");
        if (nameEl) nameEl.textContent = movie.title || '-';
        if (titleEl) titleEl.textContent = movie.title || '-';
        if (categoryEl) categoryEl.textContent = movie.category?.name || '-';

        // Poster
        const posterImg = document.querySelector("#moviePosterDiv img");
        if (posterImg) {
            posterImg.src = movie.cover_url || '../../assets/images/detaPhoto.svg';
            posterImg.onerror = () => { posterImg.src = '../../assets/images/detaPhoto.svg'; };
        }

        // Description
        const descriptionEl = document.querySelector(".details__description");
        if (descriptionEl) descriptionEl.textContent = movie.overview || '-';

        // Rating
        const ratingBtn = document.querySelector(".btn-rating");
        if (ratingBtn) ratingBtn.innerHTML = `<img src="../../assets/images/ratingBtn.svg" alt="Rating">${movie.imdb || '-'}`;

        // Watch button
        const watchBtn = document.querySelector(".details__actions .btn-primary");
        if (watchBtn) watchBtn.onclick = () => {
            if (movie.watch_url) window.open(movie.watch_url, "_blank");
            else alert("No watch link available.");
        };

        // Favorite (+) button
        const favBtn = document.querySelector(".details__actions .btn-icon");
        if (favBtn) {
            const favImg = favBtn.querySelector("img");
            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
            let isFavorite = favorites.some(f => f.id === movie.id);

            if (favImg) {
                if (isFavorite) {
                    favImg.src = '../../assets/images/Home%20Page/green-check.svg';
                    favImg.alt = 'Added';
                } else {
                    favImg.src = '../../assets/images/detaPlus.svg';
                    favImg.alt = 'Add';
                }
            }

            favBtn.onclick = () => {
                let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
                let isFav = favorites.some(f => f.id === movie.id);

                if (!isFav) {
                    favorites.push({
                        id: movie.id,
                        title: movie.title,
                        cover_url: movie.cover_url,
                        imdb: movie.imdb,
                        category: movie.category?.name || '',
                        overview: movie.overview || ''
                    });
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    if (favImg) { favImg.src = '../../assets/images/Home%20Page/green-check.svg'; favImg.alt = 'Added'; }
                } else {
                    favorites = favorites.filter(f => f.id !== movie.id);
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    if (favImg) { favImg.src = '../../assets/images/detaPlus.svg'; favImg.alt = 'Add'; }
                }
            };
        }

        // Video modal
        const videoModal = document.getElementById("videoModal");
        const videoFrame = document.getElementById("videoFrame");
        const videoTitle = document.getElementById("videoTitle");
        const playBtn = document.getElementById("playBtn");
        const closeBtn = document.querySelector(".video-modal .close");

        function getYouTubeEmbedUrl(url) {
            if (!url) return '';
            if (url.includes('youtube.com/embed/')) return url;
            const match = url.match(/[?&]v=([\w-]{11})/);
            if (match) return `https://www.youtube.com/embed/${match[1]}`;
            const short = url.match(/youtu\.be\/([\w-]{11})/);
            if (short) return `https://www.youtube.com/embed/${short[1]}`;
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
        if (playBtn && videoFrame) {
            playBtn.onclick = () => {
                videoFrame.src = trailerUrl + "?autoplay=1";
                playBtn.style.display = 'none';
            };
        }
        if (closeBtn && videoModal && videoFrame) {
            closeBtn.onclick = () => {
                videoFrame.src = '';
                videoModal.style.display = "none";
                playBtn.style.display = '';
            };
        }
        if (videoModal && videoFrame) {
            videoModal.addEventListener("click", e => {
                if (e.target === videoModal) {
                    videoFrame.src = '';
                    videoModal.style.display = "none";
                    playBtn.style.display = '';
                }
            });
        }

        // Info fields
        const infoItems = document.querySelectorAll('.details__info .info-item .info-value');
        if (infoItems[5]) infoItems[5].textContent = movie.run_time_min ? `${movie.run_time_min} min` : '-';
        if (infoItems[0]) infoItems[0].parentElement.style.display = 'none';
        if (infoItems[1]) infoItems[1].parentElement.style.display = 'none';
        if (infoItems[2]) infoItems[2].parentElement.style.display = 'none';
        if (infoItems[3]) infoItems[3].parentElement.style.display = 'none';
        if (infoItems[4]) infoItems[4].parentElement.style.display = 'none';
        if (infoItems[6]) infoItems[6].parentElement.style.display = 'none';

        // Cast
        const castContainer = document.querySelector('.details-actor');
        if (castContainer) castContainer.innerHTML = '<div style="color:#ccc;">No cast information available.</div>';

    } catch (err) {
        console.error(err);
        alert("Movie data could not be loaded.");
    }
}

// --- PAGE LOAD ---
if (movieId) {
    fetchAndRenderMovie();
    loadLocalComments(); // localStorage-dan əvvəlcə yüklə
    fetchComments();     // backend-dən sync et
} else {
    alert("No movie ID provided in URL.");
}