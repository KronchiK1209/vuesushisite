const axios = require('axios');

// Настройка axios для тестов
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 5000;

describe('CRUD Operations - Orders', () => {
  let adminToken = '';
  let testOrderId = '';
  let testUserId = '';

  beforeAll(async () => {
    // Логинимся как админ
    try {
      const loginResponse = await axios.post('/api/login', {
        phone: '+7 (999) 123-45-67',
        password: 'admin123'
      });
      adminToken = loginResponse.data.token;
      testUserId = loginResponse.data.user.id;
      axios.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
    } catch (error) {
      throw new Error('Failed to login as admin: ' + error.message);
    }
  });

  describe('CREATE - Создание заказов', () => {
    test('должен создать новый заказ с валидными данными', async () => {
      const orderData = {
        user_id: testUserId,
        customer_name: 'Тестовый клиент',
        customer_phone: '+7 (999) 123-45-67',
        customer_address: 'Тестовый адрес, ул. Тестовая, д. 1',
        total_amount: 1500,
        status: 'pending',
        delivery_time: 'asap',
        persons: 2,
        extras_selection: [1, 0, 1],
        notes: 'Тестовые заметки',
        items: [
          {
            product_id: '0a2310f7-e9dc-4a26-9b40-1070c1df7f9f',
            quantity: 2,
            price: 750
          }
        ]
      };

      const response = await axios.post('/api/orders', orderData);
      
      expect(response.status).toBe(201);
      expect(response.data).toMatchObject({
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        total_amount: orderData.total_amount,
        status: orderData.status,
        delivery_time: orderData.delivery_time,
        persons: orderData.persons,
        notes: orderData.notes,
        paid: false // значение по умолчанию
      });
      
      testOrderId = response.data.id;
    });

    test('должен создать заказ с минимальными данными', async () => {
      const orderData = {
        user_id: testUserId,
        customer_name: 'Минимальный клиент',
        customer_phone: '+7 (999) 999-99-99',
        customer_address: 'Минимальный адрес',
        total_amount: 500,
        status: 'pending',
        delivery_time: 'asap',
        persons: 1,
        extras_selection: [],
        items: []
      };

      const response = await axios.post('/api/orders', orderData);
      
      expect(response.status).toBe(201);
      expect(response.data.customer_name).toBe(orderData.customer_name);
      expect(response.data.status).toBe('pending'); // значение по умолчанию
      expect(response.data.delivery_time).toBe('asap'); // значение по умолчанию
      expect(response.data.persons).toBe(1); // значение по умолчанию
      expect(response.data.paid).toBe(false); // значение по умолчанию
    });

    test('должен отклонить создание заказа без обязательных полей', async () => {
      const invalidData = {
        customer_phone: '+7 (999) 123-45-67',
        total_amount: 500
        // отсутствует customer_name и customer_address
      };

      await expect(axios.post('/api/orders', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание заказа с невалидной суммой', async () => {
      const invalidData = {
        customer_name: 'Клиент',
        customer_phone: '+7 (999) 123-45-67',
        customer_address: 'Адрес',
        total_amount: -100 // отрицательная сумма
      };

      await expect(axios.post('/api/orders', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить создание заказа с невалидным статусом', async () => {
      const invalidData = {
        customer_name: 'Клиент',
        customer_phone: '+7 (999) 123-45-67',
        customer_address: 'Адрес',
        total_amount: 500,
        status: 'invalid_status'
      };

      await expect(axios.post('/api/orders', invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });
  });

  describe('READ - Получение заказов', () => {
    test('должен получить список всех заказов', async () => {
      const response = await axios.get('/api/orders');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(0);
    });

    test('должен получить заказ по ID', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const response = await axios.get(`/api/orders/${testOrderId}`);
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(testOrderId);
      expect(response.data.customer_name).toBe('Тестовый клиент');
    });

    test('должен вернуть 404 для несуществующего заказа', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.get(`/api/orders/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('UPDATE - Обновление заказов', () => {
    test('должен обновить все поля заказа', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const updateData = {
        customer_name: 'Обновленный клиент',
        customer_phone: '+7 (999) 888-88-88',
        customer_address: 'Обновленный адрес, ул. Новая, д. 2',
        total_amount: 2000,
        status: 'confirmed',
        delivery_time: 'scheduled',
        persons: 3,
        extras_selection: [0, 2, 0],
        notes: 'Обновленные заметки',
        paid: true
      };

      const response = await axios.put(`/api/orders/${testOrderId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updateData);
    });

    test('должен обновить только статус заказа', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const updateData = {
        status: 'preparing'
      };

      const response = await axios.put(`/api/orders/${testOrderId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.status).toBe(updateData.status);
    });

    test('должен обновить только статус оплаты', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const updateData = {
        paid: false
      };

      const response = await axios.put(`/api/orders/${testOrderId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.paid).toBe(updateData.paid);
    });

    test('должен обновить только данные клиента', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const updateData = {
        customer_name: 'Новое имя клиента',
        customer_phone: '+7 (999) 777-77-77',
        customer_address: 'Новый адрес клиента'
      };

      const response = await axios.put(`/api/orders/${testOrderId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(updateData);
    });

    test('должен обновить только сумму заказа', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const updateData = {
        total_amount: 2500
      };

      const response = await axios.put(`/api/orders/${testOrderId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.total_amount).toBe(updateData.total_amount);
    });

    test('должен обновить только время доставки', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const updateData = {
        delivery_time: 'asap'
      };

      const response = await axios.put(`/api/orders/${testOrderId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.delivery_time).toBe(updateData.delivery_time);
    });

    test('должен обновить только количество персон', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const updateData = {
        persons: 4
      };

      const response = await axios.put(`/api/orders/${testOrderId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.persons).toBe(updateData.persons);
    });

    test('должен обновить только заметки', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const updateData = {
        notes: 'Новые заметки к заказу'
      };

      const response = await axios.put(`/api/orders/${testOrderId}`, updateData);
      
      expect(response.status).toBe(200);
      expect(response.data.notes).toBe(updateData.notes);
    });

    test('должен отклонить обновление с невалидными данными', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const invalidData = {
        total_amount: -100 // отрицательная сумма
      };

      await expect(axios.put(`/api/orders/${testOrderId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен отклонить обновление с невалидным статусом', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const invalidData = {
        status: 'invalid_status'
      };

      await expect(axios.put(`/api/orders/${testOrderId}`, invalidData))
        .rejects.toMatchObject({
          response: {
            status: 400
          }
        });
    });

    test('должен вернуть 404 для обновления несуществующего заказа', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.put(`/api/orders/${fakeId}`, { status: 'confirmed' }))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('DELETE - Удаление заказов', () => {
    test('должен удалить существующий заказ', async () => {
      if (!testOrderId) {
        throw new Error('Test order ID not available');
      }

      const response = await axios.delete(`/api/orders/${testOrderId}`);
      
      expect(response.status).toBe(200);
      
      // Проверяем, что заказ действительно удален
      await expect(axios.get(`/api/orders/${testOrderId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });

    test('должен вернуть 404 для удаления несуществующего заказа', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await expect(axios.delete(`/api/orders/${fakeId}`))
        .rejects.toMatchObject({
          response: {
            status: 404
          }
        });
    });
  });

  describe('AUTHORIZATION - Авторизация', () => {
    test('должен отклонить создание заказа без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.post('/api/orders', {
        customer_name: 'Неавторизованный клиент',
        customer_phone: '+7 (999) 123-45-67',
        customer_address: 'Адрес',
        total_amount: 500
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить обновление заказа без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.put(`/api/orders/${testOrderId}`, {
        status: 'confirmed'
      })).rejects.toMatchObject({
        response: {
          status: 401
        }
      });

      // Восстанавливаем авторизацию
      axios.defaults.headers.common['Authorization'] = originalAuth;
    });

    test('должен отклонить удаление заказа без авторизации', async () => {
      const originalAuth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];

      await expect(axios.delete(`/api/orders/${testOrderId}`))
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
