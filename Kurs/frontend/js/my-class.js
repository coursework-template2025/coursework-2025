const userId = localStorage.getItem('userId');
if (!userId) {
  alert("Пожалуйста, войдите в систему");
  window.location.href = '/login.html';
}

document.getElementById('user-courses').innerHTML =
  '<p style="text-align:center; font-size: 1.1em;">Загрузка ваших курсов...</p>';

fetch(`/api/users/${userId}/courses`)
  .then(res => res.json())
  .then(selected => {
    const container = document.getElementById('user-courses');

    if (!selected || selected.length === 0) {
      container.innerHTML = '<p style="text-align:center; font-size: 1.1em;">Вы ещё не добавили ни одного курса.</p>';
      return;
    }

    container.innerHTML = selected.map(c => `
      <div class="course-card">
        <h3>${c.title}</h3>
        <p>${c.duration}</p>
        <a href="/course.html?id=${c.id}" class="button">Перейти</a>
        <button class="button alt danger" onclick="removeCourse(${c.id})">Удалить</button>
      </div>
    `).join('');
  })
  .catch(err => {
    console.error('Ошибка при загрузке курсов:', err);
    document.getElementById('user-courses').innerHTML =
      '<p class="error">Не удалось загрузить курсы</p>';
  });


// Удаление курса из localStorage
async function removeCourse(courseId) {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`/api/users/${userId}/remove-course`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId })
  });

  if (response.ok) {
    location.reload();
  } else {
    alert("Не удалось удалить курс");
  }
}

