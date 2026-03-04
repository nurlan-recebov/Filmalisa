const registerForm = document.querySelector(".login-form");
const eyeIcon = document.querySelector(".visibility-toggle");
const passInpEl = document.getElementById("password");
const loader = document.getElementById("loader");
const emailInpEl = document.getElementById("email");
const usernameInpEl = document.getElementById("username");

window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');

    if (emailFromUrl && emailInpEl) {
        emailInpEl.value = decodeURIComponent(emailFromUrl);
        
        if (usernameInpEl) {
            usernameInpEl.focus();
        }
    }
});


eyeIcon.addEventListener("click", () => {
    const isPass = passInpEl.type === "password";
    passInpEl.type = isPass ? "text" : "password";
    eyeIcon.src = isPass ? "./../../assets/icons/eye-off.svg" : "./../../assets/icons/eye.svg";
});


registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');

    const userData = {
        full_name: document.getElementById("username").value.trim(),
        email: emailInpEl.value.trim(),
        password: passInpEl.value.trim(),
    };

    loader.classList.remove("loader-hidden");
    submitBtn.disabled = true;

    try {
        const response = await fetch(
            "https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            }
        );

        const data = await response.json();

        if (response.ok) {
            showToast("success", "Qeydiyyat uğurludur!");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            showToast("error", data.message || "Xəta baş verdi");
            submitBtn.disabled = false;
        }
    } catch (error) {
        showToast("error", "Serverlə əlaqə kəsildi");
        submitBtn.disabled = false;
    } finally {
        setTimeout(() => {
            loader.classList.add("loader-hidden");
        }, 500);
    }
});
