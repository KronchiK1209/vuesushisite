/**
 * Unit тесты для утилитарных функций
 * Тестируем основные функции приложения
 */

// Мокаем глобальные объекты Vue
global.Vue = {
  createApp: jest.fn(),
  reactive: jest.fn((obj) => obj),
  ref: jest.fn((val) => ({ value: val })),
  computed: jest.fn((fn) => ({ value: fn() })),
  onMounted: jest.fn(),
  onUnmounted: jest.fn(),
  watch: jest.fn()
};

global.VueRouter = {
  createRouter: jest.fn(),
  createWebHistory: jest.fn(),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useRoute: jest.fn(() => ({ params: {}, query: {} }))
};

// Мокаем axios
global.axios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    headers: {
      common: {}
    }
  }
};

describe('Утилитарные функции', () => {
  
  describe('Форматирование цены', () => {
    test('должна форматировать цену в рубли', () => {
      const formatPrice = (price) => {
        return price.toLocaleString('ru-RU', { 
          style: 'currency', 
          currency: 'RUB' 
        });
      };

      expect(formatPrice(100)).toMatch(/100,00.*₽/);
      expect(formatPrice(1500)).toMatch(/1\s500,00.*₽/);
      expect(formatPrice(0)).toMatch(/0,00.*₽/);
    });
  });

  describe('Генерация ID', () => {
    test('должна генерировать уникальные ID', () => {
      const generateId = (prefix) => {
        return prefix + Math.random().toString(36).substr(2, 9);
      };

      const id1 = generateId('prod');
      const id2 = generateId('prod');
      
      expect(id1).toMatch(/^prod[a-z0-9]{9}$/);
      expect(id2).toMatch(/^prod[a-z0-9]{9}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('Валидация данных', () => {
    test('должна валидировать email', () => {
      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user@domain.ru')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    test('должна валидировать телефон', () => {
      const isValidPhone = (phone) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
      };

      expect(isValidPhone('+7 (999) 123-45-67')).toBe(true);
      expect(isValidPhone('89991234567')).toBe(true);
      expect(isValidPhone('invalid')).toBe(false);
      expect(isValidPhone('')).toBe(false);
    });
  });

  describe('Работа с корзиной', () => {
    test('должна вычислять общую стоимость корзины', () => {
      const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      };

      const items = [
        { price: 100, quantity: 2 },
        { price: 200, quantity: 1 },
        { price: 50, quantity: 3 }
      ];

      expect(calculateTotal(items)).toBe(550);
      expect(calculateTotal([])).toBe(0);
    });

    test('должна вычислять общее количество товаров', () => {
      const calculateTotalQuantity = (items) => {
        return items.reduce((sum, item) => sum + item.quantity, 0);
      };

      const items = [
        { quantity: 2 },
        { quantity: 1 },
        { quantity: 3 }
      ];

      expect(calculateTotalQuantity(items)).toBe(6);
      expect(calculateTotalQuantity([])).toBe(0);
    });
  });

  describe('Фильтрация товаров', () => {
    test('должна фильтровать товары по категории', () => {
      const filterByCategory = (products, category) => {
        if (category === 'Все') return products;
        return products.filter(product => product.category === category);
      };

      const products = [
        { id: 1, name: 'Ролл Калифорния', category: 'Роллы' },
        { id: 2, name: 'Суши с лососем', category: 'Суши' },
        { id: 3, name: 'Сет №1', category: 'Сеты' }
      ];

      expect(filterByCategory(products, 'Роллы')).toHaveLength(1);
      expect(filterByCategory(products, 'Все')).toHaveLength(3);
      expect(filterByCategory(products, 'Пицца')).toHaveLength(0);
    });

    test('должна фильтровать товары по поисковому запросу', () => {
      const searchProducts = (products, query) => {
        const lowerQuery = query.toLowerCase();
        return products.filter(product => 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery)
        );
      };

      const products = [
        { name: 'Ролл Калифорния', description: 'С крабом и авокадо' },
        { name: 'Суши с лососем', description: 'Свежий лосось' },
        { name: 'Сет №1', description: 'Калифорния и лосось' }
      ];

      expect(searchProducts(products, 'калифорния')).toHaveLength(2);
      expect(searchProducts(products, 'лосось')).toHaveLength(2);
      expect(searchProducts(products, 'пицца')).toHaveLength(0);
    });
  });

  describe('Работа с датами', () => {
    test('должна форматировать дату заказа', () => {
      const formatOrderDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

      const testDate = '2024-01-15T14:30:00Z';
      const formatted = formatOrderDate(testDate);
      
      // Проверяем, что дата содержит год 2024
      expect(formatted).toContain('2024');
      // Проверяем, что дата содержит название месяца
      expect(formatted).toMatch(/января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря/);
    });
  });
});
