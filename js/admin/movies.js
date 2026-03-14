const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie";
const CATEGORY_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories";
const ACTOR_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";

const modal_poster = document.querySelector(".modal-poster img");
const tableBody = document.querySelector(".main-table tbody");
const form = document.querySelector(".modal-form");
const modal = document.getElementById("createModal");
const addBtn = document.querySelector(".add-btn");

const categorySelect = document.querySelector("select[name='category']");
const actorSelect = document.querySelector("select[name='actors']");
const coverInput = form.cover_url;

const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageNumbers = document.querySelector(".page-numbers");

const loader = document.getElementById("loader");

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

let editId = null;
let deleteId = null;
let actorChoices = null;
const token = localStorage.getItem("token");

let currentPage = 1;
let moviesPerPage = 5;
let allMovies = [];

// ================= LOADER =================
function showLoader() { loader.style.display = "flex"; }
function hideLoader() { loader.style.display = "none"; }

// ================= MODAL =================
addBtn.onclick = () => modal.style.display = "flex";

modal.onclick = (e) => { if (e.target === modal) closeModal(); };

function closeModal() {
  modal.style.display = "none";
  form.reset();
  modal_poster.src = "";
  editId = null;
  if (actorChoices) actorChoices.removeActiveItems();
}

// ================= POSTER PREVIEW =================
coverInput.addEventListener("input", () => {
  const url = coverInput.value.trim();
  modal_poster.src = url || "https://tv-static-cdn.tvplus.com.tr/webtv/new-design/posters/dashboard/film-izle-header-mobile.webp";
});

modal_poster.onerror = () => {
  modal_poster.src = "https://tv-static-cdn.tvplus.com.tr/webtv/new-design/posters/dashboard/film-izle-header-mobile.webp";
};

// ================= CATEGORIES =================
async function getCategories() {
  try {
    showLoader();
    const res = await fetch(CATEGORY_API, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    categorySelect.innerHTML = "";
    result.data.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) { console.log(err); } 
  finally { hideLoader(); }
}

// ================= ACTORS =================
async function getActors() {
  try {
    showLoader();
    const res = await fetch(ACTOR_API, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    actorSelect.innerHTML = "";
    result.data.forEach(actor => {
      const option = document.createElement("option");
      option.value = actor.id;
      option.textContent = actor.name + " " + actor.surname;
      actorSelect.appendChild(option);
    });
    actorChoices = new Choices(actorSelect, {
      removeItemButton: true,
      searchEnabled: true,
      placeholder: true,
      placeholderValue: "Actors seçin",
      itemSelectText: ""
    });
  } catch (err) { console.log(err); } 
  finally { hideLoader(); }
}

// ================= MOVIES =================
async function getMovies() {
  try {
    showLoader();
    const res = await fetch(GET_API, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    allMovies = result.data;
    renderMovies();
    renderPagination();
  } catch (err) { console.log(err); } 
  finally { hideLoader(); }
}

function renderMovies() {
  tableBody.innerHTML = "";
  const start = (currentPage - 1) * moviesPerPage;
  const end = start + moviesPerPage;
  const paginatedMovies = allMovies.slice(start, end);

  paginatedMovies.forEach(movie => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${movie.id}</td>
      <td><img src="${movie.cover_url}" width="60"/></td>
      <td>${movie.title}</td>
      <td>${movie.run_time_min}</td>
      <td>${movie.imdb}</td>
      <td>
        <button class="edit-btn icon-btn" onclick="editMovie(${movie.id})">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete-btn icon-btn" onclick="deleteMovie(${movie.id})">
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
  const totalPages = Math.ceil(allMovies.length / moviesPerPage);
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
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderMovies();
      renderPagination();
    };
    pageNumbers.appendChild(btn);
  }
}

prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderMovies(); renderPagination(); } };
nextBtn.onclick = () => { const totalPages = Math.ceil(allMovies.length / moviesPerPage); if (currentPage < totalPages) { currentPage++; renderMovies(); renderPagination(); } };

// ================= FORM SUBMIT =================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selectedActors = Array.from(actorSelect.selectedOptions).map(opt => Number(opt.value));
  const movie = {
    title: form.title.value,
    cover_url: form.cover_url.value,
    fragman: form.fragman.value,
    watch_url: form.watch_url.value,
    adult: form.adult.checked,
    run_time_min: Number(form.run_time_min.value),
    imdb: form.imdb.value,
    category: Number(form.category.value),
    actors: selectedActors,
    overview: form.overview.value
  };
  const url = editId ? `${ADMIN_API}/${editId}` : ADMIN_API;
  const method = editId ? "PUT" : "POST";

  try {
    showLoader();
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(movie)
    });
    if (!res.ok) return;
    closeModal();
    currentPage = 1;
    getMovies();
  } catch (err) { console.log(err); } 
  finally { hideLoader(); }
});

// ================= DELETE =================
function deleteMovie(id) {
  deleteId = id;
  deleteModal.style.display = "flex";
}
cancelDeleteBtn.onclick = () => { deleteModal.style.display = "none"; deleteId = null; };
deleteModal.onclick = (e) => { if (e.target === deleteModal) { deleteModal.style.display = "none"; deleteId = null; } };
confirmDeleteBtn.onclick = async () => {
  if (!deleteId) return;
  try {
    showLoader();
    await fetch(`${ADMIN_API}/${deleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    deleteModal.style.display = "none";
    deleteId = null;
    currentPage = 1;
    getMovies();
  } catch (err) { console.log(err); } 
  finally { hideLoader(); }
};

// ================= EDIT =================
async function editMovie(id) {
  try {
    showLoader();
    const res = await fetch(`${GET_API}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const result = await res.json();
    const movie = result.data;

    form.title.value = movie.title;
    form.cover_url.value = movie.cover_url;
    form.fragman.value = movie.fragman;
    form.watch_url.value = movie.watch_url;
    form.adult.checked = movie.adult;
    form.run_time_min.value = movie.run_time_min;
    form.imdb.value = movie.imdb;
    form.overview.value = movie.overview;
    form.category.value = movie.category?.id || movie.category;

    const actorIds = movie.actors ? movie.actors.map(a => a.id || a) : [];
    actorChoices.removeActiveItems();
    actorIds.forEach(id => actorChoices.setChoiceByValue(String(id)));

    modal_poster.src = movie.cover_url;
    editId = id;
    modal.style.display = "flex";
  } catch (err) { console.log(err); } 
  finally { hideLoader(); }
}

// ================= INIT =================
getMovies();
getCategories();
getActors();