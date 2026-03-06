const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/contacts";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/contact";

const token = localStorage.getItem("token");
const tableBody = document.querySelector("tbody");

const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageNumbers = document.querySelector(".page-numbers");

const loader = document.getElementById("loader");

// delete modal
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

let contacts = [];
let currentPage = 1;
const rowsPerPage = 5;

let deleteId = null;


// ================= LOADER =================
function showLoader() {
  loader.style.display = "flex";
}

function hideLoader() {
  loader.style.display = "none";
}


// ================= GET CONTACTS =================
async function getContacts() {

  try {

    showLoader();

    const res = await fetch(GET_API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Fetch failed");

    const result = await res.json();

    contacts = result.data;

    displayContacts();
    renderPagination();

  } catch (error) {

    console.error(error);
    alert("Məlumatlar yüklənə bilmədi");

  } finally {

    hideLoader();

  }

}


// ================= DISPLAY =================
function displayContacts() {

  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const paginatedContacts = contacts.slice(start, end);

  paginatedContacts.forEach((contact) => {

    const fullReason = contact.reason || "";

    const shortReason =
      fullReason.length > 30 ? fullReason.slice(0, 30) + "..." : fullReason;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${contact.id}</td>
      <td>${contact.full_name}</td>
      <td>${contact.email}</td>

      <td>
        <span class="reason-text">${shortReason}</span>

        ${
          fullReason.length > 30
            ? `<button class="read-more-btn"
                 data-full="${fullReason}"
                 data-short="${shortReason}">
                 Read more
               </button>`
            : ""
        }

      </td>

      <td>

        <button class="delete-btn icon-btn" onclick="deleteContact(${contact.id})">
          <i class="fa-solid fa-trash"></i>
        </button>

      </td>
    `;

    tableBody.appendChild(tr);

  });

}


// ================= READ MORE =================
document.addEventListener("click", function (e) {

  if (e.target.classList.contains("read-more-btn")) {

    const btn = e.target;
    const text = btn.previousElementSibling;

    if (btn.textContent.trim() === "Read more") {

      text.textContent = btn.dataset.full;
      btn.textContent = "Show less";

    } else {

      text.textContent = btn.dataset.short;
      btn.textContent = "Read more";

    }

  }

});


// ================= PAGINATION =================
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


// prev
prevBtn.addEventListener("click", () => {

  if (currentPage > 1) {

    currentPage--;

    displayContacts();
    renderPagination();

  }

});


// next
nextBtn.addEventListener("click", () => {

  const totalPages = Math.ceil(contacts.length / rowsPerPage);

  if (currentPage < totalPages) {

    currentPage++;

    displayContacts();
    renderPagination();

  }

});


// ================= DELETE MODAL =================
function deleteContact(id) {

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

    await fetch(`${ADMIN_API}/${deleteId}`, {

      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`
      }

    });

    deleteModal.style.display = "none";

    deleteId = null;

    getContacts();

  } catch (error) {

    console.error(error);

    alert("Silinmə zamanı xəta baş verdi");

  } finally {

    hideLoader();

  }

};


// ================= INIT =================
getContacts();