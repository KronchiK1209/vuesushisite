/**
 * Middleware для аутентификации и авторизации
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/database');

// Middleware для проверки JWT токена
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Проверяем токен в базе данных
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
    const sessionQuery = `
      SELECT us.*, u.role, u.is_active
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.token_hash = $1 AND us.expires_at > CURRENT_TIMESTAMP
    `;
    
    const sessionResult = await db.query(sessionQuery, [tokenHash]);
    
    if (sessionResult.rows.length === 0) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    const session = sessionResult.rows[0];
    
    if (!session.is_active) {
      return res.status(403).json({ error: 'User account is deactivated' });
    }

    // Обновляем время последнего использования токена
    await db.query(
      'UPDATE user_sessions SET last_used = CURRENT_TIMESTAMP WHERE id = $1',
      [session.id]
    );

    // Добавляем информацию о пользователе в запрос
    req.user = {
      id: session.user_id,
      role: session.role,
      sessionId: session.id
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware для проверки админских прав
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Middleware для проверки прав пользователя (собственные данные или админ)
const requireOwnershipOrAdmin = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role === 'admin' || req.user.id === userId) {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied' });
  }
};

// Middleware для rate limiting (базовая реализация)
const rateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Очищаем старые записи
    for (const [key, data] of requests.entries()) {
      if (now - data.firstRequest > windowMs) {
        requests.delete(key);
      }
    }
    
    const userRequests = requests.get(ip);
    
    if (!userRequests) {
      requests.set(ip, {
        count: 1,
        firstRequest: now
      });
      next();
    } else if (now - userRequests.firstRequest > windowMs) {
      requests.set(ip, {
        count: 1,
        firstRequest: now
      });
      next();
    } else if (userRequests.count >= maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: Math.ceil((userRequests.firstRequest + windowMs - now) / 1000)
      });
    } else {
      userRequests.count++;
      next();
    }
  };
};

// Middleware для логирования безопасности
const securityLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Логируем подозрительную активность
    if (res.statusCode >= 400) {
      const logData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        userId: req.user?.id
      };
      
      console.log('Security Event:', JSON.stringify(logData));
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware для валидации входных данных
const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.details.map(d => d.message) 
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Validation error' });
    }
  };
};

// Middleware для очистки истекших сессий
const cleanupExpiredSessions = async () => {
  try {
    const result = await db.query(
      'DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP'
    );
    console.log(`Cleaned up ${result.rowCount} expired sessions`);
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
};

// Запускаем очистку сессий каждые 5 минут
setInterval(cleanupExpiredSessions, 5 * 60 * 1000);

module.exports = {
  authenticateToken,
  requireAdmin,
  requireOwnershipOrAdmin,
  rateLimit,
  securityLogger,
  validateInput,
  cleanupExpiredSessions
};
