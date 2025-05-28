document.addEventListener('DOMContentLoaded', () => {
  Promise.all([
  fetch('/api/teachers').then(res => res.json()),
  fetch('/api/courses').then(res => res.json())
])
  .then(([teachers, courses]) => {
    const container = document.getElementById('teachers');
    container.innerHTML = teachers.map(t => {
      const count = courses.filter(c => c.instructorId === t.id).length;

      return `
        <div class="teacher-card" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
              <img src="${t.photo}" alt="${t.name}" class="teacher-photo-small">
              <div>
                <div style="font-weight: bold;">${t.name}</div>
                <div style="font-size: 0.9em; color: #888;">
                  ⭐ ${t.rating} &nbsp;&nbsp;📦 ${count}
                </div>
              </div>
            </div>
      `;
    }).join('');
    })
    .catch(err => {
      console.error('Ошибка при загрузке преподавателей:', err);
      document.getElementById('teachers').innerHTML =
        '<p class="error">Не удалось загрузить преподавателей</p>';
    });
});
