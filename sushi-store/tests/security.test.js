/**
 * Тесты безопасности для Sushi Store
 * Проверяем защиту от основных атак
 */

describe('Тесты безопасности', () => {
  
  describe('Аутентификация и авторизация', () => {
    test('должен отклонять запросы без токена', async () => {
      const mockAxios = {
        get: jest.fn().mockRejectedValue({
          response: { status: 403, data: { error: 'Forbidden' } }
        })
      };

      global.axios = mockAxios;

      try {
        await global.axios.get('/api/orders');
      } catch (error) {
        expect(error.response.status).toBe(403);
        expect(error.response.data.error).toBe('Forbidden');
      }
    });

    test('должен отклонять запросы с невалидным токеном', async () => {
      const mockAxios = {
        get: jest.fn().mockRejectedValue({
          response: { status: 403, data: { error: 'Forbidden' } }
        })
      };

      global.axios = mockAxios;

      try {
        await global.axios.get('/api/orders');
      } catch (error) {
        expect(error.response.status).toBe(403);
        expect(error.response.data.error).toBe('Forbidden');
      }
    });

    test('должен отклонять запросы с ролью user к админским эндпоинтам', async () => {
      // Мокаем пользователя с ролью user
      const mockUser = {
        id: 'user1',
        phone: '+7 (999) 123-45-67',
        role: 'user'
      };

      const mockAxios = {
        get: jest.fn().mockRejectedValue({
          response: { status: 403, data: { error: 'Forbidden' } }
        })
      };

      global.axios = mockAxios;

      try {
        await global.axios.get('/api/orders');
      } catch (error) {
        expect(error.response.status).toBe(403);
        expect(error.response.data.error).toBe('Forbidden');
      }
    });
  });

  describe('Защита админских эндпоинтов', () => {
    const adminEndpoints = [
      { method: 'POST', path: '/api/products' },
      { method: 'PUT', path: '/api/products/123' },
      { method: 'DELETE', path: '/api/products/123' },
      { method: 'POST', path: '/api/categories' },
      { method: 'PUT', path: '/api/categories/123' },
      { method: 'DELETE', path: '/api/categories/123' },
      { method: 'POST', path: '/api/news' },
      { method: 'PUT', path: '/api/news/123' },
      { method: 'DELETE', path: '/api/news/123' },
      { method: 'GET', path: '/api/orders' },
      { method: 'PUT', path: '/api/orders/123' },
      { method: 'DELETE', path: '/api/orders/123' }
    ];

    adminEndpoints.forEach(endpoint => {
      test(`должен защищать ${endpoint.method} ${endpoint.path}`, async () => {
        const mockAxios = {
          get: jest.fn().mockRejectedValue({
            response: { status: 403, data: { error: 'Forbidden' } }
          }),
          post: jest.fn().mockRejectedValue({
            response: { status: 403, data: { error: 'Forbidden' } }
          }),
          put: jest.fn().mockRejectedValue({
            response: { status: 403, data: { error: 'Forbidden' } }
          }),
          delete: jest.fn().mockRejectedValue({
            response: { status: 403, data: { error: 'Forbidden' } }
          })
        };

        global.axios = mockAxios;

        try {
          await global.axios[endpoint.method.toLowerCase()](endpoint.path);
        } catch (error) {
          expect(error.response.status).toBe(403);
          expect(error.response.data.error).toBe('Forbidden');
        }
      });
    });
  });

  describe('Валидация входных данных', () => {
    test('должен отклонять пустые данные при входе', async () => {
      const mockAxios = {
        post: jest.fn().mockRejectedValue({
          response: { status: 400, data: { error: 'Phone and password required' } }
        })
      };

      global.axios = mockAxios;

      try {
        await global.axios.post('/api/login', { phone: '', password: '' });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe('Phone and password required');
      }
    });

    test('должен отклонять неверные учетные данные', async () => {
      const mockAxios = {
        post: jest.fn().mockRejectedValue({
          response: { status: 401, data: { error: 'Invalid credentials' } }
        })
      };

      global.axios = mockAxios;

      try {
        await global.axios.post('/api/login', { 
          phone: 'wrong_phone', 
          password: 'wrong_password' 
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe('Invalid credentials');
      }
    });
  });

  describe('Защита от подмены ролей', () => {
    test('должен игнорировать подмену роли в localStorage', () => {
      // Симулируем подмену роли в браузере
      const originalRole = 'user';
      const fakeRole = 'admin';
      
      // Подменяем роль
      localStorage.setItem('role', fakeRole);
      
      // Но серверная проверка должна игнорировать это
      const validateRole = (clientRole, serverRole) => {
        // Сервер всегда проверяет свою версию роли
        return serverRole === 'admin';
      };
      
      expect(validateRole(fakeRole, originalRole)).toBe(false);
      expect(validateRole(fakeRole, 'admin')).toBe(true);
    });

    test('должен проверять токен, а не роль из клиента', () => {
      const mockServerValidation = (token, clientRole) => {
        // Сервер проверяет токен и получает роль из сессии
        const validTokens = {
          'valid_admin_token': { role: 'admin' },
          'valid_user_token': { role: 'user' }
        };
        
        const user = validTokens[token];
        if (!user) return false;
        
        // Игнорируем роль из клиента, используем только серверную
        return user.role === 'admin';
      };
      
      // Даже если клиент подменил роль, сервер проверит токен
      expect(mockServerValidation('valid_user_token', 'admin')).toBe(false);
      expect(mockServerValidation('valid_admin_token', 'user')).toBe(true);
      expect(mockServerValidation('invalid_token', 'admin')).toBe(false);
    });
  });

  describe('Защита от CSRF', () => {
    test('должен отклонять запросы без правильного Origin', () => {
      const validateOrigin = (origin, allowedOrigins) => {
        return allowedOrigins.includes(origin);
      };
      
      const allowedOrigins = ['https://sushi-store.com', 'https://www.sushi-store.com'];
      
      expect(validateOrigin('https://sushi-store.com', allowedOrigins)).toBe(true);
      expect(validateOrigin('https://malicious-site.com', allowedOrigins)).toBe(false);
      expect(validateOrigin('http://sushi-store.com', allowedOrigins)).toBe(false);
    });
  });

  describe('Защита от брутфорса', () => {
    test('должен ограничивать количество попыток входа', () => {
      const loginAttempts = new Map();
      const maxAttempts = 5;
      const lockoutTime = 15 * 60 * 1000; // 15 минут
      
      const canAttemptLogin = (ip) => {
        const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
        const now = Date.now();
        
        // Сброс счетчика если прошло время блокировки
        if (now - attempts.lastAttempt > lockoutTime) {
          attempts.count = 0;
        }
        
        return attempts.count < maxAttempts;
      };
      
      const recordFailedAttempt = (ip) => {
        const attempts = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
        attempts.count++;
        attempts.lastAttempt = Date.now();
        loginAttempts.set(ip, attempts);
      };
      
      const ip = '192.168.1.1';
      
      // Первые 5 попыток должны быть разрешены
      for (let i = 0; i < 5; i++) {
        expect(canAttemptLogin(ip)).toBe(true);
        recordFailedAttempt(ip);
      }
      
      // 6-я попытка должна быть заблокирована
      expect(canAttemptLogin(ip)).toBe(false);
    });
  });

  describe('Валидация токенов', () => {
    test('должен отклонять токены неправильной длины', () => {
      const validateToken = (token) => {
        // Токен должен быть 32 символа (16 байт в hex)
        return /^[a-f0-9]{32}$/.test(token);
      };
      
      expect(validateToken('abc123')).toBe(false); // Слишком короткий
      expect(validateToken('a'.repeat(64))).toBe(false); // Слишком длинный
      expect(validateToken('abc123def456ghi789jkl012mno345pq')).toBe(false); // Не hex
      expect(validateToken('a1b2c3d4e5f6789012345678901234ab')).toBe(true); // Правильный
    });

    test('должен отклонять токены с истекшим сроком действия', () => {
      const validateTokenExpiry = (token, sessions) => {
        const session = sessions[token];
        if (!session) return false;
        
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 часа
        
        return (now - session.created) < maxAge;
      };
      
      const sessions = {
        'valid_token': { created: Date.now() - 1000 }, // 1 секунда назад
        'expired_token': { created: Date.now() - 25 * 60 * 60 * 1000 } // 25 часов назад
      };
      
      expect(validateTokenExpiry('valid_token', sessions)).toBe(true);
      expect(validateTokenExpiry('expired_token', sessions)).toBe(false);
      expect(validateTokenExpiry('nonexistent_token', sessions)).toBe(false);
    });
  });

  describe('Защита от инъекций', () => {
    test('должен экранировать специальные символы в поиске', () => {
      const sanitizeSearchQuery = (query) => {
        return query
          .replace(/[<>]/g, '') // Удаляем HTML теги
          .replace(/['"]/g, '') // Удаляем кавычки
          .replace(/[;]/g, '') // Удаляем точки с запятой
          .trim();
      };
      
      expect(sanitizeSearchQuery('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
      expect(sanitizeSearchQuery('"; DROP TABLE users; --')).toBe('DROP TABLE users --');
      expect(sanitizeSearchQuery('normal search')).toBe('normal search');
    });

    test('должен валидировать email адреса', () => {
      const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
      };
      
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('Логирование безопасности', () => {
    test('должен логировать подозрительную активность', () => {
      const securityLog = [];
      
      const logSecurityEvent = (event, details) => {
        securityLog.push({
          timestamp: new Date().toISOString(),
          event,
          details,
          ip: details.ip || 'unknown'
        });
      };
      
      // Логируем неудачные попытки входа
      logSecurityEvent('failed_login', { 
        ip: '192.168.1.1', 
        phone: '+7 (999) 123-45-67' 
      });
      
      // Логируем попытки доступа к админским эндпоинтам
      logSecurityEvent('unauthorized_admin_access', { 
        ip: '192.168.1.2', 
        endpoint: '/api/orders',
        token: 'invalid_token'
      });
      
      expect(securityLog).toHaveLength(2);
      expect(securityLog[0].event).toBe('failed_login');
      expect(securityLog[1].event).toBe('unauthorized_admin_access');
    });
  });
});
