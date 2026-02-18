const items = document.querySelectorAll(".item");

items.forEach(item => {
  const question = item.querySelector(".question");

  question.addEventListener("click", () => {

    items.forEach(i => {
      if (i !== item) {
        i.classList.remove("active");
        i.querySelector(".icon").textContent = "+";
      }
    });

    item.classList.toggle("active");

    const icon = item.querySelector(".icon");
    icon.textContent = item.classList.contains("active") ? "×" : "+";
  });
});
