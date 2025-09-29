const axios = require('axios');

// Настройка axios для тестов
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 5000;

describe('CRUD Operations - Categories', () => {
  let adminToken = '';
  let testCategoryId = '';

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
  });

  describe('CREATE - Создание категорий', () => {
    test('должен создать новую категорию с валидными данными', async () => {
      const categoryData = {
        name: 'Тестовая категория',
        image: 'test-category.jpg',
        description: 'Описание тестовой категории'
      };

      const response = await axios.post('/api/categories', categoryData);
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        name: categoryData.name,
        image: categoryData.image,
        description: categoryData.description,
        is_active: true // значение по умолчанию
      });
      
      testCategoryId = response.data.id;
    });

    test('должен создать категорию с минимальными данными', async () => {
      const categoryData = {
        name: 'Минимальная категория'
      };

      const response = await axios.post('/api/categories', categoryData);
      
      expect(response.status).toBe(201);
      expect(response.data.name).toBe(categoryData.name);
      expect(response.data.is_active).toBe(true);
    });

    test('должен отклонить создание категории без названия', async () => {
      const invalidData = {
        image: 'test.jpg',
        description: 'Описание без названия'
      };

      await expect(axios.post('/api/categories', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание категории с пустым названием', async () => {
      const invalidData = {
        name: '',
        description: 'Описание'
      };

      await expect(axios.post('/api/categories', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание категории с слишком длинным названием', async () => {
      const invalidData = {
        name: 'A'.repeat(51), // превышает лимит в 50 символов
        description: 'Описание'
      };

      await expect(axios.post('/api/categories', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });
  });

  describe('READ - Получение категорий', () => {
    test('должен получить список всех категорий', async () => {
      const response = await axios.get('/api/categories');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('должен получить категорию по ID', async () => {
      if (!testCategoryId) {
        throw new Error('Test category ID not available');
      }

      const response = await axios.get(`/api/categories/${testCategoryId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testCategoryId);
      expect(response.data.name).toBe('Тестовая категория');
    });

    test('должен вернуть 404 для несуществующей категории', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.get(`/api/categories/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('UPDATE - Обновление категорий', () => {
    test('должен обновить все поля категории', async () => {
      if (!testCategoryId) {
        throw new Error('Test category ID not available');
      }

      const updateData = {
        name: 'Обновленная категория',
        image: 'updated-category.jpg',
        description: 'Обновленное описание категории'
      };

      const response = await axios.put(`/api/categories/${testCategoryId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updateData);
    });

    test('должен обновить только название категории', async () => {
      if (!testCategoryId) {
        throw new Error('Test category ID not available');
      }

      const updateData = {
        name: 'Только название обновлено'
      };

      const response = await axios.put(`/api/categories/${testCategoryId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.name).toBe(updateData.name);
    });

    test('должен обновить только изображение категории', async () => {
      if (!testCategoryId) {
        throw new Error('Test category ID not available');
      }

      const updateData = {
        image: 'new-image.jpg'
      };

      const response = await axios.put(`/api/categories/${testCategoryId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.image).toBe(updateData.image);
    });

    test('должен обновить только описание категории', async () => {
      if (!testCategoryId) {
        throw new Error('Test category ID not available');
      }

      const updateData = {
        description: 'Новое описание категории'
      };

      const response = await axios.put(`/api/categories/${testCategoryId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.description).toBe(updateData.description);
    });

    test('должен отклонить обновление с невалидными данными', async () => {
      if (!testCategoryId) {
        throw new Error('Test category ID not available');
      }

      const invalidData = {
        name: '' // пустое название
      };

      await expect(axios.put(`/api/categories/${testCategoryId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен вернуть 404 для обновления несуществующей категории', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.put(`/api/categories/${fakeId}`, { name: 'Новое название' }))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('DELETE - Удаление категорий', () => {
    test('должен удалить существующую категорию', async () => {
      if (!testCategoryId) {
        throw new Error('Test category ID not available');
      }

      const response = await axios.delete(`/api/categories/${testCategoryId}`);
      
      expect(response.status).toBe(200);
      
      // Проверяем, что категория действительно удалена
      await expect(axios.get(`/api/categories/${testCategoryId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });

    test('должен вернуть 404 для удаления несуществующей категории', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.delete(`/api/categories/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });

    test('должен отклонить удаление категории с продуктами', async () => {
      // Сначала создаем категорию
      const categoryResponse = await axios.post('/api/categories', {
        name: 'Категория с продуктами'
      });
      const categoryId = categoryResponse.data.id;

      // Создаем продукт в этой категории
      await axios.post('/api/products', {
        name: 'Продукт в категории',
        description: 'Описание',
        price: 100,
        category_id: categoryId
      });

      // Пытаемся удалить категорию с продуктами
      await expect(axios.delete(`/api/categories/${categoryId}`))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });

      // Очищаем: удаляем продукт и категорию
      const products = await axios.get('/api/products');
      const product = products.data.find(p => p.category_id === categoryId);
      if (product) {
        await axios.delete(`/api/products/${product.id}`);
      }
      await axios.delete(`/api/categories/${categoryId}`);
    });
  });

  describe('AUTHORIZATION - Авторизация', () => {
    test('должен отклонить создание категории без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.post('/api/categories', {
        name: 'Неавторизованная категория'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить обновление категории без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.put(`/api/categories/${testCategoryId}`, {
        name: 'Неавторизованное обновление'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить удаление категории без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.delete(`/api/categories/${testCategoryId}`))
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


