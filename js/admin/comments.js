const GET_API = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments";
const tableBody = document.querySelector("tbody");
const token = localStorage.getItem("token");
const loader = document.getElementById("loader");

const toggleLoader = (show) => {
  if (!loader) return;
  loader.classList.toggle("loader-hidden", !show);
};

// ================= GET COMMENTS =================
async function getComments() {
  toggleLoader(true);

  try {
    const res = await fetch(GET_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Fetch failed");

    const { data } = await res.json();

    tableBody.innerHTML = "";

    data.forEach((comment) => {
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
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  } catch (error) {
    if (typeof showToast === "function") showToast("error", "Məlumat yüklənmədi");
  } finally {
    toggleLoader(false);
  }
}

getComments();

// ================= DELETE COMMENT =================
tableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest(".delete-btn");
  
  if (btn) {
    const movieId = btn.dataset.movieid; 
    const commentId = btn.dataset.commentid; 

    if (!confirm("Silmək istədiyinizə əminsiniz?")) return;
    
    toggleLoader(true);
    try {
      const res = await fetch(
        `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${movieId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      btn.closest("tr").remove();
      if (typeof showToast === "function") showToast("success", "Rəy silindi");
    } catch (error) {
      if (typeof showToast === "function") showToast("error", "Xəta baş verdi!");
    } finally {
      toggleLoader(false);
    }
  } 
});
