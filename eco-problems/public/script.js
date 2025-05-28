const apiUrl = 'http://localhost:3000/problems';
const authApiUrl = 'http://localhost:3000/api/auth';

let problems = [];

function showMessage(msg, type = "info") {
  const messageDiv = document.getElementById("authMessage");
  if (!messageDiv) return;
  messageDiv.textContent = msg;
  messageDiv.style.color = type === "error" ? "red" : type === "success" ? "green" : "black";
}

// --- Регистрация ---
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch(`${authApiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      showMessage("Регистрация успешна! Вы вошли в систему.", "success");
      loadProblems();
    } else {
      showMessage(data.msg || data.errors?.[0]?.msg || "Ошибка регистрации", "error");
    }
  } catch {
    showMessage("Ошибка сети", "error");
  }
});

// --- Вход ---
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${authApiUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      showMessage("Вход успешен!", "success");
      loadProblems();
    } else {
      showMessage(data.msg || data.errors?.[0]?.msg || "Ошибка входа", "error");
    }
  } catch {
    showMessage("Ошибка сети", "error");
  }
});

// --- Добавление проблемы ---
document.getElementById('problemForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const location = document.getElementById('location').value;
  const category = document.getElementById('categorySelect').value;
  const token = localStorage.getItem('token');

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ title, description, location, category }),
    });
    document.getElementById('problemForm').reset();
    loadProblems();
  } catch {
    alert('Ошибка при добавлении проблемы');
  }
});

const problemsList = document.getElementById('problemsList');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');

// --- Загрузка проблем с сервера ---
function loadProblems() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      problems = data;
      renderProblems();
    })
    .catch(() => {
      problemsList.innerHTML = '<p>Ошибка при загрузке проблем</p>';
    });
}

// --- Рендеринг с фильтрацией ---
function renderProblems() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const token = localStorage.getItem('token');

  const filteredProblems = problems.filter(problem => {
    const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  problemsList.innerHTML = '';

  if (filteredProblems.length === 0) {
    problemsList.innerHTML = '<p>Проблемы не найдены.</p>';
    return;
  }

  filteredProblems.forEach(problem => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <h3>${problem.title}</h3>
      <p><strong>Категория:</strong> ${problem.category || 'не указана'}</p>
      <p>${problem.description}</p>
      <p><em>Локация: ${problem.location || 'не указана'}</em></p>
      ${token ? `<button onclick="deleteProblem('${problem._id}')">Удалить</button>` : ''}
    `;

    problemsList.appendChild(card);
  });
}

// --- Удаление проблемы ---
function deleteProblem(id) {
  const token = localStorage.getItem('token');
  fetch(`${apiUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    }
  }).then(() => loadProblems());
}

// --- Обработчики фильтрации ---
searchInput?.addEventListener('input', renderProblems);
categoryFilter?.addEventListener('change', renderProblems);

// --- Инициализация карты ---
function initMap() {
  if (!document.getElementById('map')) return;

  const map = L.map('map').setView([41.5, 74.5], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  L.marker([42.87, 74.6]).addTo(map).bindPopup("Загрязнение воздуха в Бишкеке");
  L.marker([40.52, 72.8]).addTo(map).bindPopup("Проблемы с водоснабжением в Оше");
}

// --- Старт ---
window.addEventListener('load', () => {
  loadProblems();
  initMap();
});



