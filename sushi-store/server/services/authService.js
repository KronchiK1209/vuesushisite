/**
 * Сервис аутентификации
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const db = require('../config/database');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  // Создание JWT токена
  generateToken(user) {
    const payload = {
      userId: user.id,
      role: user.role,
      phone: user.phone
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
      issuer: 'sushi-store',
      audience: 'sushi-store-users'
    });
  }

  // Верификация JWT токена
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret, {
        issuer: 'sushi-store',
        audience: 'sushi-store-users'
      });
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Создание сессии пользователя
  async createSession(user, token, userAgent, ipAddress) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    // Вычисляем время истечения токена
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    const query = `
      INSERT INTO user_sessions (user_id, token_hash, expires_at, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await db.query(query, [
      user.id,
      tokenHash,
      expiresAt,
      userAgent,
      ipAddress
    ]);

    return result.rows[0];
  }

  // Удаление сессии
  async revokeSession(token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const query = 'DELETE FROM user_sessions WHERE token_hash = $1';
    await db.query(query, [tokenHash]);
  }

  // Удаление всех сессий пользователя
  async revokeAllUserSessions(userId) {
    const query = 'DELETE FROM user_sessions WHERE user_id = $1';
    await db.query(query, [userId]);
  }

  // Аутентификация пользователя
  async authenticate(phone, password, userAgent, ipAddress) {
    try {
      // Находим пользователя по телефону
      const user = await User.findByPhone(phone);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Проверяем пароль
      const isPasswordValid = await user.checkPassword(password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Проверяем, активен ли пользователь
      if (!user.isActive()) {
        throw new Error('Account is deactivated');
      }

      // Генерируем токен
      const token = this.generateToken(user);

      // Создаем сессию
      await this.createSession(user, token, userAgent, ipAddress);

      // Обновляем время последнего входа
      await user.updateLastLogin();

      return {
        token,
        role: user.role,
        user: user.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  // Регистрация нового пользователя
  async register(phone, password, name, email, userAgent, ipAddress) {
    try {
      // Проверяем, существует ли уже пользователь с таким телефоном
      const existingUser = await User.findByPhone(phone);
      
      if (existingUser) {
        throw new Error('Пользователь с таким номером телефона уже существует');
      }

      // Проверяем email, если он указан
      if (email) {
        const existingEmail = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingEmail.rows.length > 0) {
          throw new Error('Пользователь с таким email уже существует');
        }
      }

      // Создаем нового пользователя
      const user = await User.create({
        phone,
        password,
        name,
        email,
        role: 'user'
      });

      // Генерируем токен
      const token = this.generateToken(user);

      // Создаем сессию
      await this.createSession(user, token, userAgent, ipAddress);

      return {
        token,
        user: user.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  // Выход из системы
  async logout(token) {
    try {
      await this.revokeSession(token);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Обновление токена (refresh token)
  async refreshToken(oldToken, userAgent, ipAddress) {
    try {
      // Верифицируем старый токен
      const decoded = this.verifyToken(oldToken);
      
      // Находим пользователя
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive()) {
        throw new Error('User not found or inactive');
      }

      // Удаляем старую сессию
      await this.revokeSession(oldToken);

      // Генерируем новый токен
      const newToken = this.generateToken(user);

      // Создаем новую сессию
      await this.createSession(user, newToken, userAgent, ipAddress);

      return {
        token: newToken,
        user: user.toJSON()
      };
    } catch (error) {
      throw error;
    }
  }

  // Получение активных сессий пользователя
  async getUserSessions(userId) {
    const query = `
      SELECT id, created_at, last_used, user_agent, ip_address, expires_at
      FROM user_sessions
      WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP
      ORDER BY last_used DESC
    `;

    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // Удаление конкретной сессии
  async revokeSessionById(sessionId, userId) {
    const query = `
      DELETE FROM user_sessions 
      WHERE id = $1 AND user_id = $2
    `;

    const result = await db.query(query, [sessionId, userId]);
    return result.rowCount > 0;
  }

  // Проверка прав доступа
  hasPermission(userRole, requiredRole) {
    const roleHierarchy = {
      'user': 1,
      'admin': 2
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  // Генерация случайного пароля
  generateRandomPassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  }

  // Сброс пароля
  async resetPassword(phone) {
    try {
      const user = await User.findByPhone(phone);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Генерируем новый пароль
      const newPassword = this.generateRandomPassword();
      
      // Обновляем пароль
      await user.updatePassword(newPassword);

      // Удаляем все сессии пользователя
      await this.revokeAllUserSessions(user.id);

      return newPassword;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();
