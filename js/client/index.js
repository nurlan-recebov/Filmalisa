const items = document.querySelectorAll(".item");
const emailInp = document.querySelector(".email-input");
const emailForm = document.querySelector(".email-box");

emailForm.addEventListener("submit", async (e) => {
  e.preventDefault()
  const email = emailInp.value.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    showToast("error", "Zəhmət olmasa düzgün email daxil edin.");
    return;
  }

localStorage.setItem("userEmail", email);
  localStorage.setItem("fromHero", "true"); 
  
  window.location.href = "./pages/client/register.html";
});

items.forEach((item) => {
  const question = item.querySelector(".question");

  question.addEventListener("click", () => {
    items.forEach((i) => {
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

  const full_name = contactForm.querySelector('input[type="text"]').value;
  const email = contactForm.querySelector('input[type="email"]').value;
  const reason = contactForm.querySelector("textarea").value;

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ full_name, email, reason }),
      },
    );

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
});
