const http = require('http');

async function testAPI() {
  console.log('🧪 Тестируем API...\n');
  
  // 1. Тестируем логин
  console.log('1. Тестируем логин...');
  const loginData = JSON.stringify({
    phone: '+7 (999) 123-45-67',
    password: 'admin123'
  });
  
  const loginResponse = await makeRequest('/api/login', 'POST', loginData);
  if (loginResponse.statusCode === 200) {
    const loginResult = JSON.parse(loginResponse.body);
    console.log('✅ Логин успешен');
    console.log('Token:', loginResult.token.substring(0, 50) + '...');
    
    // 2. Тестируем получение заказов
    console.log('\n2. Тестируем получение заказов...');
    const ordersResponse = await makeRequest('/api/orders', 'GET', null, loginResult.token);
    if (ordersResponse.statusCode === 200) {
      const orders = JSON.parse(ordersResponse.body);
      console.log('✅ Заказы получены:', orders.length, 'шт.');
    } else {
      console.log('❌ Ошибка получения заказов:', ordersResponse.statusCode, ordersResponse.body);
    }
    
    // 3. Тестируем получение товаров
    console.log('\n3. Тестируем получение товаров...');
    const productsResponse = await makeRequest('/api/products', 'GET');
    if (productsResponse.statusCode === 200) {
      const products = JSON.parse(productsResponse.body);
      console.log('✅ Товары получены:', products.length, 'шт.');
    } else {
      console.log('❌ Ошибка получения товаров:', productsResponse.statusCode, productsResponse.body);
    }
    
    // 4. Тестируем получение категорий
    console.log('\n4. Тестируем получение категорий...');
    const categoriesResponse = await makeRequest('/api/categories', 'GET');
    if (categoriesResponse.statusCode === 200) {
      const categories = JSON.parse(categoriesResponse.body);
      console.log('✅ Категории получены:', categories.length, 'шт.');
    } else {
      console.log('❌ Ошибка получения категорий:', categoriesResponse.statusCode, categoriesResponse.body);
    }
    
  } else {
    console.log('❌ Ошибка логина:', loginResponse.statusCode, loginResponse.body);
  }
}

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: body
        });
      });
    });
    
    req.on('error', (err) => {
      resolve({
        statusCode: 0,
        body: err.message
      });
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

testAPI().then(() => {
  console.log('\n🏁 Тестирование завершено');
  process.exit(0);
}).catch(err => {
  console.error('❌ Ошибка тестирования:', err);
  process.exit(1);
});


