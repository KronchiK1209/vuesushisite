const axios = require('axios');

// Настройка axios для тестов
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 5000;

describe('CRUD Operations - SEO', () => {
  let adminToken = '';
  let testSeoId = '';

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

  describe('CREATE - Создание SEO блоков', () => {
    test('должен создать новый SEO блок с валидными данными', async () => {
      const seoData = {
        page: 'home',
        title: 'Тестовый заголовок',
        description: 'Тестовое описание страницы',
        keywords: 'тест, суши, ресторан',
        og_title: 'OG заголовок',
        og_description: 'OG описание',
        og_image: 'og-image.jpg'
      };

      const response = await axios.post('/api/seo', seoData);
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        page: seoData.page,
        title: seoData.title,
        description: seoData.description,
        keywords: seoData.keywords,
        og_title: seoData.og_title,
        og_description: seoData.og_description,
        og_image: seoData.og_image
      });
      
      testSeoId = response.data.id;
    });

    test('должен создать SEO блок с минимальными данными', async () => {
      const seoData = {
        page: 'menu',
        title: 'Минимальный заголовок',
        description: 'Минимальное описание'
      };

      const response = await axios.post('/api/seo', seoData);
      
      expect(response.status).toBe(201);
      expect(response.data.page).toBe(seoData.page);
      expect(response.data.title).toBe(seoData.title);
    });

    test('должен отклонить создание SEO блока без страницы', async () => {
      const invalidData = {
        title: 'Заголовок без страницы',
        description: 'Описание'
      };

      await expect(axios.post('/api/seo', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание SEO блока без заголовка', async () => {
      const invalidData = {
        page: 'home',
        description: 'Описание без заголовка'
      };

      await expect(axios.post('/api/seo', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание SEO блока без описания', async () => {
      const invalidData = {
        page: 'home',
        title: 'Заголовок без описания'
      };

      await expect(axios.post('/api/seo', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание SEO блока с пустой страницей', async () => {
      const invalidData = {
        page: '',
        title: 'Заголовок',
        description: 'Описание'
      };

      await expect(axios.post('/api/seo', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });
  });

  describe('READ - Получение SEO блоков', () => {
    test('должен получить список всех SEO блоков', async () => {
      const response = await axios.get('/api/seo');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('должен получить SEO блок по ID', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const response = await axios.get(`/api/seo/${testSeoId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testSeoId);
      expect(response.data.page).toBe('home');
    });

    test('должен вернуть 404 для несуществующего SEO блока', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.get(`/api/seo/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('UPDATE - Обновление SEO блоков', () => {
    test('должен обновить все поля SEO блока', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const updateData = {
        page: 'about',
        title: 'Обновленный заголовок',
        description: 'Обновленное описание страницы',
        keywords: 'обновленные, ключевые, слова',
        og_title: 'Обновленный OG заголовок',
        og_description: 'Обновленное OG описание',
        og_image: 'updated-og-image.jpg'
      };

      const response = await axios.put(`/api/seo/${testSeoId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updateData);
    });

    test('должен обновить только заголовок', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const updateData = {
        title: 'Только заголовок обновлен'
      };

      const response = await axios.put(`/api/seo/${testSeoId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updateData.title);
    });

    test('должен обновить только описание', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const updateData = {
        description: 'Только описание обновлено'
      };

      const response = await axios.put(`/api/seo/${testSeoId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.description).toBe(updateData.description);
    });

    test('должен обновить только ключевые слова', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const updateData = {
        keywords: 'новые, ключевые, слова'
      };

      const response = await axios.put(`/api/seo/${testSeoId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.keywords).toBe(updateData.keywords);
    });

    test('должен обновить только OG заголовок', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const updateData = {
        og_title: 'Новый OG заголовок'
      };

      const response = await axios.put(`/api/seo/${testSeoId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.og_title).toBe(updateData.og_title);
    });

    test('должен обновить только OG описание', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const updateData = {
        og_description: 'Новое OG описание'
      };

      const response = await axios.put(`/api/seo/${testSeoId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.og_description).toBe(updateData.og_description);
    });

    test('должен обновить только OG изображение', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const updateData = {
        og_image: 'new-og-image.jpg'
      };

      const response = await axios.put(`/api/seo/${testSeoId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.og_image).toBe(updateData.og_image);
    });

    test('должен отклонить обновление с невалидными данными', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const invalidData = {
        title: '' // пустой заголовок
      };

      await expect(axios.put(`/api/seo/${testSeoId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен вернуть 404 для обновления несуществующего SEO блока', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.put(`/api/seo/${fakeId}`, { title: 'Новый заголовок' }))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('DELETE - Удаление SEO блоков', () => {
    test('должен удалить существующий SEO блок', async () => {
      if (!testSeoId) {
        throw new Error('Test SEO ID not available');
      }

      const response = await axios.delete(`/api/seo/${testSeoId}`);
      
      expect(response.status).toBe(200);
      
      // Проверяем, что SEO блок действительно удален
      await expect(axios.get(`/api/seo/${testSeoId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });

    test('должен вернуть 404 для удаления несуществующего SEO блока', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.delete(`/api/seo/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('AUTHORIZATION - Авторизация', () => {
    test('должен отклонить создание SEO блока без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.post('/api/seo', {
        page: 'home',
        title: 'Неавторизованный заголовок',
        description: 'Описание'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить обновление SEO блока без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.put(`/api/seo/${testSeoId}`, {
        title: 'Неавторизованное обновление'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить удаление SEO блока без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.delete(`/api/seo/${testSeoId}`))
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


