// Modern toast for favorite actions with color and icon
function showToast(message, type) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-message' + (type === 'removed' ? ' removed' : '');
    // Icon
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.innerHTML = type === 'removed'
        ? '<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#ff5858"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#43e97b"/><path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';
    toast.appendChild(icon);
    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2600);
}
const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
const ADMIN_COMMENT_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments";
const TOKEN = localStorage.getItem("userToken");

if (!TOKEN) window.location.href = "login.html";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

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
    const defaultPhotoUrl = '../../assets/images/profilePhote.svg';
    if (!comments || comments.length === 0) {
        commentsList.innerHTML = "<p>No comments yet.</p>";
        return;
    }
    comments.forEach((comment) => {
        const photoSrc = comment.userPhotoUrl || defaultPhotoUrl;
        const userName = comment.user_name || comment.user?.full_name || "User";
        const div = document.createElement("div");
        div.classList.add("comment-item");
        div.innerHTML = `
            <div class="comment-left">
                <img src="${photoSrc}" alt="Profile">
                <div class="user-info">
                    <div class="user-name">${userName}</div>
                    <div class="comment-text">${comment.text || comment.comment}</div>
                </div>
            </div>
            <div class="comment-time">${getRelativeDate(comment.created_at || new Date())}</div>
        `;
        commentsList.appendChild(div);
    });
}

function loadLocalComments() {
    const storedComments = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
    renderComments(storedComments);
}

async function fetchComments() {
    try {
        const res = await fetch(ADMIN_COMMENT_API, {
            headers: { Authorization: `Bearer ${TOKEN}` },
        });
        const data = await res.json();

        const movieComments = (data.data || []).filter(c => c.movie?.id == movieId);

        localStorage.setItem(`comments_${movieId}`, JSON.stringify(movieComments));
        renderComments(movieComments);
    } catch (err) {
        console.log("Fetch comments error:", err);
    }
}

