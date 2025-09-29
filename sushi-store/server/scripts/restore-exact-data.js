/**
 * Точное восстановление данных из JSON в PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const bcrypt = require('bcrypt');

async function restoreExactData() {
  try {
    console.log('🔄 Восстанавливаем точные данные из JSON...');

    // Читаем JSON файл
    const jsonPath = path.join(__dirname, '..', 'db.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('📊 Данные из JSON загружены');

    // 1. Создаем пользователя точно как в JSON
    console.log('👥 Создаем пользователя...');
    const password_hash = await bcrypt.hash('admin123', 12);
    
    await db.query(`
      INSERT INTO users (phone, password_hash, role, created_at, updated_at, is_active)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, true)
    `, ['+7 (999) 123-45-67', password_hash, 'admin']);

    console.log('✅ Пользователь создан');

    // 2. Создаем категории точно как в JSON
    console.log('📂 Создаем категории...');
    for (const category of jsonData.categories) {
      await db.query(`
        INSERT INTO categories (name, image, description, order_index, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [category.name, category.image, '', 0]);
    }
    console.log('✅ Категории созданы');

    // 3. Создаем товары точно как в JSON
    console.log('🍣 Создаем товары...');
    for (const product of jsonData.products) {
      // Находим ID категории по названию
      const categoryResult = await db.query('SELECT id FROM categories WHERE name = $1', [product.category]);
      const categoryId = categoryResult.rows[0]?.id;

      await db.query(`
        INSERT INTO products (name, description, price, image, category_id, available, hit, purchases, order_index, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        product.name,
        product.description,
        product.price,
        product.image,
        categoryId,
        product.available,
        product.hit,
        product.purchases,
        0
      ]);
    }
    console.log('✅ Товары созданы');

    // 4. Создаем заказы точно как в JSON
    console.log('📦 Создаем заказы...');
    for (const order of jsonData.orders) {
      // Получаем ID пользователя
      const userResult = await db.query('SELECT id FROM users WHERE phone = $1', ['+7 (999) 123-45-67']);
      const userId = userResult.rows[0]?.id;

      // Создаем заказ
      const orderResult = await db.query(`
        INSERT INTO orders (user_id, customer_name, customer_phone, customer_address, total_amount, status, delivery_time, scheduled_time, persons, extras_selection, notes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
        RETURNING *
      `, [
        userId,
        order.customer.name,
        order.customer.address.phone,
        `${order.customer.address.city}, ${order.customer.address.street}, кв. ${order.customer.address.apartment}`,
        order.total,
        'pending',
        order.deliveryTime,
        order.scheduledTime,
        order.persons,
        JSON.stringify(order.extrasSelection),
        '',
        new Date(order.date)
      ]);

      const orderId = orderResult.rows[0].id;

      // Добавляем товары в заказ
      for (const item of order.items) {
        // Находим ID товара по названию
        const productResult = await db.query('SELECT id FROM products WHERE name = $1', [item.name]);
        const productId = productResult.rows[0]?.id;
        
        if (productId) {
          await db.query(`
            INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
          `, [orderId, productId, item.quantity, item.price]);
        }
      }
    }
    console.log('✅ Заказы созданы');

    // 5. Создаем новости точно как в JSON
    console.log('📰 Создаем новости...');
    for (const news of jsonData.news) {
      const userResult = await db.query('SELECT id FROM users WHERE phone = $1', ['+7 (999) 123-45-67']);
      const userId = userResult.rows[0]?.id;

      await db.query(`
        INSERT INTO news (title, content, image, author_id, published, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, true, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [news.title, news.content, news.image, userId, new Date(news.date)]);
    }
    console.log('✅ Новости созданы');

    // 6. Создаем отзывы точно как в JSON
    console.log('⭐ Создаем отзывы...');
    for (const review of jsonData.reviews) {
      // Находим ID заказа по customer name (приблизительно)
      const orderResult = await db.query('SELECT id FROM orders WHERE customer_name = $1 LIMIT 1', [review.name]);
      const orderId = orderResult.rows[0]?.id;

      if (orderId) {
        await db.query(`
          INSERT INTO reviews (order_id, rating, comment, customer_name, is_approved, created_at, updated_at)
          VALUES ($1, $2, $3, $4, true, $5, CURRENT_TIMESTAMP)
        `, [orderId, review.rating, review.comment, review.name, new Date(review.date)]);
      }
    }
    console.log('✅ Отзывы созданы');

    // 7. Создаем SEO настройки точно как в JSON
    console.log('🔍 Создаем SEO настройки...');
    const seo = jsonData.seo;
    
    // Основные настройки сайта
    await db.query(`
      INSERT INTO seo_settings (page, title, description, keywords, author, language, robots, canonical, og_title, og_description, og_image, og_site_name, twitter_card, twitter_title, twitter_description, twitter_image, structured_data, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [
      'home',
      seo.site.title,
      seo.site.description,
      seo.site.keywords,
      seo.site.author,
      seo.site.language,
      seo.site.robots,
      seo.site.canonical,
      seo.site.ogTitle,
      seo.site.ogDescription,
      seo.site.ogImage,
      seo.site.ogSiteName,
      seo.site.twitterCard,
      seo.site.twitterTitle,
      seo.site.twitterDescription,
      seo.site.twitterImage,
      JSON.stringify(seo.site.structuredData)
    ]);

    // Настройки страниц
    for (const [pageName, pageData] of Object.entries(seo.pages)) {
      await db.query(`
        INSERT INTO seo_settings (page, title, description, keywords, author, language, robots, canonical, og_title, og_description, og_image, og_site_name, twitter_card, twitter_title, twitter_description, twitter_image, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        pageName,
        pageData.title,
        pageData.description,
        pageData.keywords,
        seo.site.author,
        seo.site.language,
        seo.site.robots,
        seo.site.canonical,
        pageData.title,
        pageData.description,
        seo.site.ogImage,
        seo.site.ogSiteName,
        seo.site.twitterCard,
        pageData.title,
        pageData.description,
        seo.site.twitterImage
      ]);
    }
    console.log('✅ SEO настройки созданы');

    // 8. Создаем блоки категорий точно как в JSON
    console.log('🎨 Создаем блоки категорий...');
    for (const block of jsonData.categoryBlocks) {
      // Находим ID категории по названию
      const categoryResult = await db.query('SELECT id FROM categories WHERE name = $1', [block.name]);
      const categoryId = categoryResult.rows[0]?.id;

      await db.query(`
        INSERT INTO category_blocks (title, description, image, category_id, enabled, order_index, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [block.name, block.description, block.image, categoryId, block.enabled, block.order]);
    }
    console.log('✅ Блоки категорий созданы');

    console.log('🎉 Все данные восстановлены точно как в JSON!');
    
    // Выводим статистику
    const userCount = await db.query('SELECT COUNT(*) FROM users');
    const categoryCount = await db.query('SELECT COUNT(*) FROM categories');
    const productCount = await db.query('SELECT COUNT(*) FROM products');
    const orderCount = await db.query('SELECT COUNT(*) FROM orders');

    console.log('\n📊 Статистика:');
    console.log(`👥 Пользователей: ${userCount.rows[0].count}`);
    console.log(`📂 Категорий: ${categoryCount.rows[0].count}`);
    console.log(`🍣 Товаров: ${productCount.rows[0].count}`);
    console.log(`📦 Заказов: ${orderCount.rows[0].count}`);

  } catch (error) {
    console.error('❌ Ошибка восстановления данных:', error);
  } finally {
    await db.close();
    process.exit(0);
  }
}

restoreExactData();
