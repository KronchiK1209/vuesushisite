const axios = require('axios');

// Настройка axios для тестов
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 5000;

describe('CRUD Operations - Reviews', () => {
  let adminToken = '';
  let testReviewId = '';

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

  describe('CREATE - Создание отзывов', () => {
    test('должен создать новый отзыв с валидными данными', async () => {
      const reviewData = {
        author_name: 'Тестовый автор',
        author_avatar: 'test-avatar.jpg',
        rating: 5,
        text: 'Отличный отзыв о ресторане',
        date: '2024-01-15',
        verified: true
      };

      const response = await axios.post('/api/reviews', reviewData);
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        author_name: reviewData.author_name,
        author_avatar: reviewData.author_avatar,
        rating: reviewData.rating,
        text: reviewData.text,
        date: reviewData.date,
        verified: reviewData.verified
      });
      
      testReviewId = response.data.id;
    });

    test('должен создать отзыв с минимальными данными', async () => {
      const reviewData = {
        author_name: 'Минимальный автор',
        rating: 4,
        text: 'Минимальный отзыв'
      };

      const response = await axios.post('/api/reviews', reviewData);
      
      expect(response.status).toBe(201);
      expect(response.data.author_name).toBe(reviewData.author_name);
      expect(response.data.verified).toBe(false); // значение по умолчанию
    });

    test('должен отклонить создание отзыва без имени автора', async () => {
      const invalidData = {
        rating: 5,
        text: 'Отзыв без имени автора'
      };

      await expect(axios.post('/api/reviews', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание отзыва без рейтинга', async () => {
      const invalidData = {
        author_name: 'Автор',
        text: 'Отзыв без рейтинга'
      };

      await expect(axios.post('/api/reviews', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание отзыва без текста', async () => {
      const invalidData = {
        author_name: 'Автор',
        rating: 5
      };

      await expect(axios.post('/api/reviews', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание отзыва с невалидным рейтингом', async () => {
      const invalidData = {
        author_name: 'Автор',
        rating: 6, // рейтинг больше 5
        text: 'Отзыв с невалидным рейтингом'
      };

      await expect(axios.post('/api/reviews', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание отзыва с отрицательным рейтингом', async () => {
      const invalidData = {
        author_name: 'Автор',
        rating: -1, // отрицательный рейтинг
        text: 'Отзыв с отрицательным рейтингом'
      };

      await expect(axios.post('/api/reviews', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });
  });

  describe('READ - Получение отзывов', () => {
    test('должен получить список всех отзывов', async () => {
      const response = await axios.get('/api/reviews');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('должен получить отзыв по ID', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const response = await axios.get(`/api/reviews/${testReviewId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testReviewId);
      expect(response.data.author_name).toBe('Тестовый автор');
    });

    test('должен вернуть 404 для несуществующего отзыва', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.get(`/api/reviews/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('UPDATE - Обновление отзывов', () => {
    test('должен обновить все поля отзыва', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const updateData = {
        author_name: 'Обновленный автор',
        author_avatar: 'updated-avatar.jpg',
        rating: 4,
        text: 'Обновленный текст отзыва',
        date: '2024-01-20',
        verified: false
      };

      const response = await axios.put(`/api/reviews/${testReviewId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updateData);
    });

    test('должен обновить только имя автора', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const updateData = {
        author_name: 'Только имя обновлено'
      };

      const response = await axios.put(`/api/reviews/${testReviewId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.author_name).toBe(updateData.author_name);
    });

    test('должен обновить только рейтинг', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const updateData = {
        rating: 3
      };

      const response = await axios.put(`/api/reviews/${testReviewId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.rating).toBe(updateData.rating);
    });

    test('должен обновить только текст отзыва', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const updateData = {
        text: 'Только текст обновлен'
      };

      const response = await axios.put(`/api/reviews/${testReviewId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.text).toBe(updateData.text);
    });

    test('должен обновить только аватар автора', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const updateData = {
        author_avatar: 'new-avatar.jpg'
      };

      const response = await axios.put(`/api/reviews/${testReviewId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.author_avatar).toBe(updateData.author_avatar);
    });

    test('должен обновить только статус верификации', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const updateData = {
        verified: true
      };

      const response = await axios.put(`/api/reviews/${testReviewId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.verified).toBe(updateData.verified);
    });

    test('должен обновить только дату отзыва', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const updateData = {
        date: '2024-02-01'
      };

      const response = await axios.put(`/api/reviews/${testReviewId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.date).toBe(updateData.date);
    });

    test('должен отклонить обновление с невалидными данными', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const invalidData = {
        rating: 6 // рейтинг больше 5
      };

      await expect(axios.put(`/api/reviews/${testReviewId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен вернуть 404 для обновления несуществующего отзыва', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.put(`/api/reviews/${fakeId}`, { rating: 5 }))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('DELETE - Удаление отзывов', () => {
    test('должен удалить существующий отзыв', async () => {
      if (!testReviewId) {
        throw new Error('Test review ID not available');
      }

      const response = await axios.delete(`/api/reviews/${testReviewId}`);
      
      expect(response.status).toBe(200);
      
      // Проверяем, что отзыв действительно удален
      await expect(axios.get(`/api/reviews/${testReviewId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });

    test('должен вернуть 404 для удаления несуществующего отзыва', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.delete(`/api/reviews/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('AUTHORIZATION - Авторизация', () => {
    test('должен отклонить создание отзыва без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.post('/api/reviews', {
        author_name: 'Неавторизованный автор',
        rating: 5,
        text: 'Отзыв'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить обновление отзыва без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.put(`/api/reviews/${testReviewId}`, {
        rating: 5
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить удаление отзыва без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.delete(`/api/reviews/${testReviewId}`))
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


