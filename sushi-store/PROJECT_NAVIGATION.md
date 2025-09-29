# Навигация по проекту "Точка суши и пиццы"

## Структура проекта

### 📁 Корневые файлы
- `package.json` - зависимости и скрипты проекта
- `test-runner.js` - запуск тестов (все типы тестов)
- `jest.config.crud.js` - конфигурация Jest для CRUD тестов
- `cypress.config.js` - конфигурация Cypress для E2E тестов

### 📁 client/ - Frontend (Vue.js)
- `main.js` - основной файл с компонентами Vue (облегченный)
  - Глобальное состояние (cart, auth, globalLoading)
  - Базовые компоненты (LoadingSpinner, Header, Footer)
  - Маршрутизация (Vue Router)
- `index.html` - главная HTML страница
- `style.css` - основные стили

#### 📁 client/modules/ — Модульное разбиение компонентов
- `cartCheckout.js` — корзина и оформление заказа
  - Экспортирует: `CartView`, `CheckoutView`
- `home.js` — главная страница
  - Экспортирует: `HomeView`
- `admin.js` — все админские представления
  - Экспортирует: `LoginView`, `AdminHomeView`, `AdminProductsView`, `AdminOrdersView`, `AdminNewsView`, `AdminCategoriesView`, `AdminReviewsView`, `AdminSEOView`, `AdminCategoryBlocksView`, `AdminOrderEditView`

Примечания:
- Модули созданы для лучшей организации кода, но пока не подключены через ES-модули
- Все компоненты остаются в `main.js` для стабильной работы
- Модули готовы к подключению когда сервер будет настроен для ES-модулей

### 📁 server/ - Backend (Node.js + PostgreSQL)
- `server-pg.js` - основной сервер с API endpoints
  - Валидация данных (`validateAndSanitizeInput`)
  - Аутентификация и авторизация
  - CRUD операции для всех сущностей
  - SEO endpoints (`/api/seo`, `/robots.txt`, `/sitemap.xml`)
- `models/` - модели данных
  - `Product.js` - товары
  - `Category.js` - категории
  - `Order.js` - заказы
  - `User.js` - пользователи
  - `News.js` - новости
  - `Review.js` - отзывы
  - `SEO.js` - SEO настройки
  - `CategoryBlock.js` - блоки категорий
- `database/` - схема базы данных
  - `schema.sql` - структура PostgreSQL

### 📁 tests/ - Тесты
- `crud-products.test.js` - тесты товаров
- `crud-categories.test.js` - тесты категорий
- `crud-orders.test.js` - тесты заказов
- `crud-news.test.js` - тесты новостей
- `crud-reviews.test.js` - тесты отзывов
- `crud-seo.test.js` - тесты SEO
- `crud-category-blocks.test.js` - тесты блоков категорий

## Ключевые функции

### Frontend (client/main.js)
- `submitOrder()` - создание заказа с доставкой
- `togglePaidStatus()` - изменение статуса оплаты
- `saveOrderChanges()` - сохранение изменений заказа
- `editProduct()` / `saveProduct()` - редактирование товаров
- `fetchSEOData()` - загрузка SEO настроек

### Backend (server/server-pg.js)
- `validateAndSanitizeInput()` - валидация входных данных
- `logSecurityEvent()` - логирование безопасности
- API endpoints для всех CRUD операций
- Автоматическое создание гостевых пользователей

## База данных (PostgreSQL)
- `users` - пользователи и админы
- `products` - товары с категориями
- `categories` - категории товаров
- `orders` - заказы с доставкой
- `order_items` - позиции в заказах
- `news` - новости
- `reviews` - отзывы
- `seo_settings` - SEO настройки
- `category_blocks` - блоки категорий

## Запуск проекта
1. `cd server && node server-pg.js` - запуск сервера
2. Открыть `http://localhost:3000` - главная страница
3. `http://localhost:3000/admin` - админ панель
4. `npm test` - запуск всех тестов

## Особенности
- Полная CRUD функциональность для всех сущностей
- SEO оптимизация (meta теги, Open Graph, Twitter Cards, VK Cards)
- Динамические robots.txt и sitemap.xml
- Безопасность (валидация, логирование, rate limiting)
- Адаптивный дизайн
- Поддержка доставки "как можно скорее" и по расписанию
