const axios = require('axios');

// Настройка axios для тестов
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 5000;

describe('CRUD Operations - News', () => {
  let adminToken = '';
  let testNewsId = '';

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

  describe('CREATE - Создание новостей', () => {
    test('должен создать новую новость с валидными данными', async () => {
      const newsData = {
        title: 'Тестовая новость',
        content: 'Содержание тестовой новости',
        image: 'test-news.jpg',
        published: true
      };

      const response = await axios.post('/api/news', newsData);
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        title: newsData.title,
        content: newsData.content,
        image: newsData.image,
        published: newsData.published
      });
      
      testNewsId = response.data.id;
    });

    test('должен создать новость с минимальными данными', async () => {
      const newsData = {
        title: 'Минимальная новость',
        content: 'Минимальное содержание'
      };

      const response = await axios.post('/api/news', newsData);
      
      expect(response.status).toBe(201);
      expect(response.data.title).toBe(newsData.title);
      expect(response.data.published).toBe(false); // значение по умолчанию
    });

    test('должен отклонить создание новости без заголовка', async () => {
      const invalidData = {
        content: 'Содержание без заголовка'
      };

      await expect(axios.post('/api/news', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание новости без содержания', async () => {
      const invalidData = {
        title: 'Заголовок без содержания'
      };

      await expect(axios.post('/api/news', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание новости с пустым заголовком', async () => {
      const invalidData = {
        title: '',
        content: 'Содержание'
      };

      await expect(axios.post('/api/news', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });
  });

  describe('READ - Получение новостей', () => {
    test('должен получить список всех новостей', async () => {
      const response = await axios.get('/api/news');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('должен получить новость по ID', async () => {
      if (!testNewsId) {
        throw new Error('Test news ID not available');
      }

      const response = await axios.get(`/api/news/${testNewsId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testNewsId);
      expect(response.data.title).toBe('Тестовая новость');
    });

    test('должен вернуть 404 для несуществующей новости', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.get(`/api/news/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('UPDATE - Обновление новостей', () => {
    test('должен обновить все поля новости', async () => {
      if (!testNewsId) {
        throw new Error('Test news ID not available');
      }

      const updateData = {
        title: 'Обновленная новость',
        content: 'Обновленное содержание новости',
        image: 'updated-news.jpg',
        published: false
      };

      const response = await axios.put(`/api/news/${testNewsId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updateData);
    });

    test('должен обновить только заголовок новости', async () => {
      if (!testNewsId) {
        throw new Error('Test news ID not available');
      }

      const updateData = {
        title: 'Только заголовок обновлен'
      };

      const response = await axios.put(`/api/news/${testNewsId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updateData.title);
    });

    test('должен обновить только содержание новости', async () => {
      if (!testNewsId) {
        throw new Error('Test news ID not available');
      }

      const updateData = {
        content: 'Только содержание обновлено'
      };

      const response = await axios.put(`/api/news/${testNewsId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.content).toBe(updateData.content);
    });

    test('должен обновить только изображение новости', async () => {
      if (!testNewsId) {
        throw new Error('Test news ID not available');
      }

      const updateData = {
        image: 'new-image.jpg'
      };

      const response = await axios.put(`/api/news/${testNewsId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.image).toBe(updateData.image);
    });

    test('должен обновить только статус публикации', async () => {
      if (!testNewsId) {
        throw new Error('Test news ID not available');
      }

      const updateData = {
        published: true
      };

      const response = await axios.put(`/api/news/${testNewsId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.published).toBe(updateData.published);
    });

    test('должен отклонить обновление с невалидными данными', async () => {
      if (!testNewsId) {
        throw new Error('Test news ID not available');
      }

      const invalidData = {
        title: '' // пустой заголовок
      };

      await expect(axios.put(`/api/news/${testNewsId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен вернуть 404 для обновления несуществующей новости', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.put(`/api/news/${fakeId}`, { title: 'Новый заголовок' }))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('DELETE - Удаление новостей', () => {
    test('должен удалить существующую новость', async () => {
      if (!testNewsId) {
        throw new Error('Test news ID not available');
      }

      const response = await axios.delete(`/api/news/${testNewsId}`);
      
      expect(response.status).toBe(200);
      
      // Проверяем, что новость действительно удалена
      await expect(axios.get(`/api/news/${testNewsId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });

    test('должен вернуть 404 для удаления несуществующей новости', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.delete(`/api/news/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('AUTHORIZATION - Авторизация', () => {
    test('должен отклонить создание новости без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.post('/api/news', {
        title: 'Неавторизованная новость',
        content: 'Содержание'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить обновление новости без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.put(`/api/news/${testNewsId}`, {
        title: 'Неавторизованное обновление'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить удаление новости без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.delete(`/api/news/${testNewsId}`))
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


