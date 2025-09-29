const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');

// Путь к файлу базы данных
const DATA_FILE = path.join(__dirname, 'db.json');
// Путь к клиентскому приложению. Если вы используете сборщик (vite/webpack),
// указывайте папку dist. В противном случае клиентские файлы находятся в ../client.
const CLIENT_DIST = fs.existsSync(path.join(__dirname, '../client/dist'))
  ? path.join(__dirname, '../client/dist')
  : path.join(__dirname, '../client');

// Временное хранилище сессий. Ключ — токен, значение — объект пользователя.
// В продакшен‑окружении лучше использовать Redis или другую БД для хранения сессий.
const SESSIONS_FILE = path.join(__dirname, 'sessions.json');
let sessions = {};

// Загружаем сессии из файла при запуске
try {
  if (fs.existsSync(SESSIONS_FILE)) {
    const sessionsData = fs.readFileSync(SESSIONS_FILE, 'utf8');
    sessions = JSON.parse(sessionsData);
  }
} catch (e) {
  // Начинаем с пустых сессий
}

// Функция для сохранения сессий в файл
function saveSessions() {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving sessions:', e);
  }
}

/**
 * Извлекает пользователя из заголовка Authorization.
 * Ожидается заголовок вида "Bearer <token>". Если токен существует
 * в sessions, возвращает соответствующего пользователя, иначе null.
 * @param {http.IncomingMessage} req
 * @returns {object|null}
 */
function getUserFromAuth(req) {
  const auth = req.headers['authorization'];
  if (!auth || typeof auth !== 'string') return null;
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  const token = parts[1];
  return sessions[token] || null;
}

/**
 * Считывает данные из JSON‑файла базы данных.
 * Возвращает объект вида { products: [], news: [] }.
 */
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

/**
 * Записывает данные в JSON‑файл базы данных.
 * @param {object} data Объект данных
 */
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Генерация простого уникального идентификатора для новых записей.
 * Использует текущее время и случайную составляющую.
 */
function generateId(prefix = 'id') {
  return (
    prefix +
    Math.random().toString(36).substring(2, 8) +
    Date.now().toString(36)
  );
}

/**
 * Отправляет JSON ответ со статусом и данными.
 */
function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  // Разрешаем безопасные CDN домены для скриптов, стилей и изображений, а также inline-стили.
  const csp = [
    // Разрешаем загрузку ресурсов только с доверенных доменов
    "default-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com https://images.unsplash.com",
    // Для скриптов позволяем использование unsafe-eval, т.к. Vue компилирует шаблоны в рантайме
    "script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com",
    // Для элементов script (CSP level 3)
    "script-src-elem 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com",
    // Для стилей разрешаем инлайновые стили и стили из CDN
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
    // Для элементов style (CSP level 3)
    "style-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
    // Разрешаем инлайновые style-атрибуты
    "style-src-attr 'self' 'unsafe-inline'",
    // Разрешаем загрузку изображений с наших доменов и с Unsplash
    "img-src 'self' data: https://images.unsplash.com https://cdn.jsdelivr.net",
    // Разрешаем загрузку шрифтов с CDN
    "font-src 'self' https://cdnjs.cloudflare.com",
    // Ограничиваем connect-src только нашим доменом
    "connect-src 'self'"
  ].join('; ');
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'same-origin',
    'Content-Security-Policy': csp
  });
  res.end(body);
}

/**
 * Генерирует XML sitemap на основе данных сайта и SEO настроек
 * @param {object} data - данные из базы
 * @param {object} seo - SEO настройки
 * @returns {string} XML sitemap
 */
