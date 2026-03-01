const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/users";

const tableBody = document.querySelector("tbody");
const pageNumbers = document.querySelector(".page-numbers");
const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const loader = document.getElementById("loader");

const token = localStorage.getItem("token");

let users = [];
let currentPage = 1;
const rowsPerPage = 10;

if (!token) {
  window.location.href = "login.html";
}

async function getUsers() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("loader-hidden");
  try {
    const res = await fetch(GET_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    users = result.data || [];

    displayUsers();
    createPagination();
  } catch (error) {
    console.log("Xəta baş verdi:", error);
    showToast('error', error.message || 'Serverlə əlaqə kəsildi');
  } finally {
    if (loader) {
      setTimeout(() => {
        loader.classList.add("loader-hidden");
      }, 500);
    }
  }
}

function displayUsers() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedUsers = users.slice(start, end);

  paginatedUsers.forEach((user) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.full_name}</td>
      <td>${user.email}</td>
    `;

    tableBody.appendChild(tr);
  });
}

function createPagination() {
  pageNumbers.innerHTML = "";
  const pageCount = Math.ceil(users.length / rowsPerPage);
  
  const maxVisibleButtons = 4; 
  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = Math.min(pageCount, startPage + maxVisibleButtons - 1);

  if (endPage - startPage + 1 < maxVisibleButtons) {
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      displayUsers();
      createPagination();
    });

    pageNumbers.appendChild(btn);
  }

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === pageCount;
}

nextBtn.addEventListener("click", () => {
  const pageCount = Math.ceil(users.length / rowsPerPage);

  if (currentPage < pageCount) {
    currentPage++;
    displayUsers();
    createPagination();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayUsers();
    createPagination();
  }
});

getUsers();
