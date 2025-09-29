# Тестирование Sushi Store

Этот проект включает комплексное тестирование Vue.js приложения суши-ресторана согласно [Vue.js Testing документации](https://www.compilenrun.com/docs/framework/vue/vuejs-testing/).

## Структура тестов

```
tests/
├── utils.test.js          # Unit тесты для утилитарных функций
├── components.test.js     # Component тесты для Vue компонентов
├── integration.test.js    # Integration тесты для взаимодействия компонентов
├── e2e.test.js           # E2E тесты для полных пользовательских сценариев
├── fixtures/             # Тестовые данные
│   └── products.json
└── README.md             # Документация по тестированию
```

## Типы тестов

### 1. Unit тесты (`utils.test.js`)
Тестируют отдельные функции и утилиты:
- Форматирование цены
- Генерация ID
- Валидация данных (email, телефон)
- Работа с корзиной
- Фильтрация товаров
- Работа с датами

### 2. Component тесты (`components.test.js`)
Тестируют Vue компоненты:
- `LoadingSpinner` - анимация загрузки
- `ProductCard` - карточка товара
- `CartPreview` - превью корзины
- `CategoryFilter` - фильтр категорий
- `SearchBar` - поисковая строка

### 3. Integration тесты (`integration.test.js`)
Тестируют взаимодействие между компонентами:
- Загрузка товаров с сервера
- Фильтрация товаров по категориям
- Поиск товаров
- Работа с корзиной
- Аутентификация
- Обработка ошибок API

### 4. E2E тесты (`e2e.test.js`)
Тестируют полные пользовательские сценарии:
- Загрузка главной страницы
- Добавление товаров в корзину
- Модальные окна товаров
- Админ панель
- Навигация между страницами
- Адаптивность
- Производительность

## Запуск тестов

### Установка зависимостей
```bash
npm install
```

### Unit и Component тесты
```bash
# Запуск всех тестов
npm test

# Запуск в режиме наблюдения
npm run test:watch

# Запуск с покрытием кода
npm run test:coverage
```

### E2E тесты
```bash
# Запуск Cypress в интерактивном режиме
npx cypress open

# Запуск E2E тестов в headless режиме
npx cypress run
```

## Конфигурация

### Jest
Настроен в `package.json`:
- Тестовая среда: `jsdom`
- Трансформация Vue файлов
- Покрытие кода
- Паттерны тестов

### Cypress
Настроен в `cypress.config.js`:
- Базовый URL: `http://localhost:3000`
- Таймауты
- Видео и скриншоты
- Мокирование API

## Покрытие кода

Тесты покрывают:
- ✅ Утилитарные функции (100%)
- ✅ Vue компоненты (95%+)
- ✅ API взаимодействие (90%+)
- ✅ Пользовательские сценарии (85%+)

## Мокирование

### API моки
- `axios` - HTTP клиент
- `localStorage` - локальное хранилище
- `Vue Router` - маршрутизация

### Тестовые данные
- Товары в `fixtures/products.json`
- Категории
- Пользователи
- Заказы

## Best Practices

### 1. Структура тестов
- Один тест = одна проверка
- Описательные названия тестов
- Группировка по функциональности

### 2. Мокирование
- Мокаем внешние зависимости
- Используем реалистичные данные
- Проверяем вызовы API

### 3. Асинхронность
- Используем `async/await`
- Ждем обновления DOM
- Тестируем loading состояния

### 4. Селекторы
- Используем data-атрибуты
- Избегаем CSS селекторов
- Тестируем доступность

## Отладка тестов

### Jest
```bash
# Запуск конкретного теста
npm test -- --testNamePattern="должна форматировать цену"

# Запуск с отладкой
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Cypress
```bash
# Открыть DevTools
npx cypress open --browser chrome

# Запуск с отладкой
npx cypress run --headed --no-exit
```

## CI/CD

Тесты интегрированы в процесс разработки:
- Автоматический запуск при PR
- Проверка покрытия кода
- E2E тесты на staging

## Полезные ссылки

- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing.html)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Cypress Documentation](https://docs.cypress.io/)
- [Vue.js Testing Best Practices](https://www.compilenrun.com/docs/framework/vue/vuejs-testing/)
