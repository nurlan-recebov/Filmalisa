const API = "https://api.sarkhanrahimli.dev/api/filmalisa";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API}/auth/login`, {
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
    console.log(data);

    if (res.ok) {
      const token = data.data.tokens.access_token;

      localStorage.setItem("token", token);
      console.log("TOKEN:", token);

      window.location.href = "../../pages/admin/dashboard.html";
    } else {
      alert(data.message || "Login alınmadı");
    }

  } catch (error) {
    console.error(error);
  }
});