function generateSitemap(data, seo) {
  const baseUrl = seo.site?.canonical || 'https://sushi-store.com';
  const sitemapConfig = seo.sitemap || {};
  const priority = sitemapConfig.priority || {};
  const changefreq = sitemapConfig.changefreq || {};
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Главная страница
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${baseUrl}/</loc>\n`;
  sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
  sitemap += `    <changefreq>${changefreq.home || 'daily'}</changefreq>\n`;
  sitemap += `    <priority>${priority.home || '1.0'}</priority>\n`;
  sitemap += `  </url>\n`;
  
  // Корзина
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${baseUrl}/cart</loc>\n`;
  sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
  sitemap += `    <changefreq>${changefreq.cart || 'monthly'}</changefreq>\n`;
  sitemap += `    <priority>${priority.cart || '0.6'}</priority>\n`;
  sitemap += `  </url>\n`;
  
  // Новости
  if (data.news && data.news.length > 0) {
    data.news.forEach(news => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/news/${news.id}</loc>\n`;
      sitemap += `    <lastmod>${news.date}T00:00:00+00:00</lastmod>\n`;
      sitemap += `    <changefreq>${changefreq.news || 'weekly'}</changefreq>\n`;
      sitemap += `    <priority>${priority.news || '0.8'}</priority>\n`;
      sitemap += `  </url>\n`;
    });
  }
  
  sitemap += '</urlset>';
  return sitemap;
}

/**
 * Генерирует robots.txt на основе SEO настроек
 * @param {object} seo - SEO настройки
 * @returns {string} robots.txt содержимое
 */
function generateRobots(seo) {
  const robotsConfig = seo.robots || {};
  const baseUrl = seo.site?.canonical || 'https://sushi-store.com';
  
  let robots = '';
  
  if (robotsConfig.enabled !== false) {
    robots += `User-agent: ${robotsConfig.userAgent || '*'}\n`;
    
    // Allow rules
    if (robotsConfig.allow && robotsConfig.allow.length > 0) {
      robotsConfig.allow.forEach(path => {
        robots += `Allow: ${path}\n`;
      });
    }
    
    // Disallow rules
    if (robotsConfig.disallow && robotsConfig.disallow.length > 0) {
      robotsConfig.disallow.forEach(path => {
        robots += `Disallow: ${path}\n`;
      });
    }
    
    // Sitemap
    if (robotsConfig.sitemap) {
      robots += `Sitemap: ${robotsConfig.sitemap}\n`;
    }
  } else {
    robots += 'User-agent: *\n';
    robots += 'Disallow: /\n';
  }
  
  return robots;
}

/**
 * Простая HTML‑санитация для предотвращения XSS при отображении
 * пользовательского ввода. Заменяет &, < и > на соответствующие
 * HTML‑сущности. Используется для полей новостей и отзывов.
 * @param {string} str
 */
function sanitize(str) {
  return String(str).replace(/[&<>]/g, ch => {
    switch (ch) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      default: return ch;
    }
  });
}

/**
 * Проверяет и очищает URL картинки. Разрешаем только абсолютные http/https
 * или относительные пути (начинающиеся с '/'). Если URL не соответствует
 * этим условиям, возвращаем пустую строку, чтобы избежать javascript: и др.
 * @param {string} urlStr
 */
function sanitizeImageUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return '';
  const trimmed = urlStr.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return '';
}

/**
 * Обработка запросов API и раздачи статики.
 */
function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Обработка CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
    return res.end();
  }

  // API: выход из системы
  if (pathname === '/api/logout' && method === 'POST') {
    const user = getUserFromAuth(req);
    if (user) {
      const token = req.headers['authorization']?.split(' ')[1];
      if (token && sessions[token]) {
        delete sessions[token];
        saveSessions();
      }
    }
    return sendJSON(res, 200, { message: 'Logged out successfully' });
  }

  // API: аутентификация. Вход пользователя по телефону и паролю.
  if (pathname === '/api/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { phone, password } = JSON.parse(body);
        if (!phone || !password) {
          return sendJSON(res, 400, { error: 'Phone and password required' });
        }
        const data = readData();
        const user = data.users ? data.users.find(u => u.phone === phone && u.password === password) : null;
        if (!user) {
          return sendJSON(res, 401, { error: 'Invalid credentials' });
        }
        // генерируем токен с использованием crypto
        const token = crypto.randomBytes(16).toString('hex');
        sessions[token] = { id: user.id, phone: user.phone, role: user.role };
        saveSessions(); // Сохраняем сессии в файл
        return sendJSON(res, 200, { token: token, role: user.role });
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // API: категории
  if (pathname === '/api/categories' && method === 'GET') {
    const data = readData();
    const categories = data.categories || [];
    return sendJSON(res, 200, categories);
  }
  if (pathname === '/api/categories' && method === 'POST') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { name } = JSON.parse(body);
        if (!name) return sendJSON(res, 400, { error: 'Name required' });
        const data = readData();
        if (!data.categories) data.categories = [];
        const newCat = { id: generateId('cat'), name: name };
        data.categories.push(newCat);
        writeData(data);
        return sendJSON(res, 201, newCat);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  if (pathname && pathname.startsWith('/api/categories/') && method === 'PUT') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { name } = JSON.parse(body);
        const data = readData();
        const idx = data.categories ? data.categories.findIndex(c => c.id === id) : -1;
        if (idx === -1) return sendJSON(res, 404, { error: 'Category not found' });
        data.categories[idx] = { ...data.categories[idx], name: name || data.categories[idx].name };
        writeData(data);
        return sendJSON(res, 200, data.categories[idx]);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  if (pathname && pathname.startsWith('/api/categories/') && method === 'DELETE') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    const data = readData();
    const idx = data.categories ? data.categories.findIndex(c => c.id === id) : -1;
    if (idx === -1) return sendJSON(res, 404, { error: 'Category not found' });
    const removed = data.categories.splice(idx, 1)[0];
    // также удаляем категорию из продуктов
    data.products = data.products.map(p => p.category === removed.name ? { ...p, category: '' } : p);
    writeData(data);
    return sendJSON(res, 200, removed);
  }

  // API: продукты
  if (pathname === '/api/products' && method === 'GET') {
    const { products } = readData();
    return sendJSON(res, 200, products);
  }
  if (pathname && pathname.startsWith('/api/products/') && method === 'GET') {
    const id = pathname.split('/')[3];
    const { products } = readData();
    const item = products.find(p => p.id === id);
    if (!item) return sendJSON(res, 404, { error: 'Product not found' });
    return sendJSON(res, 200, item);
  }
  if (pathname === '/api/products' && method === 'POST') {
    // Для создания продукта требуется администратор
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = readData();
        const newItem = JSON.parse(body);
        const product = {
          id: generateId('prod'),
          name: newItem.name || '',
          description: newItem.description || '',
          price: parseFloat(newItem.price) || 0,
          image: sanitizeImageUrl(newItem.image || ''),
          available: newItem.available !== undefined ? !!newItem.available : true,
          category: newItem.category || '',
          purchases: 0
        };
        data.products.push(product);
        writeData(data);
        return sendJSON(res, 201, product);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  if (pathname && pathname.startsWith('/api/products/') && method === 'PUT') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const data = readData();
        const index = data.products.findIndex(p => p.id === id);
        if (index === -1) return sendJSON(res, 404, { error: 'Product not found' });
        const existing = data.products[index];
        data.products[index] = {
          ...existing,
          ...updates,
          id: existing.id,
          price: updates.price !== undefined ? parseFloat(updates.price) : existing.price,
          available: updates.available !== undefined ? !!updates.available : existing.available,
          image: updates.image !== undefined ? sanitizeImageUrl(updates.image) : existing.image
        };
        writeData(data);
        return sendJSON(res, 200, data.products[index]);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  if (pathname && pathname.startsWith('/api/products/') && method === 'DELETE') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    const data = readData();
    const index = data.products.findIndex(p => p.id === id);
    if (index === -1) return sendJSON(res, 404, { error: 'Product not found' });
    const removed = data.products.splice(index, 1)[0];
    writeData(data);
    return sendJSON(res, 200, removed);
  }

  // API: категории
  if (pathname === '/api/categories' && method === 'GET') {
    const data = readData();
    const categories = data.categories || [];
    return sendJSON(res, 200, categories);
  }
  if (pathname === '/api/categories' && method === 'POST') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = readData();
        if (!data.categories) data.categories = [];
        const input = JSON.parse(body);
        const category = {
          id: generateId('cat'),
          name: sanitize(input.name || ''),
          image: input.image || ''
        };
        data.categories.push(category);
        writeData(data);
        return sendJSON(res, 201, category);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  if (pathname && pathname.startsWith('/api/categories/') && method === 'PUT') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = readData();
        const index = data.categories.findIndex(c => c.id === id);
        if (index === -1) return sendJSON(res, 404, { error: 'Category not found' });
        const updates = JSON.parse(body);
        data.categories[index] = {
          ...data.categories[index],
          ...updates,
          id: data.categories[index].id,
          name: updates.name !== undefined ? sanitize(updates.name) : data.categories[index].name
        };
        writeData(data);
        return sendJSON(res, 200, data.categories[index]);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  if (pathname && pathname.startsWith('/api/categories/') && method === 'DELETE') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    const data = readData();
    const index = data.categories.findIndex(c => c.id === id);
    if (index === -1) return sendJSON(res, 404, { error: 'Category not found' });
    const removed = data.categories.splice(index, 1)[0];
    writeData(data);
    return sendJSON(res, 200, removed);
  }

  // API: новости
  if (pathname === '/api/news' && method === 'GET') {
    const { news } = readData();
    // сортируем по дате убыванию
    const sorted = news.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    return sendJSON(res, 200, sorted);
  }
  if (pathname && pathname.startsWith('/api/news/') && method === 'GET') {
    const id = pathname.split('/')[3];
    const { news } = readData();
    const item = news.find(n => n.id === id);
    if (!item) return sendJSON(res, 404, { error: 'News not found' });
    return sendJSON(res, 200, item);
  }
  if (pathname === '/api/news' && method === 'POST') {
    // создаём новость только администратор
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = readData();
        const newItem = JSON.parse(body);
        const item = {
          id: generateId('news'),
          title: sanitize(newItem.title || ''),
          date: newItem.date || new Date().toISOString().split('T')[0],
          content: sanitize(newItem.content || ''),
          image: sanitizeImageUrl(newItem.image || '')
        };
        data.news.push(item);
        writeData(data);
        return sendJSON(res, 201, item);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  if (pathname && pathname.startsWith('/api/news/') && method === 'PUT') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const data = readData();
        const index = data.news.findIndex(n => n.id === id);
        if (index === -1) return sendJSON(res, 404, { error: 'News not found' });
        const existing = data.news[index];
        data.news[index] = {
          ...existing,
          ...updates,
          id: existing.id,
          date: updates.date || existing.date,
          title: updates.title !== undefined ? sanitize(updates.title) : existing.title,
          content: updates.content !== undefined ? sanitize(updates.content) : existing.content,
          image: updates.image !== undefined ? sanitizeImageUrl(updates.image) : existing.image
        };
        writeData(data);
        return sendJSON(res, 200, data.news[index]);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }
  if (pathname && pathname.startsWith('/api/news/') && method === 'DELETE') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    const data = readData();
    const index = data.news.findIndex(n => n.id === id);
    if (index === -1) return sendJSON(res, 404, { error: 'News not found' });
    const removed = data.news.splice(index, 1)[0];
    writeData(data);
    return sendJSON(res, 200, removed);
  }

  // API: отзывы
  if (pathname === '/api/reviews' && method === 'GET') {
    const data = readData();
    const reviews = data.reviews || [];
    // сортируем по дате (сначала новые)
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    return sendJSON(res, 200, reviews);
  }
  if (pathname === '/api/reviews' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = readData();
        if (!data.reviews) data.reviews = [];
        const input = JSON.parse(body);
        const review = {
          id: generateId('rev'),
          rating: typeof input.rating === 'number' ? input.rating : 0,
          comment: sanitize(input.comment || ''),
          name: sanitize(input.name || ''),
          phone: input.phone || '',
          orderId: input.orderId || '',
          date: new Date().toISOString()
        };
        data.reviews.push(review);
        writeData(data);
        return sendJSON(res, 201, review);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // API: пользователи (регистрация)
  if (pathname === '/api/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { phone } = JSON.parse(body);
        if (!phone) return sendJSON(res, 400, { error: 'Phone required' });
        const data = readData();
        if (!data.users) data.users = [];
        // проверяем, существует ли пользователь с таким телефоном
        let existing = data.users.find(u => u.phone === phone);
        if (existing) {
          // если пользователь уже существует, не генерируем новый пароль
          return sendJSON(res, 200, { phone: existing.phone, password: existing.password });
        }
        // генерируем простой пароль (6 символов)
        const pwd = Math.random().toString(36).slice(-6);
        const user = {
          id: generateId('usr'),
          phone: phone,
          password: pwd,
          // новый пользователь по умолчанию получает роль 'user'
          role: 'user'
        };
        data.users.push(user);
        writeData(data);
        return sendJSON(res, 201, { phone: user.phone, password: user.password });
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // API: заказы
  // Получение списка заказов (можно использовать для админки). Если нет в базе, возвращаем пустой массив.
  if (pathname === '/api/orders' && method === 'GET') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const data = readData();
    const orders = data.orders || [];
    return sendJSON(res, 200, orders);
  }

  // Получение конкретного заказа по id
  if (pathname && pathname.startsWith('/api/orders/') && method === 'GET') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    const data = readData();
    const order = data.orders ? data.orders.find(o => o.id === id) : null;
    if (!order) return sendJSON(res, 404, { error: 'Order not found' });
    return sendJSON(res, 200, order);
  }
  // Создание нового заказа
  if (pathname === '/api/orders' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const newOrder = JSON.parse(body);
        const data = readData();
        if (!data.orders) data.orders = [];
        const order = {
          id: generateId('order'),
          items: Array.isArray(newOrder.items) ? newOrder.items : [],
          persons: typeof newOrder.persons === 'number' ? newOrder.persons : 1,
          extras: Array.isArray(newOrder.extras) ? newOrder.extras : [],
          extrasSelection: Array.isArray(newOrder.extrasSelection) ? newOrder.extrasSelection : [],
          total: typeof newOrder.total === 'number' ? newOrder.total : 0,
          deliveryTime: newOrder.deliveryTime || 'asap',
          scheduledTime: newOrder.scheduledTime || null,
          customer: {
            name: newOrder.customer && newOrder.customer.name ? String(newOrder.customer.name) : '',
            // адрес может быть объектом с полями city, street, apartment и phone
            address: newOrder.customer && newOrder.customer.address ? newOrder.customer.address : {}
          },
          date: new Date().toISOString()
        };
        // увеличиваем счётчик покупок для каждого товара
        if (Array.isArray(order.items)) {
          order.items.forEach(item => {
            const prodIndex = data.products.findIndex(p => p.id === item.id);
            if (prodIndex >= 0) {
              const current = data.products[prodIndex].purchases || 0;
              data.products[prodIndex].purchases = current + (item.quantity || 1);
            }
          });
        }
        data.orders.push(order);
        writeData(data);
        return sendJSON(res, 201, order);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // Обновление существующего заказа
  if (pathname && pathname.startsWith('/api/orders/') && method === 'PUT') {
    // обновлять заказы может только администратор
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const updates = JSON.parse(body);
        const data = readData();
        if (!data.orders) data.orders = [];
        const index = data.orders.findIndex(o => o.id === id);
        if (index === -1) return sendJSON(res, 404, { error: 'Order not found' });
        const existing = data.orders[index];
        function adjustPurchases(order, direction) {
          if (!order || !Array.isArray(order.items)) return;
          order.items.forEach(it => {
            const pIdx = data.products.findIndex(p => p.id === it.id);
            if (pIdx >= 0) {
              const qty = it.quantity || 1;
              data.products[pIdx].purchases = (data.products[pIdx].purchases || 0) + direction * qty;
            }
          });
        }
        // убираем старые
        adjustPurchases(existing, -1);
        const newOrder = {
          ...existing,
          ...updates,
          id: existing.id,
          date: existing.date
        };
        data.orders[index] = newOrder;
        adjustPurchases(newOrder, 1);
        writeData(data);
        return sendJSON(res, 200, newOrder);
      } catch (e) {
        return sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  // Удаление заказа
  if (pathname && pathname.startsWith('/api/orders/') && method === 'DELETE') {
    const user = getUserFromAuth(req);
    if (!user || user.role !== 'admin') {
      return sendJSON(res, 403, { error: 'Forbidden' });
    }
    const id = pathname.split('/')[3];
    const data = readData();
    const index = data.orders ? data.orders.findIndex(o => o.id === id) : -1;
    if (index === -1) return sendJSON(res, 404, { error: 'Order not found' });
    const removed = data.orders.splice(index, 1)[0];
    writeData(data);
    return sendJSON(res, 200, removed);
  }

  // SEO API endpoints
  if (pathname === '/api/seo') {
    if (method === 'GET') {
      const data = readData();
      return sendJSON(res, 200, data.seo || {});
    }
    if (method === 'PUT') {
      const user = getUserFromAuth(req);
      if (!user || user.role !== 'admin') {
        return sendJSON(res, 403, { error: 'Admin access required' });
      }
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const seoData = JSON.parse(body);
          const data = readData();
          data.seo = seoData;
          writeData(data);
          return sendJSON(res, 200, { message: 'SEO data updated successfully' });
        } catch (e) {
          return sendJSON(res, 400, { error: 'Invalid JSON' });
        }
      });
      return;
    }
  }

  // Category Blocks API endpoints
  if (pathname === '/api/category-blocks') {
    if (method === 'GET') {
      const data = readData();
      const blocks = (data.categoryBlocks || []).filter(block => block.enabled).sort((a, b) => a.order - b.order);
      return sendJSON(res, 200, blocks);
    }
    if (method === 'POST') {
      const user = getUserFromAuth(req);
      if (!user || user.role !== 'admin') {
        return sendJSON(res, 403, { error: 'Admin access required' });
      }
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const blockData = JSON.parse(body);
          const data = readData();
          if (!data.categoryBlocks) data.categoryBlocks = [];
          
          const newBlock = {
            id: generateId('cat-block'),
            name: blockData.name,
            description: blockData.description,
            image: sanitizeImageUrl(blockData.image),
            order: parseInt(blockData.order) || data.categoryBlocks.length + 1,
            enabled: blockData.enabled !== false
          };
          
          data.categoryBlocks.push(newBlock);
          writeData(data);
          return sendJSON(res, 201, newBlock);
        } catch (e) {
          return sendJSON(res, 400, { error: 'Invalid JSON' });
        }
      });
      return;
    }
  }

  if (pathname.startsWith('/api/category-blocks/') && pathname.split('/').length === 4) {
    const id = pathname.split('/')[3];
    const data = readData();
    const blockIndex = data.categoryBlocks ? data.categoryBlocks.findIndex(b => b.id === id) : -1;
    
    if (blockIndex === -1) {
      return sendJSON(res, 404, { error: 'Category block not found' });
    }
    
    if (method === 'PUT') {
      const user = getUserFromAuth(req);
      if (!user || user.role !== 'admin') {
        return sendJSON(res, 403, { error: 'Admin access required' });
      }
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const blockData = JSON.parse(body);
          const updatedBlock = {
            ...data.categoryBlocks[blockIndex],
            name: blockData.name,
            description: blockData.description,
            image: sanitizeImageUrl(blockData.image),
            order: parseInt(blockData.order) || data.categoryBlocks[blockIndex].order,
            enabled: blockData.enabled !== undefined ? blockData.enabled : data.categoryBlocks[blockIndex].enabled
          };
          data.categoryBlocks[blockIndex] = updatedBlock;
          writeData(data);
          return sendJSON(res, 200, updatedBlock);
        } catch (e) {
          return sendJSON(res, 400, { error: 'Invalid JSON' });
        }
      });
      return;
    }
    
    if (method === 'DELETE') {
      const user = getUserFromAuth(req);
      if (!user || user.role !== 'admin') {
        return sendJSON(res, 403, { error: 'Admin access required' });
      }
      const removed = data.categoryBlocks.splice(blockIndex, 1)[0];
      writeData(data);
      return sendJSON(res, 200, removed);
    }
  }

  // Sitemap generation
  if (pathname === '/sitemap.xml') {
    const data = readData();
    const seo = data.seo || {};
    const sitemap = generateSitemap(data, seo);
    res.writeHead(200, {
      'Content-Type': 'application/xml',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'same-origin'
    });
    res.end(sitemap);
    return;
  }

  // Robots.txt generation
  if (pathname === '/robots.txt') {
    const data = readData();
    const seo = data.seo || {};
    const robots = generateRobots(seo);
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'same-origin'
    });
    res.end(robots);
    return;
  }

  // Если путь начинается с /api, но не совпал с вышеперечисленным — 404
  if (pathname.startsWith('/api')) {
    return sendJSON(res, 404, { error: 'Not found' });
  }

  // Статические файлы из папки assets
  if (pathname.startsWith('/assets/')) {
    const assetsPath = path.join(__dirname, '..', 'assets', pathname.substring(8));
    if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isFile()) {
      const ext = path.extname(assetsPath).substring(1);
      const mimeTypes = {
        html: 'text/html',
        js: 'application/javascript',
        css: 'text/css',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        svg: 'image/svg+xml',
        json: 'application/json'
      };
      const mime = mimeTypes[ext] || 'application/octet-stream';
      fs.readFile(assetsPath, (err, content) => {
        if (err) {
          res.writeHead(500);
          return res.end('Server error');
        }
        const csp = [
          "default-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com https://images.unsplash.com",
          "script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com",
          "script-src-elem 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdn.tailwindcss.com",
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
          "style-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
          "style-src-attr 'self' 'unsafe-inline'",
          "img-src 'self' data: https://images.unsplash.com https://cdn.jsdelivr.net",
          "font-src 'self' https://cdnjs.cloudflare.com",
          "connect-src 'self'"
        ].join('; ');
        res.writeHead(200, {
          'Content-Type': mime,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'same-origin',
          'Content-Security-Policy': csp
        });
        res.end(content);
      });
      return;
    }
  }

  // Статические файлы: пытаемся отдать файл из client/dist
  if (fs.existsSync(CLIENT_DIST)) {
    const filePath = path.join(CLIENT_DIST, pathname === '/' ? 'index.html' : pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).substring(1);
      const mimeTypes = {
        html: 'text/html',
        js: 'application/javascript',
        css: 'text/css',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        svg: 'image/svg+xml',
        json: 'application/json'
      };
      const mime = mimeTypes[ext] || 'application/octet-stream';
      fs.readFile(filePath, (err, content) => {
        if (err) {
          res.writeHead(500);
          return res.end('Server error');
        }
        // Устанавливаем заголовки безопасности для статики. Используем ту же
        // Content-Security-Policy, что и для JSON, разрешая загрузку скриптов,
        // стилей и изображений с доверенных CDN.
        const csp = [
          "default-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com https://images.unsplash.com",
          "script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com",
          "script-src-elem 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com",
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
          "style-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
          "style-src-attr 'self' 'unsafe-inline'",
          "img-src 'self' data: https://images.unsplash.com https://cdn.jsdelivr.net",
          "font-src 'self' https://cdnjs.cloudflare.com",
          "connect-src 'self'"
        ].join('; ');
        res.writeHead(200, {
          'Content-Type': mime,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'same-origin',
          'Content-Security-Policy': csp
        });
        res.end(content);
      });
      return;
    }
    // Если файл не найден, всегда отправляем index.html для поддержки SPA
    const indexFile = path.join(CLIENT_DIST, 'index.html');
    if (fs.existsSync(indexFile)) {
      fs.readFile(indexFile, (err, content) => {
        if (err) {
          res.writeHead(500);
          return res.end('Server error');
        }
        // Заголовки безопасности для HTML с корректной CSP
        const csp = [
          "default-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com https://images.unsplash.com",
          "script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com",
          "script-src-elem 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://unpkg.com https://cdn.tailwindcss.com",
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
          "style-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
          "style-src-attr 'self' 'unsafe-inline'",
          "img-src 'self' data: https://images.unsplash.com https://cdn.jsdelivr.net",
          "font-src 'self' https://cdnjs.cloudflare.com",
          "connect-src 'self'"
        ].join('; ');
        res.writeHead(200, {
          'Content-Type': 'text/html',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'same-origin',
          'Content-Security-Policy': csp
        });
        res.end(content);
      });
      return;
    }
  }
  // Если фронтенд ещё не собран, просто выдаём приветственное сообщение
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Sushi store API server is running. Build the client to enable the web interface.');
}

const PORT = process.env.PORT || 3000;
const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});