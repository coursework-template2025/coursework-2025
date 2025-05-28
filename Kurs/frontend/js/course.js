document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const userId = localStorage.getItem('userId');

  Promise.all([
    fetch(`/api/courses/${id}`).then(res => res.json()),
    fetch('/api/teachers').then(res => res.json())
  ])
    .then(([course, teachers]) => {
      const teacher = teachers.find(t => t.id === course.instructorId);

      document.getElementById('course-title').textContent = course.title;

      const programList = course.program.map(item => `<li>${item.title}</li>`).join('');

      document.getElementById('course-details').innerHTML = `
        <div class="course-info">
          ${teacher ? `
            <div class="teacher-details" style="display: flex; align-items: center; gap: 10px;">
              <img src="${teacher.photo}" alt="${teacher.name}" class="teacher-photo">
              <div>
                <strong>${teacher.name}</strong><br>
                <span style="font-size: 0.9em; color: #888;">⭐ ${teacher.rating}</span>
              </div>
            </div>` : ''
          }
          <p><strong>Длительность:</strong> ${course.duration}</p>
          <p><strong>Уровень:</strong> ${course.level}</p>
          <div class="description">
            <h3>Описание курса:</h3>
            <p>${course.description}</p>
          </div>
          <div class="program">
            <h3>Программа курса:</h3>
            <ul>${programList}</ul>
          </div>
          <div style="margin-top: 20px; display: flex; gap: 10px;">
            <a href="/course-materials.html?id=${course.id}" class="button">Начать обучение</a>
            ${userId ? `<button onclick="toggleCourse(${course.id})" class="button alt">Добавить в мой класс</button>` : ''}
          </div>
        </div>
      `;
    })
    .catch(err => {
      console.error('Ошибка:', err);
      document.getElementById('course-details').innerHTML =
        '<p class="error">Не удалось загрузить данные о курсе</p>';
    });
});

// Глобально доступная функция для добавления курса в "Мой класс"
async function toggleCourse(courseId) {
  const userId = localStorage.getItem('userId');
  if (!userId) return alert("Пользователь не авторизован");

  const response = await fetch(`/api/users/${userId}/add-course`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courseId })
  });

  if (response.ok) {
    alert("Курс добавлен в ваш список!");
  } else {
    alert("Ошибка при добавлении курса.");
  }
}

