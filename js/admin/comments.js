const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments";

const tableBody = document.querySelector("tbody");
const token = localStorage.getItem("token");

const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageNumbers = document.querySelector(".page-numbers");

const loader = document.getElementById("loader");

// delete modal
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

// ================= LOADER =================
function showLoader() { loader.style.display = "flex"; }
function hideLoader() { loader.style.display = "none"; }

// ================= PAGINATION =================
let currentPage = 1;
let itemsPerPage = 5;
let allComments = [];

let deleteMovieId = null;
let deleteCommentId = null;

// ================= GET COMMENTS =================
async function getComments() {
  try {
    showLoader();
    const res = await fetch(GET_API, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Fetch failed");
    const { data } = await res.json();
    allComments = data;
    renderComments();
    renderPagination();
  } catch (error) {
    console.log("GET Error:", error);
  } finally {
    hideLoader();
  }
}

getComments();

// ================= RENDER COMMENTS =================
function renderComments() {
  tableBody.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = allComments.slice(start, end);

  paginatedItems.forEach(comment => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${comment.id}</td>
      <td>${comment.comment}</td>
      <td>${comment.movie?.title || "-"}</td>
      <td>${comment.user?.full_name || "-"}</td>
      <td>${comment.user?.email || "-"}</td>
      <td>
        <button 
          class="delete-btn icon-btn"
          data-movieid="${comment.movie?.id}"
          data-commentid="${comment.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ================= PAGINATION =================
function renderPagination() {
  pageNumbers.innerHTML = "";

  const totalPages = Math.ceil(allComments.length / itemsPerPage);
  const maxButtons = 3;

  let startPage = currentPage;
  if (currentPage === totalPages) startPage = Math.max(totalPages - 2, 1);
  if (currentPage > 1 && currentPage < totalPages) startPage = currentPage - 1;
  const endPage = Math.min(startPage + maxButtons - 1, totalPages);

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active-page"); // CSS ile aktif stil
    btn.onclick = () => {
      currentPage = i;
      renderComments();
      renderPagination();
    };
    pageNumbers.appendChild(btn);
  }
}

// ================= PREV / NEXT =================
prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderComments();
    renderPagination();
  }
};

nextBtn.onclick = () => {
  const totalPages = Math.ceil(allComments.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderComments();
    renderPagination();
  }
};

// ================= DELETE BUTTON CLICK =================
tableBody.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;
  deleteMovieId = btn.dataset.movieid;
  deleteCommentId = btn.dataset.commentid;
  deleteModal.style.display = "flex";
});

// ================= CANCEL DELETE =================
cancelDeleteBtn.onclick = () => {
  deleteModal.style.display = "none";
  deleteMovieId = null;
  deleteCommentId = null;
};

// ================= CLICK OUTSIDE =================
deleteModal.onclick = (e) => {
  if (e.target === deleteModal) {
    deleteModal.style.display = "none";
    deleteMovieId = null;
    deleteCommentId = null;
  }
};

// ================= CONFIRM DELETE =================
confirmDeleteBtn.onclick = async () => {
  if (!deleteMovieId || !deleteCommentId) return;

  try {
    showLoader();
    const res = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${deleteMovieId}/comment/${deleteCommentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    if (!res.ok) throw new Error("Delete failed");

    deleteModal.style.display = "none";
    deleteMovieId = null;
    deleteCommentId = null;
    currentPage = 1;
    getComments();
  } catch (error) {
    console.log("DELETE Error:", error);
  } finally {
    hideLoader();
  }
};