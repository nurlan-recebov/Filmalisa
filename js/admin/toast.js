function injectToastCSS() {
    if (document.getElementById('admin-toast-style')) return;
    const style = document.createElement('style');
    style.id = 'admin-toast-style';
    style.innerHTML = `
        .admin-toast {
            position: fixed;
            top: 30px;
            right: 30px;
            min-width: 220px;
            max-width: 320px;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-family: inherit;
            color: #fff;
            background: #222;
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s, transform 0.3s;
            transform: translateY(-20px);
        }
        .admin-toast.show {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }
        .admin-toast.success {
            background: linear-gradient(90deg, #38b000, #70e000);
        }
        .admin-toast.error {
            background: linear-gradient(90deg, #d90429, #ef233c);
        }
        .admin-toast .toast-icon {
            margin-right: 10px;
            vertical-align: middle;
        }
        .admin-toast .toast-text {
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);
}

function showToast(message, type = 'success') {
    injectToastCSS();
    let toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    let icon = '';
    if (type === 'success') {
        icon = '<span class="toast-icon">✅</span>';
    } else if (type === 'error') {
        icon = '<span class="toast-icon">❌</span>';
    } else {
        icon = '<span class="toast-icon">ℹ️</span>';
    }
    toast.innerHTML = `${icon}<span class="toast-text">${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

window.showToast = showToast;



document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.submit-btn').forEach(function (btn) {
        const form = btn.closest('form');
        if (form) {
            form.addEventListener('submit', function (e) {
                let valid = true;
                const inputs = form.querySelectorAll('input[type="text"], textarea, select');
                inputs.forEach(input => {
                    if (input.type === 'checkbox') return;
                    if (!input.value || input.value.trim() === '') valid = false;
                });
                if (!valid) {
                    e.preventDefault();
                    showToast('Please fill all fields!', 'error');
                } else {
                    showToast('Operation completed successfully!', 'success');
                }
            });
        } else {
            btn.addEventListener('click', function (e) {
                const modalContent = btn.closest('.modal-content');
                if (!modalContent) return;
                let valid = true;
                const inputs = modalContent.querySelectorAll('input[type="text"], textarea, select');
                inputs.forEach(input => {
                    if (input.type === 'checkbox') return;
                    if (!input.value || input.value.trim() === '') valid = false;
                });
                if (!valid) {
                    showToast('Please fill all fields!', 'error');
                } else {
                    showToast('Operation completed successfully!', 'success');
                }
            });
        }
    });
});
