const API = "https://api.sarkhanrahimli.dev/api/filmalisa";

const eyeIcon = document.querySelector(".visibility-toggle");
const passInpEl = document.getElementById("password");
const form = document.getElementById("loginForm");

// Password show / hide
eyeIcon.addEventListener("click", () => {
  if (passInpEl.type === "text") {
    passInpEl.type = "password";
    eyeIcon.src = "./../../assets/icons/eye.svg";
    eyeIcon.alt = "Gizlət";
  } else {
    passInpEl.type = "text";
    eyeIcon.src = "./../../assets/icons/eye-off.svg";
    eyeIcon.alt = "Göstər";
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = passInpEl.value.trim();

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
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!res.ok || !data.result) {
      alert(data.message || "Login uğursuz oldu");
      return;
    }

    const token = data.data?.tokens?.access_token;

    if (!token) {
      alert("Token tapılmadı");
      return;
    }

    // JWT payload oxu
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("JWT PAYLOAD:", payload);

    // Admin yoxlaması (əgər role gəlmirsə email ilə)
    if (data.data.profile.email !== "admin@admin.com") {
      alert("Bu hesab admin deyil!");
      return;
    }

    // Token və profil saxla
    localStorage.setItem("token", token);
    localStorage.setItem("adminProfile", JSON.stringify(data.data.profile));

    // ✅ Dashboard-a yönləndir
    window.location.replace("../../pages/admin/dashboard.html");

  } catch (error) {
    console.error("Login error:", error);
    alert("Server xətası baş verdi");
  }
});