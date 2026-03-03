const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments";

const tableBody = document.querySelector("tbody");
const token = localStorage.getItem("token");

const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const pageNumbers = document.querySelector(".page-numbers");

// ================= PAGINATION =================

let currentPage = 1;
let itemsPerPage = 5;
let allComments = [];


// ================= GET COMMENTS =================

async function getComments() {
  try {
    const res = await fetch(GET_API, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Fetch failed");

    const { data } = await res.json();

    allComments = data;

    renderComments();
    renderPagination();

  } catch (error) {
    console.log("GET Error:", error);
  }
}

getComments();


// ================= RENDER COMMENTS =================

function renderComments() {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedItems = allComments.slice(start, end);

  paginatedItems.forEach(comment => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${comment.id}</td>
      <td>${comment.comment}</td>
      <td>${comment.movie?.title || "-"}</td>
      <td>${comment.user?.full_name || "-"}</td>
      <td>${comment.user?.email || "-"}</td>
      <td>
        <button 
          class="delete-btn"
          data-movieid="${comment.movie?.id}"
          data-commentid="${comment.id}">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}


// ================= RENDER PAGINATION =================

function renderPagination() {
  pageNumbers.innerHTML = "";

  const totalPages = Math.ceil(allComments.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) {
      btn.classList.add("active-page");
    }

    btn.onclick = () => {
      currentPage = i;
      renderComments();
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
    renderComments();
    renderPagination();
  }
};

nextBtn.onclick = () => {
  const totalPages = Math.ceil(allComments.length / itemsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderComments();
    renderPagination();
  }
};


// ================= DELETE COMMENT =================

tableBody.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {

    const movieId = e.target.dataset.movieid;
    const commentId = e.target.dataset.commentid;

    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;

    try {
      const res = await fetch(
        `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${movieId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      // Silindikdən sonra siyahını yenilə
      currentPage = 1;
      getComments();

    } catch (error) {
      console.log("DELETE Error:", error);
    }
  }
});