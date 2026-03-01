const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/category";

const tableBody = document.querySelector("tbody");
const input = document.querySelector(".input-field");
const submitBtn = document.querySelector(".submit-btn");
const loader = document.getElementById("loader");

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
  if (loader) loader.classList.remove("loader-hidden");

  try {
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
        <button onclick="editCategory(${category.id}, '${category.name}')"><i class="fa-solid fa-pencil"></i></button>
        <button onclick="deleteCategory(${category.id})"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;

      tableBody.appendChild(tr);
    })
  } catch (error) {
    showToast('error', 'Kateqoriyaları yükləmək mümkün olmadı');
  }
  finally {
    if (loader) {
      setTimeout(() => {
        loader.classList.add("loader-hidden");
      }, 800);
    }
  }
}

getCategories();


// CREATE / EDIT
submitBtn.addEventListener("click", async () => {
  if (loader && !loader.classList.contains("loader-hidden")) return;

  const name = input.value.trim();
  if (!name) {
    showToast('error', 'Ad boş ola bilməz');
    return;
  }

  if (loader) loader.classList.remove("loader-hidden");

  try {
    let res; // Cavabı yadda saxlamaq üçün dəyişən
    if (editId) {
      res = await fetch(`${ADMIN_API}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
    } else {
      res = await fetch(ADMIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
    }

    if (res.ok) {
      showToast('success', editId ? 'Kateqoriya yeniləndi' : 'Kateqoriya yaradıldı');
      input.value = "";
      modal.style.display = "none";
      editId = null;
      getCategories();
    } else {
      throw new Error("Server xətası baş verdi");
    }
  } catch (error) {
    showToast('error', error.message);
  } finally {
    if (loader) loader.classList.add("loader-hidden");
  }
});


// DELETE
async function deleteCategory(id) {
  const confirmDelete = confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?");
  if (!confirmDelete) return;

  if (loader) loader.classList.remove("loader-hidden");

  try {
    // BURADA 'const res' MÜTLƏQDİR!
    const res = await fetch(`${ADMIN_API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      showToast('success', 'Kateqoriya silindi');
      getCategories();
    } else {
      // Əgər server 200 OK qaytarmasa, xəta atırıq
      throw new Error("Silmək mümkün olmadı");
    }
  } catch (error) {
    console.log("Delete error:", error);
    showToast('error', error.message || "Xəta baş verdi");
  } finally {
    if (loader) loader.classList.add("loader-hidden");
  }
}

// EDIT
function editCategory(id, name) {
  editId = id;
  input.value = name;
  modal.style.display = "flex";
}

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    submitBtn.click();
  }
});

window.editCategory = editCategory;
window.deleteCategory = deleteCategory;