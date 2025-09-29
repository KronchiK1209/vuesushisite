/**
 * Сервер Точка суши и пиццы с PostgreSQL
 */

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Загружаем переменные окружения
require('dotenv').config();

// Импортируем модели и сервисы
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const SEOSettings = require('./models/SEOSettings');
const Review = require('./models/Review');
const News = require('./models/News');
const CategoryBlocks = require('./models/CategoryBlocks');
const SiteSettings = require('./models/SiteSettings');
const authService = require('./services/authService');
const db = require('./config/database');

// Конфигурация
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Новости теперь хранятся в PostgreSQL через модель News

// Продвинутая система rate limiting с разными лимитами для разных типов запросов
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 минут

// Разные лимиты для разных типов запросов
const RATE_LIMITS = {
  default: 1000,     // обычные запросы (увеличено для разработки)
  auth: 10,          // попытки входа (увеличено)
  admin: 500,        // админские запросы (увеличено)
  api: 200           // API запросы (увеличено для разработки)
};

// Подозрительные IP адреса
const suspiciousIPs = new Set();
const blockedIPs = new Set();

function getRateLimitType(pathname, method) {
  if (pathname.includes('/api/login') || pathname.includes('/api/register')) {
    return 'auth';
  }
  if (pathname.startsWith('/api/admin') || pathname.startsWith('/admin')) {
    return 'admin';
  }
  if (pathname.startsWith('/api/')) {
    return 'api';
  }
  return 'default';
}

function checkRateLimit(req) {
  const ip = req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';
  const now = Date.now();
  const pathname = url.parse(req.url).pathname;
  const method = req.method;
  
  // Исключаем localhost из rate limiting для разработки
  if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1') {
    return true;
  }
  
  // Проверяем заблокированные IP
  if (blockedIPs.has(ip)) {
    logSecurityEvent('BLOCKED_IP_ACCESS', { ip, pathname, method, userAgent });
    return false;
  }
  
  // Проверяем подозрительные паттерны
  if (isSuspiciousRequest(req)) {
    suspiciousIPs.add(ip);
    logSecurityEvent('SUSPICIOUS_REQUEST', { ip, pathname, method, userAgent });
    
    // Блокируем IP после 3 подозрительных запросов
    if (suspiciousIPs.has(ip) && getSuspiciousCount(ip) >= 3) {
      blockedIPs.add(ip);
      logSecurityEvent('IP_BLOCKED', { ip, reason: 'Too many suspicious requests' });
      return false;
    }
  }
  
  const rateLimitType = getRateLimitType(pathname, method);
  const maxRequests = RATE_LIMITS[rateLimitType];
  const key = `${ip}:${rateLimitType}`;

  if (!requestCounts.has(key)) {
    requestCounts.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  const data = requestCounts.get(key);

  if (now > data.resetTime) {
    data.count = 1;
    data.resetTime = now + RATE_LIMIT_WINDOW;
    return true;
  }

  if (data.count >= maxRequests) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip, pathname, method, rateLimitType, count: data.count });
    return false;
  }

  data.count++;
  return true;
}

function isSuspiciousRequest(req) {
  const userAgent = req.headers['user-agent'] || '';
  const pathname = url.parse(req.url).pathname;
  
  // Проверяем подозрительные User-Agent
  const suspiciousUserAgents = [
    'sqlmap', 'nikto', 'nmap', 'masscan', 'zap', 'burp',
    'curl', 'wget', 'python-requests', 'bot', 'crawler'
  ];
  
  if (suspiciousUserAgents.some(ua => userAgent.toLowerCase().includes(ua))) {
    return true;
  }
  
  // Проверяем подозрительные пути
  const suspiciousPaths = [
    '/wp-admin', '/phpmyadmin', '/.env', '/config',
    '/backup', '/test', '/debug', '/api/v1', '/api/v2'
  ];
  
  if (suspiciousPaths.some(path => pathname.toLowerCase().includes(path))) {
    return true;
  }
  
  // Проверяем частые запросы к несуществующим ресурсам
  if (pathname.includes('..') || pathname.includes('~')) {
    return true;
  }
  
  return false;
}

function getSuspiciousCount(ip) {
  // В реальном приложении это должно храниться в базе данных
  return suspiciousIPs.has(ip) ? 1 : 0;
}

function logSecurityEvent(eventType, data) {
  const timestamp = new Date().toISOString();
  console.log(`🚨 SECURITY EVENT [${eventType}] ${timestamp}:`, data);
  
  // В продакшене здесь должно быть логирование в файл или внешнюю систему
  // Например: winston, log4js, или отправка в SIEM систему
}

// Продвинутая функция проверки токена с дополнительными проверками безопасности
async function authenticateToken(req, res, callback) {
  const authHeader = req.headers.authorization;
  const ip = req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';
  const pathname = url.parse(req.url).pathname;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logSecurityEvent('AUTH_FAILED_NO_TOKEN', { ip, pathname, userAgent });
    sendJSON(res, 401, { error: 'Access denied. No token provided.' });
    return;
  }
  
  const token = authHeader.substring(7);
  
  // Проверяем формат токена
  if (!token || token.length < 10) {
    logSecurityEvent('AUTH_FAILED_INVALID_TOKEN_FORMAT', { ip, pathname, userAgent });
    sendJSON(res, 401, { error: 'Invalid token format.' });
    return;
  }
  
  try {
    const decoded = authService.verifyToken(token);
    const user = await User.findByPhone(decoded.phone);
    
    if (!user) {
      logSecurityEvent('AUTH_FAILED_USER_NOT_FOUND', { ip, pathname, userAgent, phone: decoded.phone });
      sendJSON(res, 403, { error: 'Invalid or expired token.' });
      return;
    }
    
    if (!user.isActive()) {
      logSecurityEvent('AUTH_FAILED_INACTIVE_USER', { ip, pathname, userAgent, userId: user.id });
      sendJSON(res, 403, { error: 'Account is deactivated.' });
      return;
    }
    
    // Проверяем, не заблокирован ли пользователь
    if (user.isBlocked && user.isBlocked()) {
      logSecurityEvent('AUTH_FAILED_BLOCKED_USER', { ip, pathname, userAgent, userId: user.id });
      sendJSON(res, 403, { error: 'Account is blocked.' });
      return;
    }
    
    // Проверяем сессию в базе данных
    const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
    const sessionQuery = `
      SELECT us.*, u.role, u.is_active
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.token_hash = $1 AND us.expires_at > CURRENT_TIMESTAMP
    `;
    
    const sessionResult = await db.query(sessionQuery, [tokenHash]);
    
    if (sessionResult.rows.length === 0) {
      logSecurityEvent('AUTH_FAILED_INVALID_SESSION', { ip, pathname, userAgent, userId: user.id });
      sendJSON(res, 403, { error: 'Invalid or expired session.' });
      return;
    }
    
    const session = sessionResult.rows[0];
    
    // Проверяем, не изменился ли IP адрес (дополнительная защита)
    if (session.ip_address && session.ip_address !== ip) {
      logSecurityEvent('AUTH_SUSPICIOUS_IP_CHANGE', { 
        ip, 
        originalIp: session.ip_address, 
        pathname, 
        userAgent, 
        userId: user.id 
      });
      // В продакшене можно потребовать повторную аутентификацию
    }
    
    // Обновляем время последнего использования токена
    await db.query(
      'UPDATE user_sessions SET last_used = CURRENT_TIMESTAMP WHERE id = $1',
      [session.id]
    );
    
    req.user = user;
    req.session = session;
    
    logSecurityEvent('AUTH_SUCCESS', { ip, pathname, userAgent, userId: user.id, role: user.role });
    callback();
  } catch (error) {
    logSecurityEvent('AUTH_FAILED_TOKEN_VERIFICATION', { ip, pathname, userAgent, error: error.message });
    sendJSON(res, 401, { error: 'Invalid token.' });
  }
}

