const axios = require('axios');

// Настройка axios для тестов
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 5000;

describe('CRUD Operations - Category Blocks', () => {
  let adminToken = '';
  let testCategoryBlockId = '';

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

  describe('CREATE - Создание блоков категорий', () => {
    test('должен создать новый блок категории с валидными данными', async () => {
      const blockData = {
        title: 'Тестовый блок категории',
        description: 'Описание тестового блока',
        image: 'test-block.jpg',
        category_id: 'test-category-id',
        order_index: 1,
        is_active: true
      };

      const response = await axios.post('/api/category-blocks', blockData);
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        title: blockData.title,
        description: blockData.description,
        image: blockData.image,
        category_id: blockData.category_id,
        order_index: blockData.order_index,
        is_active: blockData.is_active
      });
      
      testCategoryBlockId = response.data.id;
    });

    test('должен создать блок категории с минимальными данными', async () => {
      const blockData = {
        title: 'Минимальный блок',
        category_id: 'min-category-id'
      };

      const response = await axios.post('/api/category-blocks', blockData);
      
      expect(response.status).toBe(201);
      expect(response.data.title).toBe(blockData.title);
      expect(response.data.is_active).toBe(true); // значение по умолчанию
      expect(response.data.order_index).toBe(0); // значение по умолчанию
    });

    test('должен отклонить создание блока без заголовка', async () => {
      const invalidData = {
        category_id: 'test-category',
        description: 'Описание без заголовка'
      };

      await expect(axios.post('/api/category-blocks', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание блока без ID категории', async () => {
      const invalidData = {
        title: 'Заголовок без категории',
        description: 'Описание'
      };

      await expect(axios.post('/api/category-blocks', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание блока с пустым заголовком', async () => {
      const invalidData = {
        title: '',
        category_id: 'test-category',
        description: 'Описание'
      };

      await expect(axios.post('/api/category-blocks', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание блока с отрицательным порядком', async () => {
      const invalidData = {
        title: 'Заголовок',
        category_id: 'test-category',
        order_index: -1
      };

      await expect(axios.post('/api/category-blocks', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });
  });

  describe('READ - Получение блоков категорий', () => {
    test('должен получить список всех блоков категорий', async () => {
      const response = await axios.get('/api/category-blocks');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('должен получить блок категории по ID', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const response = await axios.get(`/api/category-blocks/${testCategoryBlockId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testCategoryBlockId);
      expect(response.data.title).toBe('Тестовый блок категории');
    });

    test('должен вернуть 404 для несуществующего блока категории', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.get(`/api/category-blocks/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('UPDATE - Обновление блоков категорий', () => {
    test('должен обновить все поля блока категории', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const updateData = {
        title: 'Обновленный блок категории',
        description: 'Обновленное описание блока',
        image: 'updated-block.jpg',
        category_id: 'updated-category-id',
        order_index: 2,
        is_active: false
      };

      const response = await axios.put(`/api/category-blocks/${testCategoryBlockId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updateData);
    });

    test('должен обновить только заголовок блока', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const updateData = {
        title: 'Только заголовок обновлен'
      };

      const response = await axios.put(`/api/category-blocks/${testCategoryBlockId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updateData.title);
    });

    test('должен обновить только описание блока', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const updateData = {
        description: 'Только описание обновлено'
      };

      const response = await axios.put(`/api/category-blocks/${testCategoryBlockId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.description).toBe(updateData.description);
    });

    test('должен обновить только изображение блока', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const updateData = {
        image: 'new-block-image.jpg'
      };

      const response = await axios.put(`/api/category-blocks/${testCategoryBlockId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.image).toBe(updateData.image);
    });

    test('должен обновить только ID категории', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const updateData = {
        category_id: 'new-category-id'
      };

      const response = await axios.put(`/api/category-blocks/${testCategoryBlockId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.category_id).toBe(updateData.category_id);
    });

    test('должен обновить только порядок блока', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const updateData = {
        order_index: 5
      };

      const response = await axios.put(`/api/category-blocks/${testCategoryBlockId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.order_index).toBe(updateData.order_index);
    });

    test('должен обновить только статус активности', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const updateData = {
        is_active: true
      };

      const response = await axios.put(`/api/category-blocks/${testCategoryBlockId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.is_active).toBe(updateData.is_active);
    });

    test('должен отклонить обновление с невалидными данными', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const invalidData = {
        title: '' // пустой заголовок
      };

      await expect(axios.put(`/api/category-blocks/${testCategoryBlockId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить обновление с отрицательным порядком', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const invalidData = {
        order_index: -5
      };

      await expect(axios.put(`/api/category-blocks/${testCategoryBlockId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен вернуть 404 для обновления несуществующего блока категории', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.put(`/api/category-blocks/${fakeId}`, { title: 'Новый заголовок' }))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('DELETE - Удаление блоков категорий', () => {
    test('должен удалить существующий блок категории', async () => {
      if (!testCategoryBlockId) {
        throw new Error('Test category block ID not available');
      }

      const response = await axios.delete(`/api/category-blocks/${testCategoryBlockId}`);
      
      expect(response.status).toBe(200);
      
      // Проверяем, что блок категории действительно удален
      await expect(axios.get(`/api/category-blocks/${testCategoryBlockId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });

    test('должен вернуть 404 для удаления несуществующего блока категории', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.delete(`/api/category-blocks/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('AUTHORIZATION - Авторизация', () => {
    test('должен отклонить создание блока категории без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.post('/api/category-blocks', {
        title: 'Неавторизованный блок',
        category_id: 'test-category'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить обновление блока категории без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.put(`/api/category-blocks/${testCategoryBlockId}`, {
        title: 'Неавторизованное обновление'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить удаление блока категории без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.delete(`/api/category-blocks/${testCategoryBlockId}`))
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


