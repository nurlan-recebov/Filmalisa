const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/category";

const tableBody = document.querySelector("tbody");
const input = document.querySelector(".input-field");
const submitBtn = document.querySelector(".submit-btn");

const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");

let editId = null;
const token = localStorage.getItem("token");



// Modal open
openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Modal close
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// GET categories
async function getCategories() {
  const res = await fetch(GET_API, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  tableBody.innerHTML = "";

  data.data.forEach(category => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${category.id}</td>
      <td>${category.name}</td>
      <td>
        <button onclick="editCategory(${category.id}, '${category.name}')">Edit</button>
        <button onclick="deleteCategory(${category.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

getCategories();


// CREATE / EDIT
submitBtn.addEventListener("click", async () => {
  const name = input.value.trim();
  if (!name) return;

  if (editId) {
    // EDIT
    await fetch(`${ADMIN_API}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });

    editId = null;
  } else {
    // CREATE
    await fetch(ADMIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
  }

  input.value = "";
  modal.style.display = "none";
  getCategories();
});


// DELETE
async function deleteCategory(id) {
  const confirmDelete = confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?");
  if (!confirmDelete) return;

  await fetch(`${ADMIN_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  alert("Kateqoriya silindi");
  getCategories();
}


// EDIT
function editCategory(id, name) {
  editId = id;
  input.value = name;
  modal.style.display = "flex";
}