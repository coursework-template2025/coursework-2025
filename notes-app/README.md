Notes and Screenshots App
Описание проекта
Это веб-приложение для создания и хранения заметок и скриншотов. Приложение состоит из клиентской части (React) и серверной части (Node.js с MongoDB).
Технологии

Frontend: React, Tailwind CSS
Backend: Node.js, Express, MongoDB
Языки: JavaScript, HTML, CSS

Установка и запуск
Предварительные требования

Установите Node.js (https://nodejs.org/)
Установите MongoDB (https://www.mongodb.com/try/download/community)

Шаги

Клонируйте репозиторий (если используете Git):
git clone <repository-url>
cd <repository-folder>


Установите зависимости:
npm install


Запустите MongoDB:Убедитесь, что MongoDB запущен на локальном сервере (по умолчанию на порту 27017). Например:
mongod


Запустите сервер:
node server/index.js

Сервер будет запущен на http://localhost:5000.

Запустите клиент:Откройте файл client/index.html в браузере. Например, если используете VS Code, можно установить расширение Live Server для автоматического запуска.


Использование

Откройте приложение в браузере.
Введите заголовок и текст заметки.
Нажмите "Add Note" для сохранения заметки.
Заметки отображаются в списке ниже формы.

Структура проекта

client/ — Клиентская часть (React).
server/ — Серверная часть (Node.js, Express, MongoDB).
README.md — Описание проекта.
.gitignore — Файл для исключения ненужных файлов из Git.
package.json — Конфигурация зависимостей и скриптов.

