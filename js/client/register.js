const registerForm = document.querySelector(".login-form");
const eyeIcon = document.querySelector(".visibility-toggle");
const passInpEl = document.querySelector(".pass-inp");

eyeIcon.addEventListener("click", () => {
  if (passInpEl.getAttribute("type") == "text") {
    passInpEl.setAttribute("type", "password");
    eyeIcon.setAttribute("src", "./../../assets/icons/eye.svg");
    eyeIcon.setAttribute("alt", "Gizlət");
  } else {
    passInpEl.setAttribute("type", "text");
    eyeIcon.setAttribute("src", "./../../assets/icons/eye-off.svg");
    eyeIcon.setAttribute("alt", "Göstər");
  }
});


registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    full_name: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );

    const data = await response.json();

    if (response.ok) {
      showToast("success", "Qeydiyyat uğurludur!");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      showToast("error", data.message || "Xəta baş verdi");
    }
  } catch (error) {
    showToast("error", "Serverlə əlaqə kəsildi");
  }
});
