document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('userId');
  const authBlock = document.getElementById('auth-block');

  if (!authBlock) return;

  if (userId) {
    fetch('/api/users/' + userId)
      .then(res => {
        if (!res.ok) throw new Error("Пользователь не найден");
        return res.json();
      })
      .then(user => {
        authBlock.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
            <span class="user-info">👤 ${user.email}</span>
            <button onclick="logout()" class="button small-button danger">Выйти</button>
          </div>
        `;
      })
      .catch(() => {
        localStorage.removeItem('userId');
        showAuthLinks(); // показать вход/регу при ошибке
      });
  } else {
    showAuthLinks();
  }

  function showAuthLinks() {
    authBlock.innerHTML = `
      <div style="display: flex; gap: 10px;">
        <a href="/login.html" class="button small-button">Вход</a>
        <a href="/register.html" class="button small-button">Регистрация</a>
      </div>
    `;
  }
});

function logout() {
  localStorage.removeItem('userId');
  location.reload();
}
