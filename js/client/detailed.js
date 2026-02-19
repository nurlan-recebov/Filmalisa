const sendBtn = document.querySelector('.comment-btn');
const commentInput = document.querySelector('.comment-input');
const commentsList = document.getElementById('commentsList');

function getRelativeDate(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const inputDate = new Date(date);

    if (inputDate.toDateString() === today.toDateString()) {
        return "Today";
    }

    if (inputDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return inputDate.toLocaleDateString();
}

sendBtn.addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (!commentText) return;

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const relativeDate = getRelativeDate(now);

    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');

    commentItem.innerHTML = `
        <div class="comment-left">
            <img src="../../assets/images/profilePhote.svg" alt="Profile">
            <div class="user-info">
                <div class="user-name">Asaf Safarli</div>
                <div class="comment-text">${commentText}</div>
            </div>
        </div>
        <div class="comment-time">
            ${time} ${relativeDate}
        </div>
    `;

    commentsList.appendChild(commentItem);
    commentInput.value = '';
});


// details modal
// Elementləri seçirik
const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const videoTitle = document.getElementById("videoTitle");
const playBtn = document.getElementById("playBtn");
const closeBtn = document.querySelector(".video-modal .close");

// Sənin details__image şəkilini seç
const posterImg = document.querySelector(".details__image img");

// YouTube link və film adı
const youtubeLink = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // buraya videonun linki
const filmName = "Have You Seen Our Robot?";

// Şəkilə klikləyəndə modal aç
posterImg.addEventListener("click", () => {
    videoModal.style.display = "flex";
    videoTitle.textContent = filmName;
    videoFrame.src = ""; // ilkin boş
});

// Play düyməsinə klikləyəndə video açılır
playBtn.addEventListener("click", () => {
    videoFrame.src = youtubeLink + "?autoplay=1";
});

// Close düyməsi
closeBtn.addEventListener("click", () => {
    videoFrame.src = "";
    videoModal.style.display = "none";
});

// Modalın boş yerinə kliklə bağla
videoModal.addEventListener("click", (e) => {
    if (e.target === videoModal) {
        videoFrame.src = "";
        videoModal.style.display = "none";
    }
});
