const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
const ADMIN_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/movie";
const CATEGORY_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/categories";
const ACTOR_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/actors";

const tableBody = document.querySelector(".main-table tbody");
const form = document.querySelector(".modal-form");
const modal = document.getElementById("createModal");
const addBtn = document.querySelector(".add-btn");

const categorySelect = document.querySelector("select[name='category']");
const actorSelect = document.querySelector("select[name='actors']");

const actorImgInput = document.querySelector("input[name='actor_img_url']");
const actorPreview = document.getElementById("actorPreview");

let editId = null;
const token = localStorage.getItem("token");


// ================= MODAL =================

addBtn.onclick = () => modal.style.display = "flex";

modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};


// ================= CATEGORIES =================

async function getCategories() {
  try {
    const res = await fetch(CATEGORY_API, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    categorySelect.innerHTML = "";

    result.data.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });

  } catch (err) {
    console.log("Category error:", err);
  }
}


// ================= ACTORS =================

async function getActors() {
  try {
    const res = await fetch(ACTOR_API, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    actorSelect.innerHTML = "";

    result.data.forEach(actor => {
      const option = document.createElement("option");
      option.value = actor.id;
      option.textContent = actor.name + " " + actor.surname;

      // img_url saxlayırıq
      option.dataset.img = actor.img_url;

      actorSelect.appendChild(option);
    });

    updateActorImage();

  } catch (err) {
    console.log("Actor error:", err);
  }
}


// ================= ACTOR IMAGE UPDATE =================

function updateActorImage() {
  const selectedOption = actorSelect.selectedOptions[0];

  if (!selectedOption) {
    if (actorImgInput) actorImgInput.value = "";
    if (actorPreview) actorPreview.src = "";
    return;
  }

  const imgUrl = selectedOption.dataset.img;

  if (actorImgInput) actorImgInput.value = imgUrl;
  if (actorPreview) actorPreview.src = imgUrl;
}

actorSelect.addEventListener("change", updateActorImage);


// ================= MOVIES =================

async function getMovies() {
  try {
    const res = await fetch(GET_API, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    tableBody.innerHTML = "";

    result.data.forEach(movie => {

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${movie.id}</td>
        <td><img src="${movie.cover_url}" width="60"/></td>
        <td>${movie.title}</td>
        <td>${movie.run_time_min}</td>
        <td>${movie.imdb}</td>
        <td>
          <button onclick="editMovie(${movie.id})">Edit</button>
          <button onclick="deleteMovie(${movie.id})">Delete</button>
        </td>
      `;

      tableBody.appendChild(tr);
    });

  } catch (err) {
    console.log("Movie error:", err);
  }
}


// ================= FORM SUBMIT =================

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedActors = Array.from(actorSelect.selectedOptions)
    .map(option => Number(option.value));

  const movie = {
    title: form.title.value,
    cover_url: form.cover_url.value,
    fragman: form.fragman.value,
    watch_url: form.watch_url.value,
    adult: form.adult.checked,
    run_time_min: Number(form.run_time_min.value),
    imdb: form.imdb.value,
    category: Number(form.category.value),
    actors: selectedActors,
    overview: form.overview.value
  };

  const url = editId ? `${ADMIN_API}/${editId}` : ADMIN_API;
  const method = editId ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(movie)
    });

    if (!res.ok) {
      console.log("Xəta baş verdi!");
      return;
    }

    modal.style.display = "none";
    form.reset();
    editId = null;
    updateActorImage();
    getMovies();

  } catch (err) {
    console.log("Submit error:", err);
  }
});


// ================= DELETE =================

async function deleteMovie(id) {
  if (!confirm("Filmi silmək istədiyinizə əminsiniz?")) return;

  try {
    await fetch(`${ADMIN_API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    getMovies();

  } catch (err) {
    console.log("Delete error:", err);
  }
}


// ================= EDIT =================

async function editMovie(id) {
  try {
    const res = await fetch(`${GET_API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();
    const movie = result.data;

    form.title.value = movie.title;
    form.cover_url.value = movie.cover_url;
    form.fragman.value = movie.fragman;
    form.watch_url.value = movie.watch_url;
    form.adult.checked = movie.adult;
    form.run_time_min.value = movie.run_time_min;
    form.imdb.value = movie.imdb;
    form.overview.value = movie.overview;

    form.category.value = movie.category?.id || movie.category;

    const actorIds = movie.actors
      ? movie.actors.map(a => a.id || a)
      : [];

    Array.from(actorSelect.options).forEach(option => {
      option.selected = actorIds.includes(Number(option.value));
    });

    updateActorImage();

    editId = id;
    modal.style.display = "flex";

  } catch (err) {
    console.log("Edit error:", err);
  }
}


// ================= PAGE LOAD =================

getMovies();
getCategories();
getActors();