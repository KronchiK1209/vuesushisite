/**
 * Скрипт миграции данных из JSON в PostgreSQL
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

async function migrateData() {
  try {
    console.log('🚀 Начинаем миграцию данных...');

    // Читаем JSON файл
    const jsonPath = path.join(__dirname, '..', 'db.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('📊 Данные из JSON загружены');

    // Мигрируем пользователей
    if (jsonData.users && jsonData.users.length > 0) {
      console.log('👥 Мигрируем пользователей...');
      
      for (const userData of jsonData.users) {
        try {
          // Проверяем, существует ли уже пользователь
          const existingUser = await User.findByPhone(userData.phone);
          
          if (!existingUser) {
            await User.create({
              phone: userData.phone,
              password: userData.password, // Пароль будет захеширован автоматически
              role: userData.role
            });
            console.log(`✅ Пользователь ${userData.phone} создан`);
          } else {
            console.log(`⚠️ Пользователь ${userData.phone} уже существует`);
          }
        } catch (error) {
          console.error(`❌ Ошибка создания пользователя ${userData.phone}:`, error.message);
        }
      }
    }

    // Мигрируем категории
    if (jsonData.categories && jsonData.categories.length > 0) {
      console.log('📂 Мигрируем категории...');
      
      for (const categoryData of jsonData.categories) {
        try {
          // Проверяем, существует ли уже категория
          const existingCategory = await Category.findByName(categoryData.name);
          
          if (!existingCategory) {
            await Category.create({
              name: categoryData.name,
              image: categoryData.image,
              description: categoryData.description || '',
              order_index: categoryData.order_index || 0
            });
            console.log(`✅ Категория ${categoryData.name} создана`);
          } else {
            console.log(`⚠️ Категория ${categoryData.name} уже существует`);
          }
        } catch (error) {
          console.error(`❌ Ошибка создания категории ${categoryData.name}:`, error.message);
        }
      }
    }

    // Мигрируем товары
    if (jsonData.products && jsonData.products.length > 0) {
      console.log('🍣 Мигрируем товары...');
      
      for (const productData of jsonData.products) {
        try {
          // Находим категорию по названию
          let categoryId = null;
          if (productData.category) {
            const category = await Category.findByName(productData.category);
            if (category) {
              categoryId = category.id;
            }
          }

          await Product.create({
            name: productData.name,
            description: productData.description || '',
            price: productData.price,
            image: productData.image,
            category_id: categoryId,
            available: productData.available !== false,
            hit: productData.hit || false,
            purchases: productData.purchases || 0,
            order_index: productData.order_index || 0
          });
          
          console.log(`✅ Товар ${productData.name} создан`);
        } catch (error) {
          console.error(`❌ Ошибка создания товара ${productData.name}:`, error.message);
        }
      }
    }

    // Мигрируем заказы
    if (jsonData.orders && jsonData.orders.length > 0) {
      console.log('📦 Мигрируем заказы...');
      
      for (const orderData of jsonData.orders) {
        try {
          // Находим пользователя по телефону
          let userId = null;
          if (orderData.customer_phone) {
            const user = await User.findByPhone(orderData.customer_phone);
            if (user) {
              userId = user.id;
            }
          }

          const order = await Order.create({
            user_id: userId,
            customer_name: orderData.customer_name || 'Не указано',
            customer_phone: orderData.customer_phone || '',
            customer_address: orderData.customer_address || '',
            total_amount: orderData.total_amount || 0,
            status: orderData.status || 'pending',
            delivery_time: orderData.delivery_time || 'asap',
            scheduled_time: orderData.scheduled_time,
            persons: orderData.persons || 1,
            extras_selection: orderData.extras_selection || [],
            notes: orderData.notes
          });

          // Мигрируем товары заказа
          if (orderData.items && Array.isArray(orderData.items)) {
            for (const item of orderData.items) {
              try {
                // Находим товар по названию
                const products = await Product.findAll({ search: item.name });
                if (products.length > 0) {
                  await order.addItem(products[0].id, item.quantity, item.price);
                }
              } catch (itemError) {
                console.error(`❌ Ошибка добавления товара в заказ:`, itemError.message);
              }
            }
          }

          console.log(`✅ Заказ ${order.id} создан`);
        } catch (error) {
          console.error(`❌ Ошибка создания заказа:`, error.message);
        }
      }
    }

    // Мигрируем новости
    if (jsonData.news && jsonData.news.length > 0) {
      console.log('📰 Мигрируем новости...');
      
      for (const newsData of jsonData.news) {
        try {
          // Находим админа для автора
          const admin = await User.findByPhone('+7 (999) 123-45-67');
          const authorId = admin ? admin.id : null;

          const query = `
            INSERT INTO news (title, content, image, author_id, published, published_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          `;

          await db.query(query, [
            newsData.title,
            newsData.content || '',
            newsData.image,
            authorId,
            newsData.published !== false,
            newsData.published_at || new Date()
          ]);

          console.log(`✅ Новость ${newsData.title} создана`);
        } catch (error) {
          console.error(`❌ Ошибка создания новости ${newsData.title}:`, error.message);
        }
      }
    }

    // Мигрируем SEO настройки
    if (jsonData.seo) {
      console.log('🔍 Мигрируем SEO настройки...');
      
      try {
        const seoData = jsonData.seo;
        
        // Мигрируем основные настройки сайта
        if (seoData.site) {
          const query = `
            INSERT INTO seo_settings (page, title, description, keywords, author, language, robots, canonical, og_title, og_description, og_image, og_site_name, twitter_card, twitter_title, twitter_description, twitter_image)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            ON CONFLICT (page) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              keywords = EXCLUDED.keywords,
              author = EXCLUDED.author,
              language = EXCLUDED.language,
              robots = EXCLUDED.robots,
              canonical = EXCLUDED.canonical,
              og_title = EXCLUDED.og_title,
              og_description = EXCLUDED.og_description,
              og_image = EXCLUDED.og_image,
              og_site_name = EXCLUDED.og_site_name,
              twitter_card = EXCLUDED.twitter_card,
              twitter_title = EXCLUDED.twitter_title,
              twitter_description = EXCLUDED.twitter_description,
              twitter_image = EXCLUDED.twitter_image,
              updated_at = CURRENT_TIMESTAMP
          `;

          await db.query(query, [
            'home',
            seoData.site.title,
            seoData.site.description,
            seoData.site.keywords,
            seoData.site.author,
            seoData.site.language,
            seoData.site.robots,
            seoData.site.canonical,
            seoData.site.ogTitle,
            seoData.site.ogDescription,
            seoData.site.ogImage,
            seoData.site.ogSiteName,
            seoData.site.twitterCard,
            seoData.site.twitterTitle,
            seoData.site.twitterDescription,
            seoData.site.twitterImage
          ]);
        }

        // Мигрируем настройки страниц
        if (seoData.pages) {
          for (const [pageName, pageData] of Object.entries(seoData.pages)) {
            const query = `
              INSERT INTO seo_settings (page, title, description, keywords, author, language, robots, canonical, og_title, og_description, og_image, og_site_name, twitter_card, twitter_title, twitter_description, twitter_image)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
              ON CONFLICT (page) DO UPDATE SET
                title = EXCLUDED.title,
                description = EXCLUDED.description,
                keywords = EXCLUDED.keywords,
                author = EXCLUDED.author,
                language = EXCLUDED.language,
                robots = EXCLUDED.robots,
                canonical = EXCLUDED.canonical,
                og_title = EXCLUDED.og_title,
                og_description = EXCLUDED.og_description,
                og_image = EXCLUDED.og_image,
                og_site_name = EXCLUDED.og_site_name,
                twitter_card = EXCLUDED.twitter_card,
                twitter_title = EXCLUDED.twitter_title,
                twitter_description = EXCLUDED.twitter_description,
                twitter_image = EXCLUDED.twitter_image,
                updated_at = CURRENT_TIMESTAMP
            `;

            await db.query(query, [
              pageName,
              pageData.title,
              pageData.description,
              pageData.keywords,
              pageData.author,
              pageData.language,
              pageData.robots,
              pageData.canonical,
              pageData.ogTitle,
              pageData.ogDescription,
              pageData.ogImage,
              pageData.ogSiteName,
              pageData.twitterCard,
              pageData.twitterTitle,
              pageData.twitterDescription,
              pageData.twitterImage
            ]);
          }
        }

        console.log('✅ SEO настройки мигрированы');
      } catch (error) {
        console.error('❌ Ошибка миграции SEO настроек:', error.message);
      }
    }

    // Мигрируем блоки категорий
    if (jsonData.categoryBlocks && jsonData.categoryBlocks.length > 0) {
      console.log('🎨 Мигрируем блоки категорий...');
      
      for (const blockData of jsonData.categoryBlocks) {
        try {
          // Находим категорию по названию
          let categoryId = null;
          if (blockData.category) {
            const category = await Category.findByName(blockData.category);
            if (category) {
              categoryId = category.id;
            }
          }

          const query = `
            INSERT INTO category_blocks (title, description, image, category_id, enabled, order_index)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          `;

          await db.query(query, [
            blockData.title,
            blockData.description || '',
            blockData.image,
            categoryId,
            blockData.enabled !== false,
            blockData.order_index || 0
          ]);

          console.log(`✅ Блок категории ${blockData.title} создан`);
        } catch (error) {
          console.error(`❌ Ошибка создания блока категории ${blockData.title}:`, error.message);
        }
      }
    }

    console.log('🎉 Миграция завершена успешно!');
    
    // Выводим статистику
    const userCount = await User.count();
    const categoryCount = await Category.count();
    const productCount = await Product.count();
    const orderCount = await Order.count();

    console.log('\n📊 Статистика после миграции:');
    console.log(`👥 Пользователей: ${userCount}`);
    console.log(`📂 Категорий: ${categoryCount}`);
    console.log(`🍣 Товаров: ${productCount}`);
    console.log(`📦 Заказов: ${orderCount}`);

  } catch (error) {
    console.error('❌ Критическая ошибка миграции:', error);
  } finally {
    // Закрываем соединение с базой данных
    await db.close();
    process.exit(0);
  }
}

// Запускаем миграцию
migrateData();
