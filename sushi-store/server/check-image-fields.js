/**
 * Скрипт для проверки полей image в базе данных
 */

const db = require('./config/database');

async function checkImageFields() {
  try {
    console.log('Проверяем поля image в базе данных...');
    
    // Проверяем таблицу products
    const productsQuery = `
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'image';
    `;
    const productsResult = await db.query(productsQuery);
    console.log('📊 Поле image в products:', productsResult.rows[0]);
    
    // Проверяем таблицу categories
    const categoriesQuery = `
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'categories' AND column_name = 'image';
    `;
    const categoriesResult = await db.query(categoriesQuery);
    console.log('📊 Поле image в categories:', categoriesResult.rows[0]);
    
    // Проверяем таблицу category_blocks
    const categoryBlocksQuery = `
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'category_blocks' AND column_name = 'image';
    `;
    const categoryBlocksResult = await db.query(categoryBlocksQuery);
    console.log('📊 Поле image в category_blocks:', categoryBlocksResult.rows[0]);
    
    // Проверяем таблицу news
    const newsQuery = `
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'news' AND column_name = 'image';
    `;
    const newsResult = await db.query(newsQuery);
    console.log('📊 Поле image в news:', newsResult.rows[0]);
    
  } catch (error) {
    console.error('❌ Ошибка при проверке полей image:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

checkImageFields();