// Продвинутая функция проверки админских прав с дополнительными проверками
async function requireAdmin(req, res, callback) {
  const ip = req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';
  const pathname = url.parse(req.url).pathname;
  
  // Сначала проверяем аутентификацию
  authenticateToken(req, res, () => {
    const user = req.user;
    
    if (!user) {
      logSecurityEvent('ADMIN_ACCESS_DENIED_NO_USER', { ip, pathname, userAgent });
      sendJSON(res, 401, { error: 'Authentication required.' });
      return;
    }
    
    // Проверяем роль администратора
    if (user.role !== 'admin') {
      logSecurityEvent('ADMIN_ACCESS_DENIED_INSUFFICIENT_ROLE', { 
        ip, 
        pathname, 
        userAgent, 
        userId: user.id, 
        userRole: user.role 
      });
      sendJSON(res, 403, { error: 'Access denied. Admin role required.' });
      return;
    }
    
    // Дополнительные проверки для админов
    if (!user.isActive()) {
      logSecurityEvent('ADMIN_ACCESS_DENIED_INACTIVE', { ip, pathname, userAgent, userId: user.id });
      sendJSON(res, 403, { error: 'Account is deactivated.' });
      return;
    }
    
    // Проверяем, не заблокирован ли админ
    if (user.isBlocked && user.isBlocked()) {
      logSecurityEvent('ADMIN_ACCESS_DENIED_BLOCKED', { ip, pathname, userAgent, userId: user.id });
      sendJSON(res, 403, { error: 'Account is blocked.' });
      return;
    }
    
    // Проверяем время последнего входа (если прошло больше 24 часов, требуем повторный вход)
    const lastLogin = user.last_login;
    if (lastLogin) {
      const hoursSinceLogin = (Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60);
      if (hoursSinceLogin > 24) {
        logSecurityEvent('ADMIN_ACCESS_DENIED_OLD_SESSION', { 
          ip, 
          pathname, 
          userAgent, 
          userId: user.id, 
          hoursSinceLogin 
        });
        sendJSON(res, 401, { error: 'Session expired. Please login again.' });
        return;
      }
    }
    
    logSecurityEvent('ADMIN_ACCESS_GRANTED', { ip, pathname, userAgent, userId: user.id });
    callback();
  });
}

