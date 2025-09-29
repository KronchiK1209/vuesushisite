# 🐘 Настройка PostgreSQL для Sushi Store

## 📋 Обзор

Мы переводим приложение Sushi Store с JSON файлов на полноценную базу данных PostgreSQL с улучшенной безопасностью и производительностью.

## 🔧 Установка PostgreSQL

### Windows
1. Скачайте PostgreSQL с [официального сайта](https://www.postgresql.org/download/windows/)
2. Установите с настройками по умолчанию
3. Запомните пароль для пользователя `postgres`

### macOS
```bash
# Через Homebrew
brew install postgresql
brew services start postgresql

# Или через MacPorts
sudo port install postgresql14
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 🗄️ Настройка базы данных

### 1. Создание базы данных
```sql
-- Подключитесь к PostgreSQL как суперпользователь
sudo -u postgres psql

-- Создайте базу данных
CREATE DATABASE sushi_store;

-- Создайте пользователя (опционально)
CREATE USER sushi_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sushi_store TO sushi_user;

-- Выйдите
\q
```

### 2. Создание схемы
```bash
# Выполните SQL скрипт для создания таблиц
psql -U postgres -d sushi_store -f server/database/schema.sql
```

### 3. Заполнение начальными данными
```bash
# Выполните SQL скрипт с начальными данными
psql -U postgres -d sushi_store -f server/database/seed.sql
```

## ⚙️ Конфигурация

### 1. Создайте файл `.env`
```bash
# Скопируйте пример конфигурации
cp server/env.example .env
```

### 2. Отредактируйте `.env`
```env
# Конфигурация базы данных PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sushi_store
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT секретный ключ (ОБЯЗАТЕЛЬНО измените!)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Настройки безопасности
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=24h

# Настройки сервера
NODE_ENV=development
PORT=3000

# CORS настройки
CORS_ORIGIN=http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📦 Установка зависимостей

```bash
# Установите новые зависимости
npm install
```

## 🚀 Запуск

### 1. Миграция данных из JSON
```bash
# Перенесите данные из db.json в PostgreSQL
node server/scripts/migrate.js
```

### 2. Запуск сервера с PostgreSQL
```bash
# Запустите новый сервер
node server/server-pg.js
```

## 🔒 Улучшения безопасности

### ✅ Что исправлено:

1. **Хеширование паролей**
   - Используется bcrypt с 12 раундами
   - Пароли никогда не хранятся в открытом виде

2. **JWT токены**
   - Безопасные токены с временем жизни
   - Хранение сессий в базе данных
   - Возможность отзыва токенов

3. **Rate Limiting**
   - Ограничение количества запросов
   - Защита от брутфорса

4. **Helmet.js**
   - Защита HTTP заголовков
   - Предотвращение XSS атак

5. **CORS настройки**
   - Ограничение доменов
   - Защита от CSRF

6. **Валидация данных**
   - Проверка входных данных
   - Защита от SQL инъекций

## 📊 Структура базы данных

### Основные таблицы:
- `users` - Пользователи с захешированными паролями
- `products` - Товары с категориями
- `categories` - Категории товаров
- `orders` - Заказы с позициями
- `order_items` - Позиции заказов
- `news` - Новости и статьи
- `reviews` - Отзывы клиентов
- `seo_settings` - SEO настройки
- `category_blocks` - Блоки категорий для главной
- `user_sessions` - Сессии пользователей

### Индексы:
- Оптимизированы для быстрого поиска
- Индексы по часто используемым полям
- Составные индексы для сложных запросов

## 🧪 Тестирование

### Запуск тестов
```bash
# Все тесты (включая security)
node test-runner.js all

# Только security тесты
node test-runner.js security
```

### Тестирование базы данных
```bash
# Проверка подключения
psql -U postgres -d sushi_store -c "SELECT COUNT(*) FROM users;"

# Проверка данных
psql -U postgres -d sushi_store -c "SELECT * FROM products LIMIT 5;"
```

## 🔄 Миграция данных

### Автоматическая миграция
```bash
# Перенос всех данных из JSON в PostgreSQL
node server/scripts/migrate.js
```

### Ручная миграция
1. Создайте резервную копию `db.json`
2. Запустите скрипт миграции
3. Проверьте данные в базе
4. Запустите новый сервер

## 📈 Производительность

### Оптимизации:
- Пул соединений с базой данных
- Индексы для быстрого поиска
- Кэширование запросов
- Пагинация результатов

### Мониторинг:
- Логирование запросов
- Отслеживание производительности
- Мониторинг ошибок

## 🛠️ Разработка

### Структура проекта:
```
server/
├── config/
│   └── database.js          # Конфигурация БД
├── models/
│   ├── User.js             # Модель пользователя
│   ├── Product.js          # Модель товара
│   ├── Category.js         # Модель категории
│   └── Order.js            # Модель заказа
├── middleware/
│   └── auth.js             # Middleware аутентификации
├── services/
│   └── authService.js      # Сервис аутентификации
├── database/
│   ├── schema.sql          # Схема БД
│   └── seed.sql            # Начальные данные
├── scripts/
│   └── migrate.js          # Скрипт миграции
└── server-pg.js            # Сервер с PostgreSQL
```

## 🚨 Важные замечания

### Безопасность:
1. **ОБЯЗАТЕЛЬНО** измените `JWT_SECRET` в `.env`
2. Используйте сильные пароли для базы данных
3. Ограничьте доступ к базе данных
4. Регулярно обновляйте зависимости

### Продакшен:
1. Используйте HTTPS
2. Настройте SSL для PostgreSQL
3. Используйте переменные окружения
4. Настройте мониторинг
5. Создайте резервные копии

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи сервера
2. Убедитесь в правильности конфигурации
3. Проверьте подключение к базе данных
4. Запустите тесты безопасности

## 🎉 Результат

После настройки PostgreSQL вы получите:

- ✅ **Безопасное хранение паролей** (bcrypt)
- ✅ **JWT аутентификация** с сессиями
- ✅ **Rate limiting** защита
- ✅ **Валидация данных**
- ✅ **Оптимизированные запросы**
- ✅ **Масштабируемость**
- ✅ **Резервное копирование**
- ✅ **Мониторинг**

**Ваше приложение готово к продакшену!** 🚀
