const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";
const API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor";

const tableBody = document.querySelector("tbody");
const overlay = document.getElementById("actorOverlay");
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

let actors = [];
let editId = null;

let currentPage = 1;
const rowsPerPage = 10;

// ================= LOADER TOGGLE =================
const toggleLoader = (show) => {
  if (!loader) return;
  show
    ? loader.classList.remove("loader-hidden")
    : setTimeout(() => loader.classList.add("loader-hidden"), 500);
};

// ================= GET ACTORS =================
async function getActors() {
  toggleLoader(true);
  try {
    const res = await fetch(GET_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    actors = data.data;
    displayActors();
    setupPagination();
  } catch (error) {
    showToast("error", "Məlumatlar yüklənmədi!");
  } finally {
    toggleLoader(false);
  }
}

// ================= DISPLAY ACTORS =================
function displayActors() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const paginatedActors = actors.slice(start, start + rowsPerPage);

  paginatedActors.forEach((actor) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${actor.id}</td>
    <td>
    <div style="display:flex; align-items:center; gap:10px;">
    <img src="${actor.img_url}" 
    style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
          ${actor.name} ${actor.surname}
        </div>
      </td>
      <td>
      <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </td>
      `;

    tr.querySelector(".delete-btn").onclick = () => deleteActor(actor.id);

    tableBody.appendChild(tr);
  });
}

// ================= PAGINATION =================
function setupPagination() {
  pageNumbers.innerHTML = "";
  const pageCount = Math.ceil(actors.length / rowsPerPage);

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(pageCount, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      displayActors();
      setupPagination();
    });

    pageNumbers.appendChild(btn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === pageCount || pageCount === 0;
}

prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    displayActors();
    setupPagination();
  }
};

nextBtn.onclick = () => {
  if (currentPage < Math.ceil(actors.length / rowsPerPage)) {
    currentPage++;
    displayActors();
    setupPagination();
  }
};

// ================= OPEN MODAL =================
openBtn.onclick = () => {
    editId = null;
    nameInput.value = "";
    surnameInput.value = "";
    imageInput.value = "";
    document.querySelector(".modal-title").innerText = "Add Actor";
    overlay.style.display = "flex"; 
};

closeBtn.onclick = () => {
    overlay.style.display = "none";
};

// ================= SUBMIT =================
submitBtn.onclick = async () => {
const payload = {
    name: nameInput.value.trim(),
    surname: surnameInput.value.trim(),
    img_url: imageInput.value.trim() 
};

if (!payload.name || !payload.surname || !payload.img_url) {
    return showToast("error", "Bütün xanaları doldurun!");
  }

  toggleLoader(true);
  const url = editId ? `${API}/${editId}` : API;
  const method = editId ? "PUT" : "POST";

  try {
const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error();
    showToast("success", editId ? "Yeniləndi!" : "Əlavə edildi!");
    overlay.style.display = "none";
    getActors();
  } catch (error) {
    console.error(error);
    showToast("error", "Xəta baş verdi!");
  } finally {
    toggleLoader(false);
  }
};

// ================= DELETE =================
async function deleteActor(id) {
  if (!confirm("Actor silinsin?")) return;
  toggleLoader(true);

  try {
   const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
if (!res.ok) throw new Error();
    showToast("success", "Silindi!");
    getActors();
  } catch (error) {
    showToast("error", "Silinmə zamanı xəta!");
  } finally {
    toggleLoader(false);
  }
}
getActors();
