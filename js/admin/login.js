const API = "https://api.sarkhanrahimli.dev/api/filmalisa";
const eyeIcon=document.querySelector(".visibility-toggle")
const passInpEl=document.getElementById("password")
const form = document.getElementById("loginForm");


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

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Email və şifrə boş ola bilməz");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!res.ok || !data.result) {
      alert(data.message || "Login uğursuz oldu");
      return;
    }

    const token = data.data.tokens.access_token;

    if (!token) {
      alert("Token tapılmadı");
      return;
    }

    // JWT payload oxumaq
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("JWT PAYLOAD:", payload);

    // Əgər backend role göndərmirsə email yoxlayırıq
    if (data.data.profile.email !== "admin@admin.com") {
      alert("Bu hesab admin deyil!");
      return;
    }

    // Token saxla
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminProfile", JSON.stringify(data.data.profile));

    // Dashboard-a keç
    window.location.href = "../../pages/admin/dashboard.html";

  } catch (error) {
    console.error("Login error:", error);
    alert("Server xətası baş verdi");
  }
});