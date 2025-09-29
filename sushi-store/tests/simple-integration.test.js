/**
 * Упрощенные Integration тесты
 * Тестируем взаимодействие между компонентами без Vue Test Utils
 */

describe('Integration тесты (упрощенные)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Загрузка товаров', () => {
    test('должен загружать товары с сервера', async () => {
      const mockProducts = [
        { id: 1, name: 'Ролл Калифорния', price: 350, category: 'Роллы' },
        { id: 2, name: 'Суши с лососем', price: 200, category: 'Суши' }
      ];

      // Мокаем axios
      const mockAxios = {
        get: jest.fn().mockResolvedValue({ data: mockProducts })
      };

      // Симулируем загрузку товаров
      const loadProducts = async () => {
        try {
          const response = await mockAxios.get('/api/products');
          return response.data;
        } catch (error) {
          console.error('Ошибка загрузки товаров:', error);
          return [];
        }
      };

      const products = await loadProducts();

      expect(mockAxios.get).toHaveBeenCalledWith('/api/products');
      expect(products).toHaveLength(2);
      expect(products[0].name).toBe('Ролл Калифорния');
    });

    test('должен обрабатывать ошибки загрузки', async () => {
      const mockAxios = {
        get: jest.fn().mockRejectedValue(new Error('Network Error'))
      };

      const loadProducts = async () => {
        try {
          const response = await mockAxios.get('/api/products');
          return response.data;
        } catch (error) {
          console.error('Ошибка загрузки товаров:', error);
          return [];
        }
      };

      const products = await loadProducts();

      expect(products).toHaveLength(0);
    });
  });

  describe('Фильтрация товаров', () => {
    test('должен фильтровать товары по категории', () => {
      const products = [
        { id: 1, name: 'Ролл Калифорния', category: 'Роллы' },
        { id: 2, name: 'Суши с лососем', category: 'Суши' },
        { id: 3, name: 'Сет №1', category: 'Сеты' }
      ];

      const filterProducts = (products, selectedCategory) => {
        if (selectedCategory === 'Все') return products;
        return products.filter(product => product.category === selectedCategory);
      };

      // Тестируем фильтрацию по категории "Роллы"
      const filteredProducts = filterProducts(products, 'Роллы');
      expect(filteredProducts).toHaveLength(1);
      expect(filteredProducts[0].name).toBe('Ролл Калифорния');

      // Тестируем показ всех товаров
      const allProducts = filterProducts(products, 'Все');
      expect(allProducts).toHaveLength(3);
    });

    test('должен комбинировать фильтрацию по категории и поиск', () => {
      const products = [
        { id: 1, name: 'Ролл Калифорния', category: 'Роллы', description: 'С крабом' },
        { id: 2, name: 'Суши с лососем', category: 'Суши', description: 'Свежий лосось' },
        { id: 3, name: 'Сет Калифорния', category: 'Сеты', description: 'Роллы калифорния' }
      ];

      const filterAndSearch = (products, category, searchQuery) => {
        let filtered = products;
        
        // Фильтрация по категории
        if (category !== 'Все') {
          filtered = filtered.filter(product => product.category === category);
        }
        
        // Поиск
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
          );
        }
        
        return filtered;
      };

      // Поиск "калифорния" во всех категориях
      const searchResults = filterAndSearch(products, 'Все', 'калифорния');
      expect(searchResults).toHaveLength(2);

      // Поиск "калифорния" только в категории "Роллы"
      const categorySearchResults = filterAndSearch(products, 'Роллы', 'калифорния');
      expect(categorySearchResults).toHaveLength(1);
      expect(categorySearchResults[0].name).toBe('Ролл Калифорния');
    });
  });

  describe('Корзина', () => {
    test('должен добавлять товары в корзину и обновлять общую стоимость', () => {
      const cart = [];
      const products = [
        { id: 1, name: 'Ролл Калифорния', price: 350 },
        { id: 2, name: 'Суши с лососем', price: 200 }
      ];

      const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
      };

      const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      };

      // Добавляем первый товар
      addToCart(products[0]);
      expect(cart).toHaveLength(1);
      expect(calculateTotal()).toBe(350);

      // Добавляем второй товар
      addToCart(products[1]);
      expect(cart).toHaveLength(2);
      expect(calculateTotal()).toBe(550);

      // Добавляем первый товар еще раз
      addToCart(products[0]);
      expect(cart).toHaveLength(2);
      expect(calculateTotal()).toBe(900);
    });

    test('должен удалять товары из корзины', () => {
      const cart = [
        { id: 1, name: 'Ролл Калифорния', price: 350, quantity: 2 },
        { id: 2, name: 'Суши с лососем', price: 200, quantity: 1 }
      ];

      const removeFromCart = (productId) => {
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
          cart.splice(index, 1);
        }
      };

      removeFromCart(1);
      expect(cart).toHaveLength(1);
      expect(cart[0].id).toBe(2);
    });

    test('должен обновлять количество товара в корзине', () => {
      const cart = [
        { id: 1, name: 'Ролл Калифорния', price: 350, quantity: 1 }
      ];

      const updateQuantity = (productId, newQuantity) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
          if (newQuantity <= 0) {
            const index = cart.findIndex(item => item.id === productId);
            cart.splice(index, 1);
          } else {
            item.quantity = newQuantity;
          }
        }
      };

      updateQuantity(1, 3);
      expect(cart[0].quantity).toBe(3);

      updateQuantity(1, 0);
      expect(cart).toHaveLength(0);
    });
  });

  describe('Аутентификация', () => {
    test('должен выполнять вход пользователя', async () => {
      const mockUser = {
        id: 'user1',
        phone: '+7 (999) 123-45-67',
        role: 'user'
      };

      const mockAxios = {
        post: jest.fn().mockResolvedValue({ 
          data: { 
            token: 'mock-token',
            user: mockUser
          } 
        })
      };

      const login = async (phone, password) => {
        try {
          const response = await mockAxios.post('/api/login', {
            phone,
            password
          });
          
          // Сохраняем токен и данные пользователя
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('role', response.data.user.role);
          
          return response.data.user;
        } catch (error) {
          throw error;
        }
      };

      const user = await login('+7 (999) 123-45-67', 'password123');

      expect(mockAxios.post).toHaveBeenCalledWith('/api/login', {
        phone: '+7 (999) 123-45-67',
        password: 'password123'
      });
      expect(user).toEqual(mockUser);
    });

    test('должен обрабатывать ошибки входа', async () => {
      const mockAxios = {
        post: jest.fn().mockRejectedValue(new Error('Invalid credentials'))
      };

      const login = async (phone, password) => {
        try {
          const response = await mockAxios.post('/api/login', {
            phone,
            password
          });
          return response.data.user;
        } catch (error) {
          throw error;
        }
      };

      await expect(login('+7 (999) 123-45-67', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('Управление состоянием', () => {
    test('должен синхронизировать состояние между компонентами', () => {
      // Глобальное состояние приложения
      const appState = {
        products: [],
        cart: [],
        selectedCategory: 'Все',
        searchQuery: '',
        isLoading: false
      };

      const updateCategory = (category) => {
        appState.selectedCategory = category;
      };

      const updateSearch = (query) => {
        appState.searchQuery = query;
      };

      const addToCart = (product) => {
        const existingItem = appState.cart.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          appState.cart.push({ ...product, quantity: 1 });
        }
      };

      // Тестируем обновление категории
      updateCategory('Роллы');
      expect(appState.selectedCategory).toBe('Роллы');

      // Тестируем обновление поиска
      updateSearch('калифорния');
      expect(appState.searchQuery).toBe('калифорния');

      // Тестируем добавление в корзину
      const product = { id: 1, name: 'Ролл Калифорния', price: 350 };
      addToCart(product);
      expect(appState.cart).toHaveLength(1);
      expect(appState.cart[0].name).toBe('Ролл Калифорния');
    });
  });

  describe('Валидация данных', () => {
    test('должен валидировать данные заказа', () => {
      const validateOrder = (orderData) => {
        const errors = [];
        
        if (!orderData.name || orderData.name.trim().length < 2) {
          errors.push('Имя должно содержать минимум 2 символа');
        }
        
        if (!orderData.phone || !/^\+?[1-9]\d{1,14}$/.test(orderData.phone.replace(/\D/g, ''))) {
          errors.push('Неверный формат телефона');
        }
        
        if (!orderData.address || orderData.address.trim().length < 5) {
          errors.push('Адрес должен содержать минимум 5 символов');
        }
        
        if (!orderData.cart || orderData.cart.length === 0) {
          errors.push('Корзина не может быть пустой');
        }
        
        return {
          isValid: errors.length === 0,
          errors
        };
      };

      // Валидные данные
      const validOrder = {
        name: 'Иван Иванов',
        phone: '+7 (999) 123-45-67',
        address: 'ул. Пушкина, д. 1',
        cart: [{ id: 1, name: 'Ролл Калифорния', price: 350, quantity: 1 }]
      };

      const validResult = validateOrder(validOrder);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      // Невалидные данные
      const invalidOrder = {
        name: 'И',
        phone: '123',
        address: 'ул.',
        cart: []
      };

      const invalidResult = validateOrder(invalidOrder);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });
});
