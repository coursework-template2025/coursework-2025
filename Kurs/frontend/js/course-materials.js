document.addEventListener('DOMContentLoaded', () => {
  const courseId = new URLSearchParams(window.location.search).get('id');
  let currentCourse = null;
  let currentLessonIndex = 0;

  // Настройка кнопки "Назад"
  document.getElementById('back-to-course').href = `/course.html?id=${courseId}`;

  // Загрузка данных курса
  fetch(`/api/courses/${courseId}`)
    .then(res => res.json())
    .then(course => {
      currentCourse = course;
      document.getElementById('materials-title').textContent = course.title;

      // Заполняем список уроков
      const lessonsMenu = document.getElementById('lessons-menu');
      course.program.forEach((lesson, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" data-lesson="${index}">${lesson.title}</a>`;
        li.addEventListener('click', () => {
          currentLessonIndex = index;
          loadLesson(lesson);
          updateNavigation();
        });
        lessonsMenu.appendChild(li);
      });

      // Автоматически загружаем первый урок
      if (course.program.length > 0) {
        loadLesson(course.program[0]);
        updateNavigation();
      }

      // Назначаем обработчики для кнопок навигации
      document.getElementById('prev-lesson').addEventListener('click', () => {
        if (currentLessonIndex > 0) {
          currentLessonIndex--;
          loadLesson(currentCourse.program[currentLessonIndex]);
          updateNavigation();
        }
      });

      document.getElementById('next-lesson').addEventListener('click', () => {
        if (currentLessonIndex < currentCourse.program.length - 1) {
          currentLessonIndex++;
          loadLesson(currentCourse.program[currentLessonIndex]);
          updateNavigation();
        }
      });
    })
    .catch(err => {
      console.error('Ошибка:', err);
      document.getElementById('lesson-materials').innerHTML =
        '<p class="error">Не удалось загрузить материалы курса</p>';
    });

  // Функция загрузки урока
  async function loadLesson(lesson) {
  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-progress').textContent =
    `Урок ${currentLessonIndex + 1} из ${currentCourse.program.length}`;

  const materialsContainer = document.getElementById('lesson-materials');
  materialsContainer.innerHTML = '<div class="loader">Загрузка материалов...</div>';

  const videoHtml = lesson.youtubeId ? `
    <div class="video-container">
      <iframe
        src="https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>
  ` : '<div class="no-video">Видеоурок в разработке</div>';

  const theoryHtml = await loadTheoryHtml(lesson);

  materialsContainer.innerHTML = `
    ${videoHtml}
    ${theoryHtml}
  `;

  // Обновляем активный элемент в списке уроков
  const lessonLinks = document.querySelectorAll('#lessons-menu li a');
  lessonLinks.forEach((link, index) => {
    link.classList.toggle('active', index === currentLessonIndex);
  });
}

async function loadTheoryHtml(lesson) {
  if (lesson.theoryFile) {
    try {
      const response = await fetch(`http://localhost:3000/api/theory/${lesson.theoryFile}`);
      if (!response.ok) throw new Error('Файл не найден');
      const text = await response.text();
      return `
        <div class="theory-content">
          <h3><i class="fas fa-book"></i> Теоретический материал</h3>
          <div class="theory-text">${formatTheoryText(text)}</div>
        </div>
      `;
    } catch (e) {
      return `<div class="error">Не удалось загрузить теоретический материал</div>`;
    }
  }

  if (lesson.theory) {
    return `
      <div class="theory-content">
        <h3><i class="fas fa-book"></i> Теоретический материал</h3>
        <div class="theory-text">${formatTheoryText(lesson.theory)}</div>
      </div>
    `;
  }

  return '';
}



  // Обновление состояния кнопок навигации
  function updateNavigation() {
    const prevBtn = document.getElementById('prev-lesson');
    const nextBtn = document.getElementById('next-lesson');

    prevBtn.disabled = currentLessonIndex <= 0;
    nextBtn.disabled = currentLessonIndex >= currentCourse.program.length - 1;
  }

  // Форматирование текста теории
  function formatTheoryText(text) {
    return text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }
});