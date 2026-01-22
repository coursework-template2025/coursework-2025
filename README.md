# Пояснительная записка

## к проекту «Notes System»

---

## 1. Назначение и цель проекта

Цель проекта **Notes System** — разработка и внедрение защищённого веб-приложения для хранения пользовательских заметок с возможностью:

* регистрации и аутентификации пользователей;
* разграничения доступа к данным;
* централизованного управления инфраструктурой;
* автоматизированного тестирования;
* непрерывной доставки (CI/CD);
* мониторинга и наблюдаемости.

Проект ориентирован на **production-подход**, а не учебный прототип.

---

## 2. Общая архитектура системы

### 2.1 Компоненты системы

| Компонент     | Назначение                 |
| ------------- | -------------------------- |
| Frontend      | Пользовательский интерфейс |
| Backend       | REST API, бизнес-логика    |
| PostgreSQL    | Хранилище данных           |
| Nginx         | Reverse proxy, TLS         |
| Docker        | Контейнеризация            |
| GitLab CI     | CI/CD                      |
| Prometheus    | Сбор метрик                |
| Grafana       | Визуализация               |
| Node Exporter | Метрики хоста              |
| cAdvisor      | Метрики контейнеров        |

---

### 2.2 Схема взаимодействия

```
[Browser]
   ↓ HTTPS
[Nginx + TLS]
   ↓ HTTP
[Backend (Node.js)]
   ↓ SQL
[PostgreSQL]
```

Мониторинг:

```
[Prometheus] ← Backend / PostgreSQL / Docker / Host
      ↓
   [Grafana]
```

---

## 3. Backend: архитектура и код

### 3.1 Стек технологий

* Node.js 18
* Express
* PostgreSQL
* JWT
* bcrypt

---

### 3.2 Точка входа приложения

Файл `index.js`:

```js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
const auth = require('./middleware');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY';

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Backend started');
  });
}

module.exports = app;
```

#### Почему так сделано:

* `module.exports = app` — позволяет тестировать приложение без запуска сервера
* `require.main === module` — исключает автозапуск при тестировании
* `JWT_SECRET` — вынесен в переменные окружения

---

## 4. Работа с базой данных

### 4.1 Конфигурация подключения

```js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  user: process.env.DB_USER || 'notes',
  password: process.env.DB_PASSWORD || 'notes',
  database: process.env.DB_NAME || 'notesdb',
  port: 5432
});

module.exports = pool;
```

---

### 4.2 Инициализация схемы

```js
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}
```

---

### 4.3 Безопасность БД

* параметризованные SQL-запросы
* привязка данных к `user_id`
* `ON DELETE CASCADE`
* нет прямого доступа извне (через backend)

---

## 5. Аутентификация и безопасность

### 5.1 Хеширование паролей

```js
const hash = await bcrypt.hash(password, 10);
```

* bcrypt
* соль
* невозможность восстановления пароля

---

### 5.2 JWT авторизация

```js
const token = jwt.sign(
  { id: user.id, email },
  JWT_SECRET,
  { expiresIn: '1h' }
);
```

Middleware:

```js
module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  req.user = jwt.verify(token, process.env.JWT_SECRET);
  next();
};
```

---

## 6. Тестирование

### 6.1 Используемые инструменты

* Jest
* Supertest

---

### 6.2 Пример теста аутентификации

```js
const request = require('supertest');
const app = require('../index');

describe('Auth API', () => {
  it('POST /api/register → 201', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ email: 'test@mail.com', password: '123456' });

    expect(res.statusCode).toBe(201);
  });
});
```

---

### 6.3 Изоляция тестов

* `NODE_ENV=test`
* БД не используется из production
* сервер не стартует
* тесты запускаются в контейнере

---

## 7. CI/CD и DevOps (ключевой раздел)

### 7.1 GitLab CI

Пример job:

```yaml
test-backend:
  stage: test
  script:
    - docker run --rm -e NODE_ENV=test \
      -v "$PWD/backend:/app" \
      -w /app node:18 \
      sh -c "npm install && npm test"
```

---

### 7.2 Почему тесты в Docker

* исключены зависимости от runner
* нет проблем с `node_modules`
* одинаковая среда везде
* нет root-артефактов на хосте

---

### 7.3 Переменные окружения и environments ⭐

Используется **GitLab Environments**:

* `develop`
* `test`
* `production`

Каждая среда имеет:

* свои секреты
* свои образы
* свои настройки

Пример:

```yaml
environment:
  name: develop
```

---

## 8. Nginx, TLS и сертификаты

### 8.1 Назначение Nginx

* TLS termination
* reverse proxy
* защита backend
* единая точка входа

---

### 8.2 Пример конфигурации

```nginx
server {
  listen 443 ssl;
  server_name notes.example.com;

  ssl_certificate /etc/nginx/certs/fullchain.pem;
  ssl_certificate_key /etc/nginx/certs/privkey.pem;

  location / {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
  }
}
```

---

### 8.3 Сертификаты

* сертификаты вынесены в volume
* доступны только на чтение
* backend не знает о TLS

---

## 9. Docker Compose и хранение данных

### 9.1 PostgreSQL volume

```yaml
volumes:
  - pgdata:/var/lib/postgresql/data
```

Данные **не теряются при перезапуске**.

---

### 9.2 Prometheus и Grafana

```yaml
prometheus:
  volumes:
    - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
```

* конфиг read-only
* данные сохраняются
* мониторинг устойчив

---

## 10. Мониторинг и наблюдаемость

Собираются метрики:

* backend
* PostgreSQL
* Docker
* Host

Используется:

* Prometheus
* Grafana
* node-exporter
* cAdvisor

---

## 11. Итог

Проект реализован с использованием **enterprise-подхода**:

✔ безопасный backend
✔ JWT и bcrypt
✔ unit и интеграционные тесты
✔ CI/CD
✔ environments
✔ Docker
✔ Nginx + TLS
✔ мониторинг
✔ сохранность данных

---

# Django App

Простая инструкция по установке и запуску Django-приложения.

## ⚙️ Требования

- Python 3.10+
- Git

## 🚀 Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/pacific-oo5/backendAPI.git
cd backendAPI

# 2. Создать виртуальное окружение
python -m venv venv
source venv/bin/activate  # для Linux/macOS
venv\Scripts\activate     # для Windows

# 3. Установить зависимости
pip install -r requirements.txt

# 4. Создать .env файл (если нужен) и настроить переменные окружения
# Пример:
# DEBUG=True
# SECRET_KEY=your-secret-key
# DATABASE_URL=...

# 5. Выполнить миграции
python manage.py makemigrations
python manage.py migrate

# 6. Создать суперпользователя (по желанию)
python manage.py createsuperuser

# 7. Запустить сервер
python manage.py runserver
