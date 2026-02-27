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



const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const full_name = contactForm.querySelector('input[type="text"]').value;
  const email = contactForm.querySelector('input[type="email"]').value;
  const reason = contactForm.querySelector('textarea').value;

  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  submitBtn.style.opacity = "0.7";

  try {
    const response = await fetch("https://api.sarkhanrahimli.dev/api/filmalisa/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ full_name, email, reason }),
    });

    const data = await response.json();

    if (data.result) {
      alert("Message sent successfully!");
      contactForm.reset();
    } else {
      alert("Failed to send message. Try again.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Try again later.");
  }
  finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    submitBtn.style.opacity = "1";
  }
});