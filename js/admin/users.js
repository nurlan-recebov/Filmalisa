const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/users";

const tableBody = document.querySelector("tbody");
const pageNumbers = document.querySelector(".page-numbers");
const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");

const loader = document.getElementById("loader");
const token = localStorage.getItem("token");

let users = [];
let currentPage = 1;
const rowsPerPage = 9;

// ================= LOADER =================
function showLoader() { loader.style.display = "flex"; }
function hideLoader() { loader.style.display = "none"; }

// ================= GİRİŞ KONTROL =================
if (!token) window.location.href = "login.html";

// ================= KULLANICILARI GETİR =================
async function getUsers() {
  try {
    showLoader();
    const res = await fetch(GET_API, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Fetch başarısız oldu");

    const result = await res.json();
    users = result.data || [];

    displayUsers();
    createPagination();
  } catch (error) {
    console.log("Kullanıcı hatası:", error);
  } finally {
    hideLoader();
  }
}

// ================= TABLOYA YAZDIR =================
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

// ================= SAYFALAMA =================
function createPagination() {
  pageNumbers.innerHTML = "";
  const pageCount = Math.ceil(users.length / rowsPerPage);
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
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      displayUsers();
      createPagination();
    });
    pageNumbers.appendChild(btn);
  }
}

// ================= ÖNCEKİ / SONRAKİ =================
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayUsers();
    createPagination();
  }
});

nextBtn.addEventListener("click", () => {
  const pageCount = Math.ceil(users.length / rowsPerPage);
  if (currentPage < pageCount) {
    currentPage++;
    displayUsers();
    createPagination();
  }
});

// ================= SAYFAYI İNİT =================
getUsers();