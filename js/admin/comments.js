const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments";

const tableBody = document.querySelector("tbody");
const token = localStorage.getItem("token");



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

    tableBody.innerHTML = "";

    data.forEach(comment => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${comment.id}</td>
        <td>${comment.comment}</td>
        <td>${comment.movie?.title}</td>
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

  } catch (error) {
    console.log("GET Error:", error);
  }
}

getComments();


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

      if (!res.ok) {
        console.log("Status:", res.status);
        throw new Error("Delete failed");
      }

      // DOM-dan sil
      e.target.closest("tr").remove();

    } catch (error) {
      console.log("DELETE Error:", error);
    }
  }
});