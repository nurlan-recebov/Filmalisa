const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie";
const CATEGORY_API =
  "https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories";
const ACTOR_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";

const tableBody = document.querySelector(".main-table tbody");
const form = document.querySelector(".modal-form");
const modal = document.getElementById("createModal");
const addBtn = document.querySelector(".add-btn");
const loader = document.getElementById("loader");

const modalPosterImg = document.querySelector(".modal-poster");
const coverUrlInput = document.getElementById("coverUrl");
const DEFAULT_POSTER = "./../../assets/images/film poster.avif";

const categorySelect = document.querySelector("select[name='category']");
const actorSelect = document.querySelector("select[name='actors']");

let editId = null;
const token = localStorage.getItem("token");

// Modal aç
addBtn.onclick = () => {
  editId = null;
  form.reset();
  modal.style.display = "flex";
  modalPosterImg.src = DEFAULT_POSTER;
};

// Modal bağla
modal.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// CATEGORIES GET
async function getCategories() {
  try {
    const res = await fetch(CATEGORY_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    categorySelect.innerHTML = "";

    data.data.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    showToast("error", "Kateqoriyalar yüklənmədi");
  }
}

// ACTORS GET
async function getActors() {
  try {
    const res = await fetch(ACTOR_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    actorSelect.innerHTML = "";

    data.data.forEach((actor) => {
      const option = document.createElement("option");
      option.value = actor.id;
      option.textContent = actor.name + " " + actor.surname;
      actorSelect.appendChild(option);
    });
  } catch (error) {
    showToast("error", "Aktyorlar yüklənmədi");
  }
}

// MOVIES GET
async function getMovies() {
  loader?.classList.remove("loader-hidden");
  try {
    const res = await fetch(GET_API, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    tableBody.innerHTML = "";

    data.data.forEach((movie) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${movie.id}</td>
        <td><img src="${movie.cover_url}" width="60"/></td>
        <td>${movie.title}</td>
        <td>${movie.run_time_min}</td>
        <td>${movie.imdb}</td>
        <td>
          <button onclick="editMovie(${movie.id})"><i class="fa-solid fa-pencil"></i></button>
          <button onclick="deleteMovie(${movie.id})"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  } catch (error) {
    showToast("error", "Filmlər yüklənərkən xəta oldu");
  } finally {
    if (loader) {
      setTimeout(() => {
        loader.classList.add("loader-hidden");
      }, 500);
    }
  }
}

// FORM SUBMIT
form.addEventListener("submit", async (e) => {
  if (loader && !loader.classList.contains("loader-hidden")) return;
  e.preventDefault();

  if (loader) loader.classList.remove("loader-hidden");

  const movie = {
    title: form.title.value,
    cover_url: form.cover_url.value,
    fragman: form.fragman.value,
    watch_url: form.watch_url.value,
    adult: form.adult.checked,
    run_time_min: Number(form.run_time_min.value),
    imdb: form.imdb.value,
    category: Number(form.category.value),
    actors: [Number(form.actors.value)],
    overview: form.overview.value,
  };

  try {
    let res;
    if (editId) {
      res = await fetch(`${ADMIN_API}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      });
    } else {
      res = await fetch(ADMIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movie),
      });
    }
    if (res.ok) {
      showToast("success", editId ? "Film yeniləndi" : "Film əlavə edildi");
      modal.style.display = "none";
      form.reset();
      editId = null;
      getMovies();
    } else {
      throw new Error("Əməliyyat alınmadı");
    }
  } catch (error) {
    showToast("error", error.message);
  } finally {
    if (loader) loader.classList.add("loader-hidden");
  }
});

// DELETE
async function deleteMovie(id) {
  const confirmDelete = confirm("Filmi silmək istədiyinizə əminsiniz?");
  if (!confirmDelete) return;

  loader?.classList.remove("loader-hidden");
  try {
    const res = await fetch(`${ADMIN_API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      showToast("success", "Film silindi");
      getMovies();
    } else {
      throw new Error("Silmək mümkün olmadı");
    }
  } catch (error) {
    showToast("error", error.message);
  } finally {
    if (loader) loader.classList.add("loader-hidden");
  }
}

// EDIT
async function editMovie(id) {
  if (loader) loader.classList.remove("loader-hidden");
  try {
    const res = await fetch(`${GET_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    const movie = data.data;

    form.title.value = movie.title;
    form.cover_url.value = movie.cover_url;
    form.fragman.value = movie.fragman;
    form.watch_url.value = movie.watch_url;
    form.adult.checked = movie.adult;
    form.run_time_min.value = movie.run_time_min;
    form.imdb.value = movie.imdb;
    form.category.value = movie.category?.id || movie.category;
    form.overview.value = movie.overview;
    modalPosterImg.src = movie.cover_url;

    if (movie.actors && movie.actors.length > 0) {
      form.actors.value = movie.actors[0].id;
    }

    editId = id;
    modal.style.display = "flex";
  } catch (error) {
    showToast("error", "Məlumatları gətirərkən xəta oldu");
  } finally {
    if (loader) loader.classList.add("loader-hidden");
  }
}

coverUrlInput.addEventListener("input", (e) => {
  const url = e.target.value;
  modalPosterImg.src = url.trim() !== "" ? url : DEFAULT_POSTER;
});
modalPosterImg.onerror = () => {
  modalPosterImg.src = DEFAULT_POSTER;
};

window.editMovie = editMovie;
window.deleteMovie = deleteMovie;

// PAGE LOAD
getMovies();
getCategories();
getActors();
