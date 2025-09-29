/**
 * Скрипт для изменения поля image на TEXT (без ограничений по длине)
 */

const db = require('./config/database');

async function fixImageToText() {
  try {
    console.log('Изменяем поля image на TEXT для поддержки больших base64 изображений...');
    
    // Изменяем поле image в таблице products
    console.log('Исправляем products.image...');
    await db.query('ALTER TABLE products ALTER COLUMN image TYPE TEXT;');
    console.log('✅ products.image изменено на TEXT');
    
    // Изменяем поле image в таблице categories
    console.log('Исправляем categories.image...');
    await db.query('ALTER TABLE categories ALTER COLUMN image TYPE TEXT;');
    console.log('✅ categories.image изменено на TEXT');
    
    // Изменяем поле image в таблице category_blocks
    console.log('Исправляем category_blocks.image...');
    await db.query('ALTER TABLE category_blocks ALTER COLUMN image TYPE TEXT;');
    console.log('✅ category_blocks.image изменено на TEXT');
    
    // Изменяем поле image в таблице news
    console.log('Исправляем news.image...');
    await db.query('ALTER TABLE news ALTER COLUMN image TYPE TEXT;');
    console.log('✅ news.image изменено на TEXT');
    
    console.log('🎉 Все поля image успешно изменены на TEXT!');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении полей image:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixImageToText();
