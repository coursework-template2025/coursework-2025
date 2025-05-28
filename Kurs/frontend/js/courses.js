// Глобальная функция ДО document.addEventListener
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

document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('userId');

  Promise.all([
    fetch('/api/courses').then(res => res.json()),
    fetch('/api/teachers').then(res => res.json())
  ])
    .then(([courses, teachers]) => {
      const container = document.getElementById('courses-list');
      container.innerHTML = courses.map(course => {
        const teacher = teachers.find(t => t.id === course.instructorId);
        return `
          <div class="course-card">
            <img src="${course.image}" alt="${course.title}" class="course-image">
            <h3>${course.title}</h3>
            <p>Длительность: ${course.duration}</p>
            <p>Преподаватель:</p>
            ${teacher ? `
              <div class="teacher-info" style="display:flex; align-items:center; gap:10px; margin-top:10px;">
                  <img src="${teacher.photo}" alt="${teacher.name}" class="teacher-photo">
                  <div>
                    <div style="font-weight: bold;">${teacher.name}</div>
                    <div style="font-size: 0.9em; color: #888;">
                      ⭐ ${teacher.rating}
                    </div>
                  </div>
                </div>
            ` : ''}
            <a href="/course.html?id=${course.id}" class="button">Подробнее</a>
            ${userId ? `<button onclick="toggleCourse(${course.id})" class="button alt">Добавить</button>` : ''}
          </div>
        `;
      }).join('');
    })
    .catch(err => {
      console.error('Ошибка:', err);
      document.getElementById('courses-list').innerHTML =
        '<p class="error">Не удалось загрузить курсы</p>';
    });
});
