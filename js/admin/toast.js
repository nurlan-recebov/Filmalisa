// (function () {

//     if (!document.getElementById("custom-toast-style")) {
//         const style = document.createElement("style");
//         style.id = "custom-toast-style";
//         style.innerHTML = `
//       .g-toast-container {
//         position: fixed;
//         bottom: 20px;
//         right: 20px;
//         z-index: 9999;
//       }

//       .g-toast {
//         min-width: 250px;
//         margin-top: 10px;
//         padding: 12px 16px;
//         border-radius: 8px;
//         color: #fff;
//         font-size: 14px;
//         opacity: 0;
//         transform: translateY(20px);
//         transition: all 0.3s ease;
//         display: flex;
//         justify-content: space-between;
//         align-items: center;
//         box-shadow: 0 4px 10px rgba(0,0,0,0.15);
//       }

//       .g-toast.success { background: #198754; }
//       .g-toast.danger { background: #dc3545; }

//       .g-toast.show {
//         opacity: 1;
//         transform: translateY(0);
//       }

//       .g-toast button {
//         background: none;
//         border: none;
//         color: #fff;
//         font-size: 16px;
//         cursor: pointer;
//       }
//     `;
//         document.head.appendChild(style);
//     }

//     function showToast(message, type = "success") {
//         let container = document.querySelector(".g-toast-container");

//         if (!container) {
//             container = document.createElement("div");
//             container.className = "g-toast-container";
//             document.body.appendChild(container);
//         }

//         const toast = document.createElement("div");
//         toast.className = `g-toast ${type}`;
//         toast.innerHTML = `
//       <span>${message}</span>
//       <button>&times;</button>
//     `;

//         container.appendChild(toast);

//         setTimeout(() => toast.classList.add("show"), 10);

//         setTimeout(() => removeToast(toast), 3000);

//         toast.querySelector("button").addEventListener("click", () => {
//             removeToast(toast);
//         });
//     }

//     function removeToast(toast) {
//         toast.classList.remove("show");
//         setTimeout(() => toast.remove(), 300);
//     }

//     window.showToast = showToast;

//     document.addEventListener("click", function (e) {
//         const btn = e.target.closest(".submit-btn");
//         if (!btn) return;

//         e.preventDefault();

//         const modal = btn.closest(".modal-content") || document;
//         const inputs = modal.querySelectorAll("input, textarea, select");

//         let allFilled = true;

//         inputs.forEach(input => {
//             if (!input.value.trim()) {
//                 allFilled = false;
//             }
//         });

//         if (allFilled) {
//             showToast("Submitted successfully!", "success");
//         } else {
//             showToast("Please fill all fields!", "danger");
//         }
//     });

// })();