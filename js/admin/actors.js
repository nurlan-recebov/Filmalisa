const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.querySelector(".close");

// Open modal
openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// Close modal with X
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
