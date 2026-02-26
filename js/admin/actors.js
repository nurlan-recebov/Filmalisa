const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";
const API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actor";

const tableBody = document.querySelector("tbody");
const overlay = document.querySelector(".overlay");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");
const submitBtn = document.querySelector(".submit-btn");

const nameInput = document.getElementById("actorName");
const surnameInput = document.getElementById("actorSurname");
const imageInput = document.getElementById("actorImage");

const pageNumbers = document.querySelector(".page-numbers");
const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");

const token = localStorage.getItem("token");


let actors = [];
let editId = null;

let currentPage = 1;
const rowsPerPage = 5;



// ================= GET ACTORS =================
async function getActors() {
  const res = await fetch(GET_API, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  actors = data.data;

  displayActors();
  setupPagination();
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
  overlay.style.display = "flex";

  nameInput.value = "";
  surnameInput.value = "";
  imageInput.value = "";

  editId = null;
};



// ================= CLOSE MODAL =================
closeBtn.onclick = () => {
  overlay.style.display = "none";
};



// ================= SUBMIT =================
submitBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const img_url = imageInput.value.trim();

  if (!name || !surname || !img_url) {
    alert("Bütün xanaları doldur");
    return;
  }

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

  overlay.style.display = "none";
  getActors();
};



// ================= EDIT =================
function editActor(id) {
  const actor = actors.find(a => a.id === id);

  editId = id;

  nameInput.value = actor.name;
  surnameInput.value = actor.surname;
  imageInput.value = actor.img_url;

  overlay.style.display = "flex";
}



// ================= DELETE =================
async function deleteActor(id) {
  const confirmDelete = confirm("Actor silinsin?");
  if (!confirmDelete) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  getActors();
}