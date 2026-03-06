const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";
const API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor";

const tableBody = document.querySelector("tbody");
const modal = document.querySelector(".modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");
const submitBtn = document.querySelector(".submit-btn");

const nameInput = document.getElementById("actorName");
const surnameInput = document.getElementById("actorSurname");
const imageInput = document.getElementById("actorImage");

const pageNumbers = document.querySelector(".page-numbers");
const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");

const loader = document.getElementById("loader");
const token = localStorage.getItem("token");

// delete modal
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

let actors = [];
let editId = null;
let deleteId = null;

let currentPage = 1;
const rowsPerPage = 5;

// ================= LOADER =================
function showLoader() { loader.style.display = "flex"; }
function hideLoader() { loader.style.display = "none"; }

// ================= GET ACTORS =================
async function getActors() {
  try {
    showLoader();
    const res = await fetch(GET_API, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    actors = data.data;

    displayActors();
    setupPagination();
  } catch (error) {
    console.log("GET Actor Error:", error);
  } finally {
    hideLoader();
  }
}

getActors();

// ================= DISPLAY ACTORS =================
function displayActors() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedActors = actors.slice(start, end);

  paginatedActors.forEach(actor => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${actor.id}</td>
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${actor.img_url}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
          ${actor.name} ${actor.surname}
        </div>
      </td>
      <td>
        <button class="edit-btn icon-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn icon-btn"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;

    tr.querySelector(".edit-btn").onclick = () => editActor(actor.id);
    tr.querySelector(".delete-btn").onclick = () => openDeleteModal(actor.id);

    tableBody.appendChild(tr);
  });
}

// ================= PAGINATION =================
function setupPagination() {
  pageNumbers.innerHTML = "";
  const pageCount = Math.ceil(actors.length / rowsPerPage);
  const maxButtons = 3;

  let startPage = currentPage;
  if (currentPage === pageCount) startPage = Math.max(pageCount - 2, 1);
  if (currentPage > 1 && currentPage < pageCount) startPage = currentPage - 1;

  const endPage = Math.min(startPage + maxButtons - 1, pageCount);

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === pageCount;

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    if (i === currentPage) btn.classList.add("active"); // CSS ile aktif stil
    btn.addEventListener("click", () => {
      currentPage = i;
      displayActors();
      setupPagination();
    });
    pageNumbers.appendChild(btn);
  }
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayActors();
    setupPagination();
  }
});

nextBtn.addEventListener("click", () => {
  const pageCount = Math.ceil(actors.length / rowsPerPage);
  if (currentPage < pageCount) {
    currentPage++;
    displayActors();
    setupPagination();
  }
});

// ================= OPEN MODAL =================
openBtn.onclick = () => {
  modal.style.display = "flex";
  nameInput.value = "";
  surnameInput.value = "";
  imageInput.value = "";
  editId = null;
};

// ================= CLOSE MODAL =================
closeBtn.onclick = () => {
  modal.style.display = "none";
};

// ================= SUBMIT =================
submitBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const img_url = imageInput.value.trim();
  if (!name || !surname || !img_url) return;

  try {
    showLoader();
    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, surname, img_url })
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, surname, img_url })
      });
    }

    modal.style.display = "none";
    currentPage = 1;
    getActors();
  } catch (error) {
    console.log("Submit Actor Error:", error);
  } finally {
    hideLoader();
  }
};

// ================= EDIT =================
function editActor(id) {
  const actor = actors.find(a => a.id === id);
  if (!actor) return;

  editId = id;
  nameInput.value = actor.name;
  surnameInput.value = actor.surname;
  imageInput.value = actor.img_url;
  modal.style.display = "flex";
}

// ================= DELETE MODAL =================
function openDeleteModal(id) {
  deleteId = id;
  deleteModal.style.display = "flex";
}

// cancel
cancelDeleteBtn.onclick = () => {
  deleteModal.style.display = "none";
  deleteId = null;
};

// click outside
deleteModal.onclick = (e) => {
  if (e.target === deleteModal) {
    deleteModal.style.display = "none";
    deleteId = null;
  }
};

// confirm delete
confirmDeleteBtn.onclick = async () => {
  if (!deleteId) return;

  try {
    showLoader();
    await fetch(`${API}/${deleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    deleteModal.style.display = "none";
    deleteId = null;

    currentPage = 1;
    getActors();
  } catch (error) {
    console.log("Delete Actor Error:", error);
  } finally {
    hideLoader();
  }
};