async function postComment(text) {
    if (!text) return;

    const newComment = {
        user_name: "You",
        text,
        created_at: new Date().toISOString(),
    };

    let storedComments = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
    storedComments.unshift(newComment);
    localStorage.setItem(`comments_${movieId}`, JSON.stringify(storedComments));

    renderComments(storedComments);

    try {
        await fetch(`${API_URL}/${movieId}/comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({ comment: text }),
        });
    } catch (err) {
        console.log("Comment post error:", err);
    }
}

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

async function fetchAndRenderMovie() {
    try {
        const res = await fetch(`${API_URL}/${movieId}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
        const data = await res.json();
        if (!data.result) throw new Error("API Error");

        const movie = data.data;
        if (!movie) throw new Error("Movie not found");

        const bgImg = document.querySelector(".background-image");
        if (bgImg && (movie.background_url || movie.cover_url)) {
            bgImg.src = movie.background_url || movie.cover_url;
            bgImg.onerror = () => { bgImg.src = '../../assets/images/photo.jpg'; };
        }

        const nameEl = document.querySelector(".overlay-text .name");
        if (nameEl && movie.title) nameEl.textContent = movie.title;
        const titleEl = document.querySelector(".overlay-text .title");
        if (titleEl && movie.title) titleEl.textContent = movie.title;
        const categoryEl = document.querySelector(".overlay-text .category");
        if (categoryEl && movie.category?.name) categoryEl.textContent = movie.category.name;

        const posterImg = document.querySelector("#moviePosterDiv img");
        if (posterImg && movie.cover_url) {
            posterImg.src = movie.cover_url;
            posterImg.onerror = () => { posterImg.src = '../../assets/images/detaPhoto.svg'; };
        }

        const descriptionEl = document.querySelector(".details__description");
        if (descriptionEl && movie.overview) descriptionEl.textContent = movie.overview;

        const ratingBtn = document.querySelector(".btn-rating");
        if (ratingBtn && movie.imdb) ratingBtn.innerHTML = `<img src="../../assets/images/ratingBtn.svg" alt="Rating">${movie.imdb}`;

        const watchBtn = document.querySelector(".details__actions .btn-primary");
        if (watchBtn && movie.watch_url) watchBtn.onclick = () => {
            window.open(movie.watch_url, "_blank");
        };

        const favBtn = document.querySelector(".details__actions .btn-icon");

        if (favBtn) {
            const favImg = favBtn.querySelector("img");

            async function checkIfFavorite() {
                try {
                    const res = await fetch(
                        "https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites",
                        { headers: { Authorization: `Bearer ${TOKEN}` } }
                    );

                    const data = await res.json();
                    const favorites = data.data || [];
                    const isFavorite = favorites.some(f => f.id == movie.id);

                    if (favImg) {
                        if (isFavorite) {
                            favImg.src = '../../assets/images/Home%20Page/green-check.svg';
                            favImg.alt = 'Added';
                        } else {
                            favImg.src = '../../assets/images/detaPlus.svg';
                            favImg.alt = 'Add';
                        }
                    }
                } catch (err) {
                    console.log("Favorite check error:", err);
                }
            }

            await checkIfFavorite();

            favBtn.onclick = async () => {
                try {
                    // Check current favorite status before toggling
                    let wasFavorite = false;
                    try {
                        const res = await fetch(
                            "https://api.sarkhanrahimli.dev/api/filmalisa/movies/favorites",
                            { headers: { Authorization: `Bearer ${TOKEN}` } }
                        );
                        const data = await res.json();
                        const favorites = data.data || [];
                        wasFavorite = favorites.some(f => f.id == movie.id);
                    } catch (err) {
                        // ignore, fallback to default
                    }

                    await fetch(
                        `https://api.sarkhanrahimli.dev/api/filmalisa/movie/${movie.id}/favorite`,
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${TOKEN}`,
                            },
                        }
                    );

                    // Show toast/message in English
                    const msg = wasFavorite ? 'Removed from favorites' : 'Added to favorites';
                    const type = wasFavorite ? 'removed' : 'added';
                    if (typeof showToast === 'function') {
                        showToast(msg, type);
                    } else {
                        alert(msg);
                    }

                    await checkIfFavorite();

                } catch (err) {
                    console.log("Favorite toggle error:", err);
                }
            };
        }

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
        if (infoItems[5] && movie.run_time_min) infoItems[5].textContent = `${movie.run_time_min} min`;
        // infoItems[0] - Type
        if (infoItems[0] && movie.type) infoItems[0].textContent = movie.type;
        // infoItems[1] - Status
        if (infoItems[1] && movie.status) infoItems[1].textContent = movie.status;
        // infoItems[2] - No. of episodes
        if (infoItems[2] && movie.episode_count) infoItems[2].textContent = movie.episode_count;
        // infoItems[3] - Date added (created_at)
        if (infoItems[3] && movie.created_at) {
            const date = new Date(movie.created_at);
            infoItems[3].textContent = date.toLocaleDateString('az-AZ');
        }
        // infoItems[4] - Added time (created_at time)
        if (infoItems[4] && movie.created_at) {
            const date = new Date(movie.created_at);
            infoItems[4].textContent = date.toLocaleTimeString('az-AZ');
        }
        // infoItems[6] - Genres
        if (infoItems[6]) {
            let genresText = '';
            if (movie.genres) {
                genresText = Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres;
            }
            if (movie.category && movie.category.name) {
                genresText = genresText ? genresText + ', ' + movie.category.name : movie.category.name;
            }
            if (genresText) infoItems[6].textContent = genresText;
        }

        const castContainer = document.querySelector('.details-actor');
        if (castContainer) {
            if (movie.actors && Array.isArray(movie.actors) && movie.actors.length > 0) {
                castContainer.innerHTML = movie.actors.map(actor => `
                        <div class="actor-item">
                            <img src="${actor.img_url || '../../assets/images/profilePhote.svg'}" alt="${actor.name}" style="width:128px;height:161px;object-fit:cover;">
                            <div class="actor-name">${actor.name} ${actor.surname ? actor.surname : ''}</div>
                        </div>
                    `).join('');
            }
        }

        // Similar movies section: set title and render by category
        if (movie.category && movie.category.id) {
            try {
                const simRes = await fetch(`${API_URL}?category=${movie.category.id}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
                const simData = await simRes.json();
                if (simData.result && Array.isArray(simData.data)) {
                    const similarMovies = simData.data.filter(m => m.id !== movie.id && m.category && m.category.id === movie.category.id);
                    const simContainer = document.querySelector('.movie-cards-container');
                    const simTitle = document.querySelector('.h4-card');
                    if (simTitle && movie.category.name) {
                        simTitle.textContent = movie.category.name;
                    }
                    if (simContainer) {
                        simContainer.innerHTML = similarMovies.length > 0 ? similarMovies.map(sim => `
                            <div class="movie-card" data-id="${sim.id}">
                                <img src="${sim.cover_url || '../../assets/images/photo.jpg'}" alt="${sim.title}" class="movie-image" />
                                <div class="movie-overlay">
                                    <div class="movie-category">${sim.category?.name || ''}</div>
                                    <div class="movie-rating">★ ${sim.imdb || ''}</div>
                                    <div class="movie-title">${sim.title}</div>
                                </div>
                            </div>
                        `).join('') : '<div style="color:#fff;padding:16px;">Bu kateqoriyada başqa film yoxdur.</div>';
                        simContainer.querySelectorAll('.movie-card').forEach(card => {
                            card.addEventListener('click', function () {
                                const id = this.getAttribute('data-id');
                                if (id) window.location.href = `detailed.html?id=${id}`;
                            });
                        });
                    }
                }
            } catch (err) {
                console.error('Similar movies fetch error:', err);
            }
        }
    } catch (err) {
        console.error(err);
        alert("Movie data could not be loaded.");
    }
}

if (movieId) {
    fetchAndRenderMovie();
    loadLocalComments();
    fetchComments();
} else {
    alert("No movie ID provided in URL.");
}