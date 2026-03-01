function showToast(type, message, duration = 3500) {
  const container = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  toast.innerHTML = `
    <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
    <div class="toast-msg">${message}</div>
    <button class="toast-close">✕</button>
    <div class="toast-progress" style="animation-duration:${duration}ms"></div>
  `;

  container.appendChild(toast);

  const timer = setTimeout(() => remove(toast), duration);

  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(timer);
    remove(toast);
  });

  function remove(el) {
    if (el.classList.contains('removing')) return;
    el.classList.add('removing');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}

// ------------------------------
// Universal Bootstrap Toast
// ------------------------------

function showToast(message, type = 'success') {
  if (!document.getElementById('globalToast')) {
    const container = document.createElement('div');
    container.className = 'position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = 2000;

    container.innerHTML = `
      <div id="globalToast" class="toast align-items-center text-bg-success border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body" id="globalToastMessage"></div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;

    document.body.appendChild(container);
  }

  const toastEl = document.getElementById('globalToast');
  const toastMessageEl = document.getElementById('globalToastMessage');

  toastMessageEl.textContent = message;
  toastEl.classList.remove('text-bg-success', 'text-bg-danger');
  toastEl.classList.add(type === 'success' ? 'text-bg-success' : 'text-bg-danger');

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', function (e) {

    const btn = e.target.closest('.submit-btn');
    if (!btn) return;

    e.preventDefault();

    const modal = btn.closest('.modal-content');
    const inputs = modal ? modal.querySelectorAll('input, textarea, select') : [];

    let allFilled = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        allFilled = false;
      }
    });

    if (allFilled) {
      showToast('Submitted successfully!', 'success');
    } else {
      showToast('Please fill all fields!', 'danger');
    }

  });
});

