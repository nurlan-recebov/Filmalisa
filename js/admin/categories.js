const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/category";

const tableBody = document.querySelector("tbody");
const input = document.querySelector(".input-field");
const submitBtn = document.querySelector(".submit-btn");

const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");

const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageNumbers = document.querySelector(".page-numbers");

const loader = document.getElementById("loader");

let editId = null;
const token = localStorage.getItem("token");

let currentPage = 1;
let itemsPerPage = 5;
let allCategories = [];


// ================= LOADER =================
function showLoader() {
  loader.style.display = "flex";
}

function hideLoader() {
  loader.style.display = "none";
}


// ================= MODAL =================
openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});


// ================= GET CATEGORIES =================
async function getCategories() {
  try {
    showLoader();

    const res = await fetch(GET_API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    allCategories = data.data;

    renderCategories();
    renderPagination();

  } catch (err) {
    console.log("Category error:", err);
  } finally {
    hideLoader();
  }
}

getCategories();


// ================= RENDER TABLE =================
function renderCategories() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedItems = allCategories.slice(start, end);

  paginatedItems.forEach(category => {
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


// ================= PAGINATION =================
function renderPagination() {
  pageNumbers.innerHTML = "";

  const totalPages = Math.ceil(allCategories.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) {
      btn.classList.add("active-page");
    }

    btn.onclick = () => {
      currentPage = i;
      renderCategories();
      renderPagination();
    };

    pageNumbers.appendChild(btn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}


// ================= PREV / NEXT =================
prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderCategories();
    renderPagination();
  }
};

nextBtn.onclick = () => {
  const totalPages = Math.ceil(allCategories.length / itemsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderCategories();
    renderPagination();
  }
};


// ================= CREATE / EDIT =================
submitBtn.addEventListener("click", async () => {
  const name = input.value.trim();
  if (!name) return;

  try {
    showLoader();

    if (editId) {
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

    currentPage = 1;
    getCategories();

  } catch (err) {
    console.log("Submit error:", err);
  } finally {
    hideLoader();
  }
});


// ================= DELETE =================
async function deleteCategory(id) {
  const confirmDelete = confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?");
  if (!confirmDelete) return;

  try {
    showLoader();

    await fetch(`${ADMIN_API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    currentPage = 1;
    getCategories();

  } catch (err) {
    console.log("Delete error:", err);
  } finally {
    hideLoader();
  }
}


// ================= EDIT =================
function editCategory(id, name) {
  editId = id;
  input.value = name;
  modal.style.display = "flex";
}