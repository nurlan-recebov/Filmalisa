const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/contacts";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/contact";

const token = localStorage.getItem("token");
const tableBody = document.querySelector("tbody");
const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageNumbers = document.querySelector(".page-numbers");
const loader = document.getElementById("loader");

const modal = document.getElementById("modal");
const overlay = document.querySelector(".overlay");
const reasonTextP = document.getElementById("fullReasonText");

let contacts = [];
let currentPage = 1;
const rowsPerPage = 10; 


const toggleLoader = (show) => {
  if (!loader) return;
  show ? loader.classList.remove("loader-hidden") : setTimeout(() => loader.classList.add("loader-hidden"), 500);
};

async function getContacts() {
  toggleLoader(true);
  try {
    const res = await fetch(GET_API, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Məlumatları gətirmək mümkün olmadı");

    const result = await res.json();
    contacts = result.data;

    displayContacts();
    renderPagination();
  } catch (error) {
    console.error("GET Error:", error);
    if (typeof showToast === "function") showToast("error", "Məlumatlar yüklənmədi!");
  } finally {
    toggleLoader(false);
  }
}

// ================= DISPLAY CONTACTS =================
function displayContacts() {
    tableBody.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedContacts = contacts.slice(start, start + rowsPerPage);

    paginatedContacts.forEach((contact) => {
        const isLong = contact.reason?.length > 40;
        const reasonContent = isLong 
            ? `${contact.reason.substring(0, 40)}... <i class="fa-solid fa-circle-info show-reason" style="cursor:pointer; color:#3498db;" data-fulltext="${contact.reason}"></i>`
            : (contact.reason || "-");

        const tr = document.createElement("tr"); 
        tr.innerHTML = `
            <td>${contact.id}</td>
            <td>${contact.full_name}</td>
            <td>${contact.email}</td>
            <td>${reasonContent}</td>
            <td>
                <button class="delete-btn" data-id="${contact.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// ================= MODAL LOGIC =================
tableBody.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".delete-btn");
    if (delBtn) return deleteContact(delBtn.dataset.id);

    const infoIcon = e.target.closest(".show-reason");
    if (infoIcon) {
        reasonTextP.textContent = infoIcon.dataset.fulltext;
        modal.style.display = "block";
        overlay.style.display = "flex"; 
    }
});

const closeModal = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
};

document.querySelector(".close-modal-btn").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
});

function renderPagination() {
  pageNumbers.innerHTML = "";
  const totalPages = Math.ceil(contacts.length / rowsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => { currentPage = i; displayContacts(); renderPagination(); };
    pageNumbers.appendChild(btn);
  }
}

prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; displayContacts(); renderPagination(); } };
nextBtn.onclick = () => { if (currentPage < Math.ceil(contacts.length / rowsPerPage)) { currentPage++; displayContacts(); renderPagination(); } };

async function deleteContact(id) {
  if (!confirm("Bu kontaktı silmək istədiyinizə əminsiniz?")) return;

  toggleLoader(true);

  try {
    const res = await fetch(`${ADMIN_API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Delete failed");

  if (typeof showToast === "function") showToast("success", "Kontakt silindi");
    getContacts();

  } catch (error) {
    if (typeof showToast === "function") showToast("error", "Xəta baş verdi!");
  } finally {
    toggleLoader(false);
  }
}


getContacts();
