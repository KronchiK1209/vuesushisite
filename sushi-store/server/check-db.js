const db = require('./config/database');

async function checkDatabase() {
  try {
    console.log('🔍 Проверяем базу данных...\n');
    
    // Проверяем пользователей
    const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Пользователи: ${usersResult.rows[0].count}`);
    
    // Проверяем заказы
    const ordersResult = await db.query('SELECT COUNT(*) as count FROM orders');
    console.log(`📦 Заказы: ${ordersResult.rows[0].count}`);
    
    // Проверяем товары
    const productsResult = await db.query('SELECT COUNT(*) as count FROM products');
    console.log(`🍣 Товары: ${productsResult.rows[0].count}`);
    
    // Проверяем категории
    const categoriesResult = await db.query('SELECT COUNT(*) as count FROM categories');
    console.log(`📂 Категории: ${categoriesResult.rows[0].count}`);
    
    // Проверяем отзывы
    const reviewsResult = await db.query('SELECT COUNT(*) as count FROM reviews');
    console.log(`⭐ Отзывы: ${reviewsResult.rows[0].count}`);
    
    // Проверяем сессии
    const sessionsResult = await db.query('SELECT COUNT(*) as count FROM user_sessions');
    console.log(`🔐 Сессии: ${sessionsResult.rows[0].count}`);
    
    console.log('\n✅ База данных работает корректно!');
    
  } catch (error) {
    console.error('❌ Ошибка базы данных:', error.message);
  } finally {
    process.exit(0);
  }
}

checkDatabase();


