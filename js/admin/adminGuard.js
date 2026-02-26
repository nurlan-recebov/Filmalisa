// adminGuard.js

(function () {
  const token = localStorage.getItem("token");

  // Əgər token yoxdursa loginə yönləndir
  if (!token) {
   window.location.replace("../../pages/admin/login.html");
    return;
  }

 
})();
console.log("guard işləyir");
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminProfile");

  window.location.href = "login.html";
});