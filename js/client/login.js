const loginForm = document.querySelector(".login-form");
const eyeIcon = document.querySelector(".visibility-toggle");
const passInpEl = document.getElementById("password");

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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const response = await fetch(
    "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    }
  );

  const data = await response.json();

  if (response.ok) {
    const token = data.data.tokens.access_token;
    if (token) {
        localStorage.setItem("userToken", token);
        showToast("success", "Giriş uğurludur!");
        
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1500);
    }
  } else {
    showToast("error", data.message || "Email və ya şifrə səhvdir");
  }
});