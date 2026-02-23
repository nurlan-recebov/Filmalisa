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
