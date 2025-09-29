/**
 * E2E тесты для приложения Sushi Store
 * Тестируем полный пользовательский сценарий
 */

describe('Sushi Store E2E тесты', () => {
  
  beforeEach(() => {
    // Мокаем API ответы для E2E тестов
    cy.intercept('GET', '/api/products', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: 'Ролл Калифорния',
          description: 'С крабом и авокадо',
          price: 350,
          category: 'Роллы',
          image: 'california.jpg',
          hit: true
        },
        {
          id: 2,
          name: 'Суши с лососем',
          description: 'Свежий лосось',
          price: 200,
          category: 'Суши',
          image: 'salmon.jpg',
          hit: false
        }
      ]
    }).as('getProducts');

    cy.intercept('GET', '/api/categories', {
      statusCode: 200,
      body: [
        { id: 'cat1', name: 'Роллы', image: 'rolls.jpg' },
        { id: 'cat2', name: 'Суши', image: 'sushi.jpg' }
      ]
    }).as('getCategories');

    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: {
        token: 'mock-token',
        user: { id: 'admin1', role: 'admin' }
      }
    }).as('login');
  });

  describe('Главная страница', () => {
    it('должна отображать анимацию загрузки', () => {
      cy.visit('/');
      
      // Проверяем наличие анимации загрузки
      cy.get('.loading-overlay').should('be.visible');
      cy.get('.sushi-animation').should('be.visible');
      cy.get('.sushi-piece').should('have.length', 8);
      cy.get('.chopstick').should('have.length', 2);
      
      // Ждем завершения загрузки
      cy.get('.loading-overlay', { timeout: 10000 }).should('not.exist');
    });

    it('должна отображать товары после загрузки', () => {
      cy.visit('/');
      
      // Ждем загрузки товаров
      cy.wait('@getProducts');
      cy.wait('@getCategories');
      
      // Проверяем отображение товаров
      cy.get('.product-card').should('have.length.at.least', 1);
      cy.contains('Ролл Калифорния').should('be.visible');
      cy.contains('350,00 ₽').should('be.visible');
    });

    it('должна фильтровать товары по категориям', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      cy.wait('@getCategories');
      
      // Проверяем фильтры категорий
      cy.get('button').contains('Роллы').click();
      cy.get('.product-card').should('contain', 'Ролл Калифорния');
      
      cy.get('button').contains('Суши').click();
      cy.get('.product-card').should('contain', 'Суши с лососем');
    });

    it('должна показывать хиты продаж', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Нажимаем на фильтр "Хиты"
      cy.get('button').contains('Хиты').click();
      
      // Проверяем, что отображаются только хиты
      cy.get('.product-card').should('contain', 'Ролл Калифорния');
      cy.get('.fa-star').should('be.visible');
    });
  });

  describe('Корзина', () => {
    it('должна добавлять товары в корзину', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Добавляем товар в корзину
      cy.get('.product-card').first().find('button').contains('Заказать').click();
      
      // Проверяем, что появилась плавающая кнопка корзины
      cy.get('.fixed.bottom-6.right-6').should('be.visible');
      cy.get('.bg-red-500').should('contain', '1');
    });

    it('должна отображать превью корзины', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Добавляем товар в корзину
      cy.get('.product-card').first().find('button').contains('Заказать').click();
      
      // Наводим на плавающую кнопку корзины
      cy.get('.fixed.bottom-6.right-6').trigger('mouseover');
      
      // Проверяем превью корзины
      cy.get('.cart-preview').should('be.visible');
      cy.get('.cart-preview').should('contain', 'Ролл Калифорния');
    });

    it('должна переходить на страницу корзины', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Добавляем товар в корзину
      cy.get('.product-card').first().find('button').contains('Заказать').click();
      
      // Переходим в корзину
      cy.get('a[href="/cart"]').click();
      
      // Проверяем, что мы на странице корзины
      cy.url().should('include', '/cart');
      cy.get('.cart-item').should('contain', 'Ролл Калифорния');
    });
  });

  describe('Модальное окно товара', () => {
    it('должна открывать модальное окно при клике на товар', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Кликаем на товар
      cy.get('.product-card').first().click();
      
      // Проверяем, что открылось модальное окно
      cy.get('.modal').should('be.visible');
      cy.get('.modal').should('contain', 'Ролл Калифорния');
      cy.get('.modal').should('contain', 'С крабом и авокадо');
    });

    it('должна закрывать модальное окно', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Открываем модальное окно
      cy.get('.product-card').first().click();
      cy.get('.modal').should('be.visible');
      
      // Закрываем модальное окно
      cy.get('.modal .close-button').click();
      cy.get('.modal').should('not.exist');
    });

    it('должна добавлять товар в корзину из модального окна', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Открываем модальное окно
      cy.get('.product-card').first().click();
      cy.get('.modal').should('be.visible');
      
      // Добавляем товар в корзину
      cy.get('.modal button').contains('Заказать').click();
      
      // Проверяем, что товар добавлен в корзину
      cy.get('.fixed.bottom-6.right-6').should('be.visible');
      cy.get('.bg-red-500').should('contain', '1');
    });
  });

  describe('Админ панель', () => {
    it('должна выполнять вход в админ панель', () => {
      cy.visit('/login');
      
      // Заполняем форму входа
      cy.get('input[type="tel"]').type('+7 (999) 123-45-67');
      cy.get('input[type="password"]').type('admin123');
      
      // Отправляем форму
      cy.get('button[type="submit"]').click();
      cy.wait('@login');
      
      // Проверяем, что появилась ссылка на админ панель
      cy.contains('Admin').should('be.visible');
    });

    it('должна переходить в админ панель', () => {
      // Сначала входим в систему
      cy.visit('/login');
      cy.get('input[type="tel"]').type('+7 (999) 123-45-67');
      cy.get('input[type="password"]').type('admin123');
      cy.get('button[type="submit"]').click();
      cy.wait('@login');
      
      // Переходим в админ панель
      cy.contains('Admin').click();
      
      // Проверяем, что мы в админ панели
      cy.url().should('include', '/admin');
      cy.contains('Админ панель').should('be.visible');
    });

    it('должна управлять товарами в админ панели', () => {
      // Мокаем API для админ панели
      cy.intercept('GET', '/api/products', { fixture: 'products.json' }).as('getAdminProducts');
      cy.intercept('POST', '/api/products', { statusCode: 201 }).as('createProduct');
      cy.intercept('PUT', '/api/products/*', { statusCode: 200 }).as('updateProduct');
      cy.intercept('DELETE', '/api/products/*', { statusCode: 200 }).as('deleteProduct');
      
      // Входим в админ панель
      cy.visit('/login');
      cy.get('input[type="tel"]').type('+7 (999) 123-45-67');
      cy.get('input[type="password"]').type('admin123');
      cy.get('button[type="submit"]').click();
      cy.wait('@login');
      
      cy.contains('Admin').click();
      cy.contains('Товары').click();
      
      // Проверяем отображение товаров
      cy.get('.product-item').should('have.length.at.least', 1);
      
      // Добавляем новый товар
      cy.get('button').contains('Добавить товар').click();
      cy.get('input[name="name"]').type('Новый ролл');
      cy.get('input[name="price"]').type('400');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@createProduct');
      cy.contains('Новый ролл').should('be.visible');
    });
  });

  describe('Навигация', () => {
    it('должна переключаться между страницами', () => {
      cy.visit('/');
      
      // Переходим на страницу новостей
      cy.contains('Новости').click();
      cy.url().should('include', '/news');
      
      // Возвращаемся на главную
      cy.contains('Меню').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('должна отображать правильный заголовок страницы', () => {
      cy.visit('/');
      cy.title().should('contain', 'Sushi Store');
      
      cy.visit('/news');
      cy.title().should('contain', 'Новости');
      
      cy.visit('/cart');
      cy.title().should('contain', 'Корзина');
    });
  });

  describe('Адаптивность', () => {
    it('должна корректно отображаться на мобильных устройствах', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Проверяем, что контент адаптируется под мобильный экран
      cy.get('.product-card').should('be.visible');
      cy.get('button').contains('Заказать').should('be.visible');
    });

    it('должна скрывать некоторые элементы на мобильных', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      
      // Проверяем, что некоторые элементы скрыты на мобильных
      cy.get('.hidden.md\\:inline-block').should('not.be.visible');
    });
  });

  describe('Производительность', () => {
    it('должна загружаться быстро', () => {
      const startTime = Date.now();
      
      cy.visit('/');
      cy.get('.product-card', { timeout: 5000 }).should('be.visible');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(3000); // Менее 3 секунд
    });

    it('должна кэшировать ресурсы', () => {
      cy.visit('/');
      cy.wait('@getProducts');
      
      // Перезагружаем страницу
      cy.reload();
      
      // Проверяем, что данные загружаются из кэша
      cy.get('.product-card').should('be.visible');
    });
  });
});