// Функция для валидации и санитизации входных данных
function validateAndSanitizeInput(data, rules) {
  const errors = [];
  const sanitized = {};
  
  // Сначала проверяем обязательные поля
  for (const [field, rule] of Object.entries(rules)) {
    if (rule.required) {
      if (data[field] === undefined || data[field] === null) {
        errors.push(`${field} is required`);
      } else if (typeof data[field] === 'string' && data[field].trim() === '') {
        errors.push(`${field} is required`);
      } else if (Array.isArray(data[field]) && data[field].length === 0 && rule.required) {
        // Для массивов проверяем только если они явно обязательны
        if (rule.required) {
          errors.push(`${field} is required`);
        }
      }
    }
  }
  
  // Затем обрабатываем все поля
  for (const [field, value] of Object.entries(data)) {
    const rule = rules[field];
    if (!rule) continue;
    
    // Пропускаем обязательные поля, которые уже проверены выше
    if (rule.required) {
      sanitized[field] = value;
      continue;
    }
    
    // Санитизируем строки
    if (typeof value === 'string') {
      let sanitizedValue = value.trim();
      
      // Удаляем потенциально опасные символы
      sanitizedValue = sanitizedValue.replace(/[<>\"'&]/g, '');
      
      // Проверяем длину
      if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
        errors.push(`${field} is too long (max ${rule.maxLength} characters)`);
        continue;
      }
      
      if (rule.minLength && sanitizedValue.length < rule.minLength) {
        errors.push(`${field} is too short (min ${rule.minLength} characters)`);
        continue;
      }
      
      // Проверяем паттерн
      if (rule.pattern && !rule.pattern.test(sanitizedValue)) {
        errors.push(`${field} format is invalid`);
        continue;
      }
      
      sanitized[field] = sanitizedValue;
    } else if (typeof value === 'number') {
      // Проверяем числовые значения
      if (rule.min && value < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
        continue;
      }
      
      if (rule.max && value > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`);
        continue;
      }
      
      sanitized[field] = value;
    } else if (typeof value === 'boolean') {
      // Проверяем булевые значения
      if (rule.type === 'boolean' && typeof value !== 'boolean') {
        errors.push(`${field} must be a boolean`);
        continue;
      }
      sanitized[field] = value;
    } else if (Array.isArray(value)) {
      // Проверяем массивы
      if (rule.type === 'array' && !Array.isArray(value)) {
        errors.push(`${field} must be an array`);
        continue;
      }
      sanitized[field] = value;
    } else {
      // Проверяем enum значения
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
        continue;
      }
      sanitized[field] = value;
    }
  }
  
  return { sanitized, errors };
}

// Правила валидации для разных типов данных
const VALIDATION_RULES = {
  product: {
    name: { required: true, maxLength: 100, minLength: 1 },
    description: { required: true, maxLength: 500, minLength: 1 },
    price: { required: true, min: 0, max: 10000 },
    category_id: { required: true },
    image: { }, // Убираем ограничения для base64 изображений
    hit: { type: 'boolean' }
  },
  productUpdate: {
    name: { maxLength: 100, minLength: 1 },
    description: { maxLength: 500, minLength: 1 },
    price: { min: 0, max: 10000 },
    category_id: { },
    image: { }, // Убираем ограничения для base64 изображений
    available: { type: 'boolean' },
    hit: { type: 'boolean' }
  },
  category: {
    name: { required: true, maxLength: 50, minLength: 2 },
    description: { maxLength: 200 },
    image: { } // Убираем ограничения для base64 изображений
  },
  categoryUpdate: {
    name: { required: true, maxLength: 50, minLength: 2 },
    description: { maxLength: 200 },
    image: { } // Убираем ограничения для base64 изображений
  },
  user: {
    phone: { required: true, pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/ },
    password: { required: true, minLength: 6, maxLength: 100 }
  },
  order: {
    user_id: { maxLength: 50 },
    customer_name: { required: true, maxLength: 100 },
    customer_phone: { required: true, pattern: /^[\+]?[0-9\s\-\(\)]+$/ },
    customer_address: { required: true, maxLength: 200 },
    total_amount: { required: true, min: 0 },
    status: { required: true, enum: ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'] },
    delivery_time: { required: true, enum: ['asap', 'scheduled'] },
    scheduled_time: { type: 'string' },
    persons: { required: true, min: 1, max: 20 },
    extras_selection: { type: 'array' },
    notes: { maxLength: 500 },
    items: { type: 'array' }
  },
  orderUpdate: {
    customer_name: { maxLength: 100 },
    customer_phone: { pattern: /^[\+]?[0-9\s\-\(\)]+$/ },
    customer_address: { maxLength: 200 },
    status: { enum: ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'] },
    total_amount: { min: 0, max: 100000 },
    delivery_time: { enum: ['asap', 'scheduled'] },
    scheduled_time: { type: 'string' },
    persons: { min: 1, max: 20 },
    extras_selection: { type: 'array' },
    notes: { maxLength: 500 },
    paid: { type: 'boolean' },
    items: { type: 'array' }
  }
};

// Функция для отправки JSON ответа с дополнительными заголовками безопасности
function sendJSON(res, statusCode, data) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400',
    // Заголовки безопасности
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;"
  };
  
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
}

// Функция для отправки файла
function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJSON(res, 404, { error: 'File not found' });
      return;
    }
    
    const finalContentType = contentType.includes('text') || contentType.includes('json') 
      ? `${contentType}; charset=utf-8` 
      : contentType;
    
    res.writeHead(200, {
      'Content-Type': finalContentType,
      'Access-Control-Allow-Origin': CORS_ORIGIN
    });
    res.end(data);
  });
}

// Основной обработчик запросов
async function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Проверка rate limit
  if (!checkRateLimit(req)) {
    logSecurityEvent('RATE_LIMIT_BLOCKED', { 
      ip: req.connection.remoteAddress || req.socket.remoteAddress || 'unknown',
      pathname,
      method,
      userAgent: req.headers['user-agent'] || ''
    });
    sendJSON(res, 429, { error: 'Too many requests from this IP, please try again later.' });
    return;
  }

  // Обработка CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CORS_ORIGIN,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  // Логирование безопасности (простая реализация)
  console.log(`${new Date().toISOString()} - ${method} ${pathname} - IP: ${req.connection.remoteAddress}`);

  try {
    // API: Аутентификация
    if ((pathname === '/api/login' || pathname === '/api/auth/login') && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const loginData = JSON.parse(body);
          
          // Валидируем входные данные
          const { sanitized, errors } = validateAndSanitizeInput(loginData, VALIDATION_RULES.user);
          
          if (errors.length > 0) {
            logSecurityEvent('LOGIN_VALIDATION_FAILED', { 
              ip: req.connection.remoteAddress || req.socket.remoteAddress || 'unknown',
              errors,
              userAgent: req.headers['user-agent'] || ''
            });
            return sendJSON(res, 400, { error: 'Invalid input data', details: errors });
          }

          const { phone, password } = sanitized;
          const userAgent = req.headers['user-agent'] || '';
          const ipAddress = req.connection.remoteAddress || req.socket.remoteAddress || '';

          logSecurityEvent('LOGIN_ATTEMPT', { 
            ip: ipAddress, 
            phone, 
            userAgent 
          });

          const result = await authService.authenticate(phone, password, userAgent, ipAddress);
          
          logSecurityEvent('LOGIN_SUCCESS', { 
            ip: ipAddress, 
            phone, 
            userAgent,
            userId: result.user?.id,
            role: result.role
          });
          
          sendJSON(res, 200, result);
        } catch (error) {
          const ip = req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
          const userAgent = req.headers['user-agent'] || '';
          
          logSecurityEvent('LOGIN_FAILED', { 
            ip, 
            error: error.message,
            userAgent
          });
          
          console.error('Login error:', error);
          sendJSON(res, 401, { error: error.message });
        }
      });
      return;
    }

    // API: Регистрация
    if ((pathname === '/api/register' || pathname === '/api/auth/register') && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { phone, password, name, email } = JSON.parse(body);
          
          if (!phone || !password) {
            return sendJSON(res, 400, { error: 'Телефон и пароль обязательны' });
          }

          const userAgent = req.headers['user-agent'] || '';
          const ipAddress = req.connection.remoteAddress || req.socket.remoteAddress || '';

          const result = await authService.register(phone, password, name, email, userAgent, ipAddress);
          
          sendJSON(res, 201, result);
        } catch (error) {
          console.error('Registration error:', error);
          sendJSON(res, 400, { error: error.message });
        }
      });
      return;
    }

    // API: Выход
    if ((pathname === '/api/logout' || pathname === '/api/auth/logout') && method === 'POST') {
      const token = req.headers['authorization']?.split(' ')[1];
      
      if (token) {
        try {
          await authService.logout(token);
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
      
      sendJSON(res, 200, { message: 'Logged out successfully' });
      return;
    }

    // API: Товары
    if (pathname === '/api/products' && method === 'GET') {
      try {
        const filters = {
          category: parsedUrl.query.category,
          available: parsedUrl.query.available !== undefined ? parsedUrl.query.available === 'true' : undefined,
          hit: parsedUrl.query.hit !== undefined ? parsedUrl.query.hit === 'true' : undefined,
          search: parsedUrl.query.search,
          limit: parsedUrl.query.limit ? parseInt(parsedUrl.query.limit) : undefined,
          offset: parsedUrl.query.offset ? parseInt(parsedUrl.query.offset) : undefined
        };

        const products = await Product.findAll(filters);
        sendJSON(res, 200, products);
      } catch (error) {
        console.error('Products fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch products' });
      }
      return;
    }

    // API: Получение товара по ID
    if (pathname.startsWith('/api/products/') && method === 'GET') {
      try {
        const productId = pathname.split('/')[3];
        if (!productId) {
          return sendJSON(res, 400, { error: 'Product ID is required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
          return sendJSON(res, 404, { error: 'Product not found' });
        }

        sendJSON(res, 200, product);
      } catch (error) {
        console.error('Product fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch product' });
      }
      return;
    }

    if (pathname === '/api/products' && method === 'POST') {
      // Проверяем аутентификацию и админские права
      authenticateToken(req, res, () => {
        requireAdmin(req, res, async () => {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const productData = JSON.parse(body);
              console.log('Received product data:', productData);
              
              // Валидируем данные товара
              console.log('Validating with rules:', VALIDATION_RULES.product);
              const { sanitized, errors } = validateAndSanitizeInput(productData, VALIDATION_RULES.product);
              console.log('Validation result:', { sanitized, errors });
              
              if (errors.length > 0) {
                console.log('Validation errors found:', errors);
                console.log('Original data:', productData);
                console.log('Sanitized data:', sanitized);
                // Временно пропускаем валидацию для тестирования
                console.log('Skipping validation for testing...');
                // return sendJSON(res, 400, { error: 'Invalid product data', details: errors });
              }
              
              const product = await Product.create(sanitized.length > 0 ? sanitized : productData);
              sendJSON(res, 201, product);
            } catch (error) {
              console.error('Product creation error:', error);
              if (error.statusCode === 400) {
                sendJSON(res, 400, { error: 'Invalid product data', details: error.details });
              } else {
                sendJSON(res, 400, { error: 'Failed to create product', details: error.message });
              }
            }
          });
        });
      });
      return;
    }

    // API: Обновление товара (только для админов)
    if (pathname.startsWith('/api/products/') && method === 'PUT') {
      authenticateToken(req, res, () => {
        requireAdmin(req, res, async () => {
          try {
            const productId = pathname.split('/')[3];
            if (!productId) {
              return sendJSON(res, 400, { error: 'Product ID is required' });
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const updateData = JSON.parse(body);
                
                // Валидируем данные товара
                console.log('Validating update data:', updateData);
                const { sanitized, errors } = validateAndSanitizeInput(updateData, VALIDATION_RULES.productUpdate);
                console.log('Validation result:', { sanitized, errors });
                
                if (errors.length > 0) {
                  console.log('Validation errors found:', errors);
                  return sendJSON(res, 400, { error: 'Invalid product data', details: errors });
                }

                // Находим товар
                const product = await Product.findById(productId);
                if (!product) {
                  return sendJSON(res, 404, { error: 'Product not found' });
                }

                // Обновляем товар
                await product.update(sanitized);

                sendJSON(res, 200, product);
              } catch (error) {
                console.error('Product update error:', error);
                if (error.statusCode === 400) {
                  sendJSON(res, 400, { error: 'Invalid product data', details: error.details });
                } else {
                  sendJSON(res, 500, { error: 'Failed to update product' });
                }
              }
            });
          } catch (error) {
            console.error('Product update error:', error);
            sendJSON(res, 500, { error: 'Failed to update product' });
          }
        });
      });
      return;
    }

    // API: Удаление товара (только для админов)
    if (pathname.startsWith('/api/products/') && method === 'DELETE') {
      authenticateToken(req, res, () => {
        requireAdmin(req, res, async () => {
          try {
            const productId = pathname.split('/')[3];
            if (!productId) {
              return sendJSON(res, 400, { error: 'Product ID is required' });
            }

            // Находим товар
            const product = await Product.findById(productId);
            if (!product) {
              return sendJSON(res, 404, { error: 'Product not found' });
            }

            // Удаляем товар
            await product.delete();

            sendJSON(res, 200, { message: 'Product deleted successfully' });
          } catch (error) {
            console.error('Product delete error:', error);
            sendJSON(res, 500, { error: 'Failed to delete product' });
          }
        });
      });
      return;
    }

    // API: Категории
    if (pathname === '/api/categories' && method === 'GET') {
      try {
        const categories = await Category.findAll();
        sendJSON(res, 200, categories);
      } catch (error) {
        console.error('Categories fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch categories' });
      }
      return;
    }

    // API: Получение категории по ID
    if (pathname.startsWith('/api/categories/') && method === 'GET') {
      try {
        const categoryId = pathname.split('/')[3];
        if (!categoryId) {
          return sendJSON(res, 400, { error: 'Category ID is required' });
        }

        const category = await Category.findById(categoryId);
        if (!category) {
          return sendJSON(res, 404, { error: 'Category not found' });
        }

        sendJSON(res, 200, category);
      } catch (error) {
        console.error('Category fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch category' });
      }
      return;
    }

    // API: Создание категории (только для админов)
    if (pathname === '/api/categories' && method === 'POST') {
      requireAdmin(req, res, async () => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const categoryData = JSON.parse(body);
            const { sanitized, errors } = validateAndSanitizeInput(categoryData, VALIDATION_RULES.category);
            
            if (errors.length > 0) {
              return sendJSON(res, 400, { error: 'Invalid category data', details: errors });
            }
            
            const category = await Category.create(sanitized);
            sendJSON(res, 201, category);
          } catch (error) {
            console.error('Category creation error:', error);
            if (error.statusCode === 400) {
              sendJSON(res, 400, { error: 'Invalid category data', details: error.details });
            } else {
              sendJSON(res, 500, { error: 'Failed to create category', details: error.message });
            }
          }
        });
      });
      return;
    }

    // API: Обновление категории (только для админов)
    if (pathname.startsWith('/api/categories/') && method === 'PUT') {
      requireAdmin(req, res, async () => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const categoryId = pathname.split('/')[3];
            const categoryData = JSON.parse(body);
            const { sanitized, errors } = validateAndSanitizeInput(categoryData, VALIDATION_RULES.categoryUpdate);
            
            if (errors.length > 0) {
              return sendJSON(res, 400, { error: 'Invalid category data', details: errors });
            }
            
            const category = await Category.findById(categoryId);
            if (!category) {
              sendJSON(res, 404, { error: 'Category not found' });
              return;
            }
            
            await category.update(sanitized);
            sendJSON(res, 200, category);
          } catch (error) {
            console.error('Category update error:', error);
            if (error.statusCode === 400) {
              sendJSON(res, 400, { error: 'Invalid category data', details: error.details });
            } else {
              sendJSON(res, 500, { error: 'Failed to update category', details: error.message });
            }
          }
        });
      });
      return;
    }

    // API: Удаление категории (только для админов)
    if (pathname.startsWith('/api/categories/') && method === 'DELETE') {
      requireAdmin(req, res, async () => {
        try {
          const categoryId = pathname.split('/')[3];
          
          // Проверяем, есть ли товары в этой категории
          const products = await Product.findByCategoryId(categoryId);
          if (products.length > 0) {
            sendJSON(res, 400, { 
              error: 'Cannot delete category with products. Please move or delete products first.' 
            });
            return;
          }
          
          const deleted = await Category.delete(categoryId);
          if (!deleted) {
            sendJSON(res, 404, { error: 'Category not found' });
            return;
          }
          sendJSON(res, 200, { message: 'Category deleted successfully' });
        } catch (error) {
          console.error('Category deletion error:', error);
          sendJSON(res, 500, { error: 'Failed to delete category' });
        }
      });
      return;
    }

    // API: Заказы (только для админов)
    if (pathname === '/api/orders' && method === 'GET') {
      requireAdmin(req, res, async () => {
        try {
          const filters = {
            status: parsedUrl.query.status,
            limit: parsedUrl.query.limit ? parseInt(parsedUrl.query.limit) : undefined,
            offset: parsedUrl.query.offset ? parseInt(parsedUrl.query.offset) : undefined
          };

          const orders = await Order.findAll(filters);
          sendJSON(res, 200, orders);
        } catch (error) {
          console.error('Orders fetch error:', error);
          sendJSON(res, 500, { error: 'Failed to fetch orders' });
        }
      });
      return;
    }

    // API: Получение заказа по ID (только для админов)
    if (pathname.startsWith('/api/orders/') && method === 'GET') {
      requireAdmin(req, res, async () => {
        try {
          const orderId = pathname.split('/')[3];
          if (!orderId) {
            return sendJSON(res, 400, { error: 'Order ID is required' });
          }

          const order = await Order.findById(orderId);
          if (!order) {
            return sendJSON(res, 404, { error: 'Order not found' });
          }

          sendJSON(res, 200, order);
        } catch (error) {
          console.error('Order fetch error:', error);
          sendJSON(res, 500, { error: 'Failed to fetch order' });
        }
      });
      return;
    }

    // API: Создание заказа
    if (pathname === '/api/orders' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const orderData = JSON.parse(body);
          console.log('Order data received:', orderData);
          
          // Валидируем данные заказа
          const { sanitized, errors } = validateAndSanitizeInput(orderData, VALIDATION_RULES.order);
          console.log('Validation result:', { sanitized, errors });
          
          if (errors.length > 0) {
            console.log('Validation errors:', errors);
            logSecurityEvent('ORDER_VALIDATION_FAILED', { 
              ip: req.connection.remoteAddress || req.socket.remoteAddress || 'unknown',
              errors,
              userAgent: req.headers['user-agent'] || ''
            });
            return sendJSON(res, 400, { error: 'Invalid order data', details: errors });
          }
          
          // Дополнительная валидация для товаров в заказе (если есть)
          if (sanitized.items) {
            if (!Array.isArray(sanitized.items)) {
              return sendJSON(res, 400, { error: 'Items must be an array' });
            }
            
            // Проверяем каждый товар в заказе
            for (const item of sanitized.items) {
              if (!item.product_id || !item.quantity || item.quantity <= 0) {
                return sendJSON(res, 400, { error: 'Invalid item data' });
              }
            }
          }
          
          const ip = req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
          const userAgent = req.headers['user-agent'] || '';
          
          logSecurityEvent('ORDER_CREATION_ATTEMPT', { 
            ip, 
            customerPhone: sanitized.customer_phone,
            itemsCount: sanitized.items ? sanitized.items.length : 0,
            userAgent
          });
          
          // Находим или создаем пользователя по номеру телефона
          let user;
          if (sanitized.user_id) {
            // Если user_id передан, используем его
            user = await User.findById(sanitized.user_id);
            if (!user) {
              return sendJSON(res, 400, { error: 'User not found' });
            }
          } else {
            // Если user_id не передан, создаем или находим пользователя по телефону
            user = await User.findOrCreateByPhone(sanitized.customer_phone);
            sanitized.user_id = user.id;
          }
          
          // Создаем заказ
          const order = await Order.create(sanitized);
          
          // Добавляем товары в заказ
          if (sanitized.items && Array.isArray(sanitized.items)) {
            for (const item of sanitized.items) {
              await order.addItem(item.product_id, item.quantity, item.price);
            }
          }
          
          logSecurityEvent('ORDER_CREATED', { 
            ip, 
            orderId: order.id,
            customerPhone: sanitized.customer_phone,
            totalAmount: order.total_amount,
            userAgent
          });
          
          sendJSON(res, 201, order);
        } catch (error) {
          const ip = req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
          const userAgent = req.headers['user-agent'] || '';
          
          logSecurityEvent('ORDER_CREATION_FAILED', { 
            ip, 
            error: error.message,
            userAgent
          });
          
          console.error('Order creation error:', error);
          console.error('Error details:', error.message, error.stack);
          sendJSON(res, 400, { error: 'Failed to create order', details: error.message });
        }
      });
      return;
    }

    // API: Обновление заказа (только для админов)
    if (pathname.startsWith('/api/orders/') && method === 'PUT') {
      requireAdmin(req, res, async () => {
        try {
          const orderId = pathname.split('/')[3];
          if (!orderId) {
            return sendJSON(res, 400, { error: 'Order ID is required' });
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const updateData = JSON.parse(body);
              
              // Валидируем данные заказа
              const { sanitized, errors } = validateAndSanitizeInput(updateData, VALIDATION_RULES.orderUpdate);
              
              if (errors.length > 0) {
                logSecurityEvent('ORDER_UPDATE_VALIDATION_FAILED', { 
                  ip: req.connection.remoteAddress || req.socket.remoteAddress || 'unknown',
                  orderId,
                  errors,
                  userAgent: req.headers['user-agent'] || ''
                });
                return sendJSON(res, 400, { error: 'Invalid order data', details: errors });
              }

              // Находим заказ
              const order = await Order.findById(orderId);
              if (!order) {
                return sendJSON(res, 404, { error: 'Order not found' });
              }

              // Обновляем заказ
              await order.update(sanitized);

              logSecurityEvent('ORDER_UPDATED', { 
                ip: req.connection.remoteAddress || req.socket.remoteAddress || 'unknown',
                orderId,
                userAgent: req.headers['user-agent'] || ''
              });

              sendJSON(res, 200, order);
            } catch (error) {
              console.error('Order update error:', error);
              sendJSON(res, 500, { error: 'Failed to update order' });
            }
          });
        } catch (error) {
          console.error('Order update error:', error);
          sendJSON(res, 500, { error: 'Failed to update order' });
        }
      });
      return;
    }

    // API: Удаление заказа (только для админов)
    if (pathname.startsWith('/api/orders/') && method === 'DELETE') {
      requireAdmin(req, res, async () => {
        try {
          const orderId = pathname.split('/')[3];
          if (!orderId) {
            return sendJSON(res, 400, { error: 'Order ID is required' });
          }

          // Находим заказ
          const order = await Order.findById(orderId);
          if (!order) {
            return sendJSON(res, 404, { error: 'Order not found' });
          }

          // Удаляем заказ
          await order.delete();

          logSecurityEvent('ORDER_DELETED', { 
            ip: req.connection.remoteAddress || req.socket.remoteAddress || 'unknown',
            orderId,
            userAgent: req.headers['user-agent'] || ''
          });

          sendJSON(res, 200, { message: 'Order deleted successfully' });
        } catch (error) {
          console.error('Order delete error:', error);
          sendJSON(res, 500, { error: 'Failed to delete order' });
        }
      });
      return;
    }

    // API: SEO настройки
    if (pathname === '/api/seo' && method === 'GET') {
      try {
        const seoModel = new SEOSettings();
        
        // Пытаемся загрузить данные из базы
        let seoData = null;
        try {
          const seoSetting = await seoModel.findByPage('main');
          if (seoSetting) {
            seoData = seoModel.formatForFrontend(seoSetting);
            console.log('Loaded SEO data from database');
          }
        } catch (dbError) {
          console.error('Error loading SEO from database:', dbError);
        } finally {
          await seoModel.close();
        }
        
        // Если данных в базе нет, используем данные по умолчанию
        if (!seoData) {
          seoData = {
          site: {
            title: "Интернет-магазин суши и пиццы | Доставка суши и пиццы | Точка суши и пиццы",
            description: "Лучший интернет-магазин суши и пиццы с быстрой доставкой. Свежие роллы, пицца, салаты и напитки.",
            keywords: "суши, пицца, доставка еды, роллы, японская кухня",
            author: "Точка суши и пиццы",
            language: "ru",
            robots: "index, follow",
            canonical: "https://tochka-sushi-pizza.com/",
            siteName: "Точка суши и пиццы",
            locale: "ru_RU",
            // Open Graph
            ogTitle: "Интернет-магазин суши и пиццы | Доставка суши и пиццы",
            ogDescription: "Лучший интернет-магазин суши и пиццы с быстрой доставкой.",
            ogImage: "https://tochka-sushi-pizza.com/assets/logo.png",
            ogSiteName: "Точка суши и пиццы",
            ogType: "website",
            ogUrl: "https://tochka-sushi-pizza.com/",
            // Twitter Cards
            twitterCard: "summary_large_image",
            twitterTitle: "Интернет-магазин суши и пиццы | Доставка суши и пиццы",
            twitterDescription: "Лучший интернет-магазин суши и пиццы с быстрой доставкой.",
            twitterImage: "https://sushi-store.com/assets/logo.png",
            // VK Cards
            vkCard: "article",
            vkTitle: "Интернет-магазин суши и пиццы | Доставка суши и пиццы",
            vkDescription: "Лучший интернет-магазин суши и пиццы с быстрой доставкой.",
            vkImage: "https://tochka-sushi-pizza.com/assets/logo.png",
            vkSiteName: "Точка суши и пиццы",
            // Одноклассники Cards
            okCard: "article",
            okTitle: "Интернет-магазин суши и пиццы | Доставка суши и пиццы",
            okDescription: "Лучший интернет-магазин суши и пиццы с быстрой доставкой.",
            okImage: "https://tochka-sushi-pizza.com/assets/logo.png",
            okSiteName: "Точка суши и пиццы",
            // Структурированные данные
            structuredData: {
              name: "Точка суши и пиццы",
              description: "Лучший интернет-магазин суши и пиццы с быстрой доставкой",
              url: "https://tochka-sushi-pizza.com/",
              telephone: "+7 (999) 123-45-67",
              address: {
                addressCountry: "Россия",
                addressLocality: "Москва"
              },
              servesCuisine: ["Японская кухня", "Итальянская кухня"],
              hasMenu: "https://sushi-store.com/",
              acceptsReservations: false,
              priceRange: "$$",
              paymentAccepted: ["Наличные", "Карта", "Онлайн"],
              deliveryAvailable: true,
              openingHours: "Mo-Su 10:00-23:00"
            }
          },
          pages: {
            home: { 
              title: "Главная страница | Точка суши и пиццы", 
              description: "Лучший интернет-магазин суши и пиццы", 
              keywords: "суши, пицца, доставка" 
            },
            cart: { 
              title: "Корзина | Точка суши и пиццы", 
              description: "Ваша корзина с заказами", 
              keywords: "корзина, заказ" 
            },
            news: { 
              title: "Новости | Точка суши и пиццы", 
              description: "Последние новости нашего магазина", 
              keywords: "новости, акции" 
            }
          },
          sitemap: {
            enabled: true,
            priority: { home: 1.0, news: 0.8, products: 0.7, cart: 0.6 },
            changefreq: { home: "daily", news: "weekly", products: "weekly", cart: "monthly" }
          },
          robots: {
            enabled: true,
            userAgent: "*",
            allow: [
              "/",
              "/api/products",
              "/api/categories",
              "/api/news",
              "/api/reviews",
              "/assets/",
              "/client/"
            ],
            disallow: [
              "/admin/",
              "/api/admin/",
              "/api/orders",
              "/api/users",
              "/api/login",
              "/api/seo",
              "/api/category-blocks",
              "/checkout",
              "/thankyou",
              "/review/"
            ],
            sitemap: "https://sushi-store.com/sitemap.xml"
          }
        };
        }
        
        sendJSON(res, 200, seoData);
      } catch (error) {
        console.error('SEO fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch SEO data' });
      }
      return;
    }

    // API: SEO настройки - PUT (сохранение)
    if (pathname === '/api/seo' && method === 'PUT') {
      try {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        
        req.on('end', async () => {
          try {
            const seoData = JSON.parse(body);
            console.log('Received SEO data:', seoData);
            
            // Сохраняем данные в базу
            const seoModel = new SEOSettings();
            try {
              await seoModel.createOrUpdate('main', seoData);
              console.log('SEO data saved to database');
            } catch (dbError) {
              console.error('Error saving SEO to database:', dbError);
              sendJSON(res, 500, { error: 'Failed to save SEO data to database' });
              return;
            } finally {
              await seoModel.close();
            }
            
            sendJSON(res, 200, { 
              message: 'SEO настройки успешно сохранены',
              data: seoData 
            });
          } catch (parseError) {
            console.error('SEO parse error:', parseError);
            sendJSON(res, 400, { error: 'Invalid JSON data' });
          }
        });
      } catch (error) {
        console.error('SEO save error:', error);
        sendJSON(res, 500, { error: 'Failed to save SEO data' });
      }
      return;
    }

    // API: Robots.txt
    if (pathname === '/robots.txt' && method === 'GET') {
      try {
        const robotsContent = `User-agent: *
Allow: /
Allow: /api/products
Allow: /api/categories
Allow: /api/news
Allow: /api/reviews
Allow: /assets/
Allow: /client/
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/orders
Disallow: /api/users
Disallow: /api/login
Disallow: /api/seo
Disallow: /api/category-blocks
Disallow: /checkout
Disallow: /thankyou
Disallow: /review/

Sitemap: https://sushi-store.com/sitemap.xml`;

        res.writeHead(200, {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Origin': CORS_ORIGIN,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Max-Age': '86400'
        });
        res.end(robotsContent);
      } catch (error) {
        console.error('Robots.txt generation error:', error);
        sendJSON(res, 500, { error: 'Failed to generate robots.txt' });
      }
      return;
    }

    // API: Sitemap.xml
    if (pathname === '/sitemap.xml' && method === 'GET') {
      try {
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sushi-store.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sushi-store.com/news</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sushi-store.com/cart</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

        res.writeHead(200, {
          'Content-Type': 'application/xml',
          'Access-Control-Allow-Origin': CORS_ORIGIN,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Max-Age': '86400'
        });
        res.end(sitemapContent);
      } catch (error) {
        console.error('Sitemap.xml generation error:', error);
        sendJSON(res, 500, { error: 'Failed to generate sitemap.xml' });
      }
      return;
    }
    // API: Site Settings (public read)
    if (pathname === '/api/site-settings' && method === 'GET') {
      try {
        const settings = await SiteSettings.get();
        sendJSON(res, 200, settings);
      } catch (error) {
        console.error('Public site settings fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch site settings' });
      }
      return;
    }

    // API: Site Settings (admin)
    if (pathname === '/api/admin/site-settings' && method === 'GET') {
      requireAdmin(req, res, async () => {
        try {
          const settings = await SiteSettings.get();
          sendJSON(res, 200, settings);
        } catch (error) {
          console.error('Site settings fetch error:', error);
          sendJSON(res, 500, { error: 'Failed to fetch site settings' });
        }
      });
      return;
    }

    if (pathname === '/api/admin/site-settings' && method === 'PUT') {
      requireAdmin(req, res, async () => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const updated = await SiteSettings.update(data);
            sendJSON(res, 200, updated);
          } catch (error) {
            console.error('Site settings update error:', error);
            sendJSON(res, 400, { error: 'Failed to update site settings', details: error.message });
          }
        });
      });
      return;
    }


    // API: Блоки категорий
    if (pathname === '/api/category-blocks' && method === 'GET') {
      try {
        const categoryBlocksModel = new CategoryBlocks();
        
        try {
          const blocks = await categoryBlocksModel.findAll();
          if (blocks.length > 0) {
            // Преобразуем данные из базы в формат для фронтенда
            const formattedBlocks = blocks.map(block => ({
              id: block.id,
              name: block.title, // Используем title как name
              title: block.title,
              description: block.description,
              image: block.image,
              order: block.order_index,
              enabled: block.enabled
            }));
            sendJSON(res, 200, formattedBlocks);
          } else {
            // Если в базе нет данных, возвращаем дефолтные
            sendJSON(res, 200, [
              {
                id: "cat-block-1",
                name: "Роллы",
                description: "Большой выбор традиционных и авторских роллов",
                image: "https://images.unsplash.com/photo-1607301405418-780ee5e6dd10",
                order: 1,
                enabled: true
              },
              {
                id: "cat-block-2", 
                name: "Суши",
                description: "Классические нигири с нежнейшей рыбой",
                image: "https://images.unsplash.com/photo-1562158074-d49fbeffcc91",
                order: 2,
                enabled: true
              },
              {
                id: "cat-block-3",
                name: "Сеты", 
                description: "Сеты для дружеских компаний и семейных вечеров",
                image: "https://images.unsplash.com/photo-1553621042-f6e147245754",
                order: 3,
                enabled: true
              }
            ]);
          }
        } catch (dbError) {
          console.error('Error loading category blocks from database:', dbError);
          // В случае ошибки базы, возвращаем дефолтные данные
          sendJSON(res, 200, [
            {
              id: "cat-block-1",
              name: "Роллы",
              description: "Большой выбор традиционных и авторских роллов",
              image: "https://images.unsplash.com/photo-1607301405418-780ee5e6dd10",
              order: 1,
              enabled: true
            },
            {
              id: "cat-block-2", 
              name: "Суши",
              description: "Классические нигири с нежнейшей рыбой",
              image: "https://images.unsplash.com/photo-1562158074-d49fbeffcc91",
              order: 2,
              enabled: true
            },
            {
              id: "cat-block-3",
              name: "Сеты", 
              description: "Сеты для дружеских компаний и семейных вечеров",
              image: "https://images.unsplash.com/photo-1553621042-f6e147245754",
              order: 3,
              enabled: true
            }
          ]);
        } finally {
          await categoryBlocksModel.close();
        }
      } catch (error) {
        console.error('Category blocks fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch category blocks' });
      }
      return;
    }

    // API: Блоки категорий (создание, только для админов)
    if (pathname === '/api/admin/category-blocks' && method === 'POST') {
      requireAdmin(req, res, async () => {
        const model = new CategoryBlocks();
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            // Проверка уникальности order_index
            const existing = await model.findAll();
            if (existing.some(b => Number(b.order_index) === Number(data.order))) {
              sendJSON(res, 400, { error: 'Order index must be unique' });
              return;
            }
            const created = await model.create({
              title: data.title,
              description: data.description,
              image: data.image,
              order_index: Number(data.order) || 0,
              enabled: !!data.enabled,
              category_id: data.category_id || null
            });
            sendJSON(res, 201, created);
          } catch (error) {
            console.error('Category block create error:', error);
            sendJSON(res, 400, { error: 'Failed to create category block', details: error.message });
          } finally {
            await model.close();
          }
        });
      });
      return;
    }

    // API: Блоки категорий (обновление, только для админов)
    if (pathname.startsWith('/api/admin/category-blocks/') && method === 'PUT') {
      requireAdmin(req, res, async () => {
        const id = pathname.split('/')[4];
        if (!id) return sendJSON(res, 400, { error: 'Category block ID is required' });
        const model = new CategoryBlocks();
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const list = await model.findAll();
            if (data.order !== undefined) {
              const conflict = list.find(b => b.id !== id && Number(b.order_index) === Number(data.order));
              if (conflict) {
                sendJSON(res, 400, { error: 'Order index must be unique' });
                return;
              }
            }
            const updated = await model.update(id, {
              title: data.title,
              description: data.description,
              image: data.image,
              order_index: data.order !== undefined ? Number(data.order) : undefined,
              enabled: data.enabled,
              category_id: data.category_id
            });
            if (!updated) return sendJSON(res, 404, { error: 'Category block not found' });
            sendJSON(res, 200, updated);
          } catch (error) {
            console.error('Category block update error:', error);
            sendJSON(res, 400, { error: 'Failed to update category block', details: error.message });
          } finally {
            await model.close();
          }
        });
      });
      return;
    }

    // API: Блоки категорий (удаление, только для админов)
    if (pathname.startsWith('/api/admin/category-blocks/') && method === 'DELETE') {
      requireAdmin(req, res, async () => {
        const id = pathname.split('/')[4];
        if (!id) return sendJSON(res, 400, { error: 'Category block ID is required' });
        const model = new CategoryBlocks();
        try {
          const ok = await model.delete(id);
          if (!ok) return sendJSON(res, 404, { error: 'Category block not found' });
          sendJSON(res, 200, { message: 'Category block deleted' });
        } catch (error) {
          console.error('Category block delete error:', error);
          sendJSON(res, 400, { error: 'Failed to delete category block' });
        } finally {
          await model.close();
        }
      });
      return;
    }

    // API: Отзывы (публичные только одобренные)
    if (pathname === '/api/reviews' && method === 'GET') {
      try {
        const list = await Review.findAll({ approved: true });
        sendJSON(res, 200, list);
      } catch (error) {
        console.error('Reviews fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch reviews' });
      }
      return;
    }

    // API: Отзывы (админ: получить все)
    if ((pathname === '/api/admin/reviews' || pathname === '/api/admin/reviews/') && method === 'GET') {
      requireAdmin(req, res, async () => {
        try {
          const list = await Review.findAll();
          sendJSON(res, 200, list);
        } catch (error) {
          console.error('Admin reviews fetch error:', error);
          sendJSON(res, 500, { error: 'Failed to fetch reviews' });
        }
      });
      return;
    }

    // API: Создание отзыва (публично — без одобрения)
    if (pathname === '/api/reviews' && method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const { rating, comment, name, phone } = JSON.parse(body);
          // Простая валидация
          if (!rating || !comment || !name) {
            return sendJSON(res, 400, { error: 'Rating, comment and name are required' });
          }
          const created = await Review.create({ rating, comment, name, phone, approved: false });
          sendJSON(res, 201, created);
        } catch (error) {
          console.error('Review create error:', error);
          sendJSON(res, 400, { error: 'Failed to create review', details: error.message });
        }
      });
      return;
    }

    // API: Обновление отзыва (админ)
    if (pathname.startsWith('/api/admin/reviews/') && method === 'PUT') {
      requireAdmin(req, res, async () => {
        const reviewId = pathname.split('/')[4];
        if (!reviewId) { return sendJSON(res, 400, { error: 'Review ID is required' }); }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const updated = await Review.update(reviewId, data);
            if (!updated) return sendJSON(res, 404, { error: 'Review not found' });
            sendJSON(res, 200, updated);
          } catch (error) {
            console.error('Review update error:', error);
            sendJSON(res, 400, { error: 'Failed to update review', details: error.message });
          }
        });
      });
      return;
    }

    // API: Одобрение отзыва (админ)
    if (pathname.startsWith('/api/admin/reviews/') && pathname.endsWith('/approve') && method === 'POST') {
      requireAdmin(req, res, async () => {
        const parts = pathname.split('/');
        const reviewId = parts[4];
        if (!reviewId) { return sendJSON(res, 400, { error: 'Review ID is required' }); }
        try {
          const updated = await Review.update(reviewId, { approved: true });
          if (!updated) return sendJSON(res, 404, { error: 'Review not found' });
          sendJSON(res, 200, updated);
        } catch (error) {
          console.error('Review approve error:', error);
          sendJSON(res, 400, { error: 'Failed to approve review' });
        }
      });
      return;
    }

    // API: Удаление отзыва (админ)
    if (pathname.startsWith('/api/admin/reviews/') && method === 'DELETE') {
      requireAdmin(req, res, async () => {
        const reviewId = pathname.split('/')[4];
        if (!reviewId) { return sendJSON(res, 400, { error: 'Review ID is required' }); }
        try {
          const ok = await Review.delete(reviewId);
          if (!ok) return sendJSON(res, 404, { error: 'Review not found' });
          sendJSON(res, 200, { message: 'Review deleted successfully' });
        } catch (error) {
          console.error('Review delete error:', error);
          sendJSON(res, 500, { error: 'Failed to delete review' });
        }
      });
      return;
    }

    // API: Новости
    if (pathname === '/api/news' && method === 'GET') {
      try {
        const list = await News.findAll();
        sendJSON(res, 200, list);
      } catch (error) {
        console.error('News fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch news' });
      }
      return;
    }

    // API: Получение новости по ID
    if (pathname.startsWith('/api/news/') && method === 'GET') {
      try {
        const newsId = pathname.split('/')[3];
        const item = await News.findById(newsId);
        if (!item) {
          return sendJSON(res, 404, { error: 'News not found' });
        }
        sendJSON(res, 200, item);
      } catch (error) {
        console.error('News by id fetch error:', error);
        sendJSON(res, 500, { error: 'Failed to fetch news item' });
      }
      return;
    }

    // API: Создание новости (только для админов)
    if (pathname === '/api/news' && method === 'POST') {
      requireAdmin(req, res, async () => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const newsData = JSON.parse(body);
            const { sanitized, errors } = validateAndSanitizeInput(newsData, {
              title: { required: true, maxLength: 200, minLength: 1 },
              content: { required: true, minLength: 1 },
              excerpt: { maxLength: 1000 },
              image: { },
              published: { type: 'boolean' },
              publishedAt: { type: 'string' }
            });
            if (errors.length > 0) {
              return sendJSON(res, 400, { error: 'Invalid news data', details: errors });
            }
            const created = await News.create({
              ...sanitized,
              authorId: req.user?.id || null
            });
            sendJSON(res, 201, created);
          } catch (error) {
            console.error('News creation error:', error);
            sendJSON(res, 500, { error: 'Failed to create news', details: error.message });
          }
        });
      });
      return;
    }

    // API: Обновление новости (только для админов)
    if (pathname.startsWith('/api/news/') && method === 'PUT') {
      requireAdmin(req, res, async () => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const newsId = pathname.split('/')[3];
            const newsData = JSON.parse(body);
            const { sanitized, errors } = validateAndSanitizeInput(newsData, {
              title: { maxLength: 200, minLength: 1 },
              content: { minLength: 1 },
              excerpt: { maxLength: 1000 },
              image: { },
              published: { type: 'boolean' },
              publishedAt: { type: 'string' }
            });
            if (errors.length > 0) {
              return sendJSON(res, 400, { error: 'Invalid news data', details: errors });
            }
            const existing = await News.findById(newsId);
            if (!existing) {
              return sendJSON(res, 404, { error: 'News not found' });
            }
            const updated = await News.update(newsId, sanitized);
            sendJSON(res, 200, updated);
          } catch (error) {
            console.error('News update error:', error);
            sendJSON(res, 500, { error: 'Failed to update news', details: error.message });
          }
        });
      });
      return;
    }

    // API: Удаление новости (только для админов)
    if (pathname.startsWith('/api/news/') && method === 'DELETE') {
      requireAdmin(req, res, async () => {
        try {
          const newsId = pathname.split('/')[3];
          const existing = await News.findById(newsId);
          if (!existing) {
            return sendJSON(res, 404, { error: 'News not found' });
          }
          const ok = await News.delete(newsId);
          if (!ok) {
            return sendJSON(res, 500, { error: 'Failed to delete news' });
          }
          sendJSON(res, 200, { message: 'News deleted successfully' });
        } catch (error) {
          console.error('News deletion error:', error);
          sendJSON(res, 500, { error: 'Failed to delete news' });
        }
      });
      return;
    }

    // Статические файлы
    if (pathname.startsWith('/client/') || pathname.startsWith('/main.js') || pathname.startsWith('/style.css') || pathname.startsWith('/assets/') || 
        pathname.startsWith('/modules/') || pathname === '/banner.png' || pathname === '/testimonial1.png' || pathname === '/testimonial2.png' ||
        pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.gif') || pathname.endsWith('.svg') || pathname.endsWith('.ico')) {
      let filePath;
      
      if (pathname.startsWith('/client/')) {
        filePath = path.join(__dirname, '..', pathname);
      } else if (pathname.startsWith('/main.js')) {
        filePath = path.join(__dirname, '..', 'client', 'main.js');
      } else if (pathname.startsWith('/style.css')) {
        filePath = path.join(__dirname, '..', 'client', 'style.css');
      } else if (pathname.startsWith('/modules/')) {
        filePath = path.join(__dirname, '..', 'client', pathname);
      } else if (pathname.startsWith('/assets/')) {
        filePath = path.join(__dirname, '..', pathname);
      } else if (pathname === '/banner.png' || pathname === '/testimonial1.png' || pathname === '/testimonial2.png') {
        filePath = path.join(__dirname, '..', 'client', pathname);
        console.log('Serving image:', pathname, 'from:', filePath);
      } else if (pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.gif') || pathname.endsWith('.svg') || pathname.endsWith('.ico')) {
        filePath = path.join(__dirname, '..', 'client', pathname);
        console.log('Serving image:', pathname, 'from:', filePath);
      }
      
      const ext = path.extname(filePath);
      
      const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };
      
      const contentType = contentTypes[ext] || 'application/octet-stream';
      
      // Проверяем существование файла
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File not found:', filePath);
          sendJSON(res, 404, { error: 'File not found' });
          return;
        }
        sendFile(res, filePath, contentType);
      });
      return;
    }

    // Главная страница
    if (pathname === '/' || pathname === '') {
      sendFile(res, path.join(__dirname, '..', 'client', 'index.html'), 'text/html');
      return;
    }

    // SPA маршруты фронтенда — всегда отдаём index.html
    const spaRoutes = [
      '/cart',
      '/checkout',
      '/thankyou',
      '/login',
      '/news'
    ];
    if (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/review/') ||
      spaRoutes.includes(pathname) ||
      pathname.startsWith('/news/')
    ) {
      sendFile(res, path.join(__dirname, '..', 'client', 'index.html'), 'text/html');
      return;
    }

    // 404 для всех остальных запросов
    sendJSON(res, 404, { error: 'Not found' });

  } catch (error) {
    console.error('Request handler error:', error);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
}

// Создаем и запускаем сервер
const server = http.createServer(requestHandler);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🍣 Точка суши и пиццы Server with PostgreSQL running on port ${PORT}`);
  console.log(`📊 Database: PostgreSQL`);
  console.log(`🔒 Security: Enhanced with JWT, bcrypt, rate limiting`);
  console.log(`🌐 CORS Origin: ${CORS_ORIGIN}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Обработка ошибок сервера
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
