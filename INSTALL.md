# Инструкция по развертыванию (Installation Guide)

## Требования (Prerequisites)
- [Node.js](https://nodejs.org/) (версия 14 или выше)
- [MongoDB](https://www.mongodb.com/) (локально или через Atlas)

## Установка (Installation)

### 1. Клонирование репозитория
```bash
git clone <repository-url>
cd task-management-system
```

### 2. Установка зависимостей Backend
```bash
# В корневой папке проекта
npm install
```

### 3. Установка зависимостей Frontend
```bash
cd client
npm install
cd ..
```

## Настройка (Configuration)

### Backend (.env)
1. Создайте файл `.env` в корне проекта (используйте `.env.example` как шаблон):
   ```bash
   cp .env.example .env
   ```
2. Откройте `.env` и укажите параметры:
   - `PORT`: Порт сервера (по умолчанию 5001)
   - `MONGO_URI`: Строка подключения к MongoDB
   - `JWT_SECRET`: Секретный ключ для токенов
   - `NODE_ENV`: development

## Запуск (Running)

### Запуск Backend (Сервер API)
В корневой папке выполните:
```bash
npm run dev
```
Сервер запустится на `http://localhost:5001`.

### Запуск Frontend (React Клиент)
В новом окне терминала перейдите в папку `client` и запустите:
```bash
cd client
npm run dev
```
Клиент будет доступен по адресу, указанному в консоли (обычно `http://localhost:5173`).

### Проверка работоспособности
1. Откройте браузер по адресу клиента.
2. Зарегистрируйтесь (`/register`).
3. Создайте команду в Dashboard.
4. Добавляйте задачи и меняйте их статусы.
