const accountForm = document.getElementById("accountForm");
const imgInput = document.getElementById("imgInput");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passInput = document.querySelector(".pass-input");
const eyeIcon = document.querySelector(".eye-icon");
const profilePreview = document.getElementById("profilePreview");

const API_URL = "https://api.sarkhanrahimli.dev/api/filmalisa/profile";

const token = localStorage.getItem("userToken");

if (!token) {
  window.location.href = "login.html";
}

eyeIcon.addEventListener("click", () => {
  if (passInput.getAttribute("type") == "text") {
    passInput.setAttribute("type", "password");
    eyeIcon.setAttribute("src", "./../../assets/icons/eye.svg");
    eyeIcon.setAttribute("alt", "Gizlət");
  } else {
    passInput.setAttribute("type", "text");
    eyeIcon.setAttribute("src", "./../../assets/icons/eye-off.svg");
    eyeIcon.setAttribute("alt", "Göstər");
  }
});

async function loadUserData() {
  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = await response.json();
    const data = userData?.data;

    if (response.ok && data) {
      nameInput.value = data.full_name ?? "";
      emailInput.value = data.email ?? "";
      imgInput.value = data.img_url ?? "";
      
      if (data.img_url) {
        profilePreview.src = data.img_url;
      }
    }
  } catch (error) {
    console.warn("Məlumatlar gətirilərkən xəta.");
  }
}

accountForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!passInput.value) {
    showToast('error', 'Zəhmət olmasa şifrəni daxil edin!'); 
    return;
  }

  const updatedData = {
    full_name: nameInput.value,
    email: emailInput.value, 
    img_url: imgInput.value,
    password: passInput.value 
  };

  try {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();

    if (response.ok) {
      showToast('success', 'Məlumatlar uğurla yeniləndi!'); 
      profilePreview.src = imgInput.value;
    } else {
      showToast('error', result.message || 'Xəta baş verdi!'); 
    }
  } catch (error) {
    showToast('error', 'Serverlə əlaqə kəsildi!');
  }
});

loadUserData();
