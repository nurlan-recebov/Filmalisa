const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/contacts";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/contact";

const token = localStorage.getItem("token");
const tableBody = document.querySelector("tbody");

const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageNumbers = document.querySelector(".page-numbers");

let contacts = [];
let currentPage = 1;
const rowsPerPage = 5; // bir səhifədə neçə contact görünsün

if (!token) {
  window.location.href = "login.html";
}

async function getContacts() {
  const res = await fetch(GET_API, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const result = await res.json();
  contacts = result.data;

  displayContacts();
  renderPagination();
}

function displayContacts() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedContacts = contacts.slice(start, end);

  paginatedContacts.forEach((contact) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${contact.id}</td>
      <td>${contact.full_name}</td>
      <td>${contact.email}</td>
      <td>${contact.reason}</td>
      <td>
        <button onclick="deleteContact(${contact.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function renderPagination() {
  pageNumbers.innerHTML = "";
  const totalPages = Math.ceil(contacts.length / rowsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      displayContacts();
      renderPagination();
    });

    pageNumbers.appendChild(btn);
  }
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayContacts();
    renderPagination();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(contacts.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayContacts();
    renderPagination();
  }
});

async function deleteContact(id) {
  const confirmDelete = confirm("Bu contacti silmək istədiyinizə əminsiniz?");
  if (!confirmDelete) return;

  await fetch(`${ADMIN_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  alert("Contact silindi");
  getContacts();
}

getContacts();