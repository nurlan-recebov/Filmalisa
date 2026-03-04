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

let actors = [];
let editId = null;

let currentPage = 1;
const rowsPerPage = 5;


// ================= LOADER =================
function showLoader() {
  loader.style.display = "flex";
}

function hideLoader() {
  loader.style.display = "none";
}


// ================= GET ACTORS =================
async function getActors() {
  try {
    showLoader();

    const res = await fetch(GET_API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

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
          <img src="${actor.img_url}" 
               style="width:40px;height:40px;border-radius:50%;object-fit:cover;">
          ${actor.name} ${actor.surname}
        </div>
      </td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    tr.querySelector(".edit-btn").onclick = () => editActor(actor.id);
    tr.querySelector(".delete-btn").onclick = () => deleteActor(actor.id);

    tableBody.appendChild(tr);
  });
}


// ================= PAGINATION =================
function setupPagination() {
  pageNumbers.innerHTML = "";

  const pageCount = Math.ceil(actors.length / rowsPerPage);

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) {
      btn.style.background = "black";
      btn.style.color = "white";
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      displayActors();
      setupPagination();
    });

    pageNumbers.appendChild(btn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === pageCount;
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, surname, img_url })
      });
    } else {
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
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


// ================= DELETE =================
async function deleteActor(id) {
  const confirmDelete = confirm("Actor silinsin?");
  if (!confirmDelete) return;

  try {
    showLoader();

    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    currentPage = 1;
    getActors();

  } catch (error) {
    console.log("Delete Actor Error:", error);
  } finally {
    hideLoader();
  }
}