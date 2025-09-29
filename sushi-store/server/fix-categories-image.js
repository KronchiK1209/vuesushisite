/**
 * Скрипт для исправления поля image в таблице categories
 */

const db = require('./config/database');

async function fixCategoriesImageColumn() {
  try {
    console.log('Исправляем размер поля image в таблице categories...');
    
    const query = 'ALTER TABLE categories ALTER COLUMN image TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле image в categories успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля image в categories:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixCategoriesImageColumn();
