/**
 * Скрипт для исправления поля image в таблице category_blocks
 */

const db = require('./config/database');

async function fixCategoryBlocksImageColumn() {
  try {
    console.log('Исправляем размер поля image в таблице category_blocks...');
    
    const query = 'ALTER TABLE category_blocks ALTER COLUMN image TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле image в category_blocks успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля image в category_blocks:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixCategoryBlocksImageColumn();
