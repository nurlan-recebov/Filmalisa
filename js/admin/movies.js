const createBtn = document.querySelector(".add-btn");
const modal = document.getElementById("createModal");

if (createBtn) {
  createBtn.addEventListener("click", () => {
    document.body.classList.add("modal-open");
    modal.classList.add("open");
  });
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.classList.remove("modal-open");
      modal.classList.remove("open");
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) {
    document.body.classList.remove("modal-open");
    modal.classList.remove("open");
  }
});
