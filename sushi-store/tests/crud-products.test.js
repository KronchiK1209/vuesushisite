const axios = require('axios');

// Настройка axios для тестов
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 5000;

describe('CRUD Operations - Products', () => {
  let adminToken = '';
  let testCategoryId = '';
  let testProductId = '';

  beforeAll(async () => {
    // Логинимся как админ
    try {
      const loginResponse = await axios.post('/api/login', {
        phone: '+7 (999) 123-45-67',
        password: 'admin123'
      });
      adminToken = loginResponse.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    } catch (error) {
      throw new Error('Failed to login as admin: ' + error.message);
    }

    // Создаем тестовую категорию
    try {
      const categoryResponse = await axios.post('/api/categories', {
        name: 'Тестовая категория для продуктов',
        image: 'test-category.jpg',
        description: 'Категория для тестирования продуктов'
      });
      testCategoryId = categoryResponse.data.id;
    } catch (error) {
      throw new Error('Failed to create test category: ' + error.message);
    }
  });

  afterAll(async () => {
    // Удаляем тестовую категорию
    if (testCategoryId) {
      try {
        await axios.delete(`/api/categories/${testCategoryId}`);
      } catch (error) {
        console.warn('Failed to cleanup test category:', error.message);
      }
    }
  });

  describe('CREATE - Создание продуктов', () => {
    test('должен создать новый продукт с валидными данными', async () => {
      const productData = {
        name: 'Тестовый продукт',
        description: 'Описание тестового продукта',
        price: 500,
        image: 'test-product.jpg',
        category_id: testCategoryId,
        available: true
      };

      const response = await axios.post('/api/products', productData);
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: productData.image,
        category_id: productData.category_id,
        available: productData.available
      });
      
      testProductId = response.data.id;
    });

    test('должен создать продукт с минимальными данными', async () => {
      const productData = {
        name: 'Минимальный продукт',
        description: 'Минимальное описание',
        price: 100,
        category_id: testCategoryId
      };

      const response = await axios.post('/api/products', productData);
      
      expect(response.status).toBe(201);
      expect(response.data.name).toBe(productData.name);
      expect(response.data.available).toBe(true); // значение по умолчанию
    });

    test('должен отклонить создание продукта без обязательных полей', async () => {
      const invalidData = {
        description: 'Описание без названия',
        price: 500
        // отсутствует name и category_id
      };

      await expect(axios.post('/api/products', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание продукта с невалидной ценой', async () => {
      const invalidData = {
        name: 'Продукт с невалидной ценой',
        description: 'Описание',
        price: -100, // отрицательная цена
        category_id: testCategoryId
      };

      await expect(axios.post('/api/products', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });
  });

  describe('READ - Получение продуктов', () => {
    test('должен получить список всех продуктов', async () => {
      const response = await axios.get('/api/products');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('должен получить продукт по ID', async () => {
      // Создаем новый продукт для тестирования получения по ID
      const productData = {
        name: 'Продукт для тестирования получения',
        description: 'Описание для тестирования',
        price: 300,
        category_id: testCategoryId
      };

      const createResponse = await axios.post('/api/products', productData);
      const productId = createResponse.data.id;

      const response = await axios.get(`/api/products/${productId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(productId);
      expect(response.data.name).toBe(productData.name);

      // Очищаем - удаляем созданный продукт
      await axios.delete(`/api/products/${productId}`);
    });

    test('должен вернуть 404 для несуществующего продукта', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.get(`/api/products/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('UPDATE - Обновление продуктов', () => {
    test('должен обновить все поля продукта', async () => {
      if (!testProductId) {
        throw new Error('Test product ID not available');
      }

      const updateData = {
        name: 'Обновленный продукт',
        description: 'Обновленное описание',
        price: 750,
        image: 'updated-product.jpg',
        available: false
      };

      const response = await axios.put(`/api/products/${testProductId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updateData);
    });

    test('должен обновить только название продукта', async () => {
      if (!testProductId) {
        throw new Error('Test product ID not available');
      }

      const updateData = {
        name: 'Только название обновлено'
      };

      const response = await axios.put(`/api/products/${testProductId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updateData.name);
    });

    test('должен обновить только цену продукта', async () => {
      if (!testProductId) {
        throw new Error('Test product ID not available');
      }

      const updateData = {
        price: 999
      };

      const response = await axios.put(`/api/products/${testProductId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.price).toBe(updateData.price);
    });

    test('должен обновить только статус доступности', async () => {
      if (!testProductId) {
        throw new Error('Test product ID not available');
      }

      const updateData = {
        available: true
      };

      const response = await axios.put(`/api/products/${testProductId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.available).toBe(updateData.available);
    });

    test('должен отклонить обновление с невалидными данными', async () => {
      // Создаем новый продукт для тестирования валидации
      const productData = {
        name: 'Продукт для тестирования валидации',
        description: 'Описание для тестирования',
        price: 300,
        category_id: testCategoryId
      };

      const createResponse = await axios.post('/api/products', productData);
      const productId = createResponse.data.id;

      const invalidData = {
        price: -50 // отрицательная цена
      };

      await expect(axios.put(`/api/products/${productId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });

      // Очищаем - удаляем созданный продукт
      await axios.delete(`/api/products/${productId}`);
    });

    test('должен вернуть 404 для обновления несуществующего продукта', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.put(`/api/products/${fakeId}`, { name: 'Новое название' }))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('DELETE - Удаление продуктов', () => {
    test('должен удалить существующий продукт', async () => {
      if (!testProductId) {
        throw new Error('Test product ID not available');
      }

      const response = await axios.delete(`/api/products/${testProductId}`);
      
      expect(response.status).toBe(200);
      
      // Проверяем, что продукт действительно удален
      await expect(axios.get(`/api/products/${testProductId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });

    test('должен вернуть 404 для удаления несуществующего продукта', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.delete(`/api/products/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('AUTHORIZATION - Авторизация', () => {
    test('должен отклонить создание продукта без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.post('/api/products', {
        name: 'Неавторизованный продукт',
        description: 'Описание',
        price: 100,
        category_id: testCategoryId
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить обновление продукта без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.put(`/api/products/${testCategoryId}`, {
        name: 'Неавторизованное обновление'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить удаление продукта без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.delete(`/api/products/${testCategoryId}`))
        .rejects.toMatchObject({
          response: {
            status: 401
          }
        });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });
  });
});
