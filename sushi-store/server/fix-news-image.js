/**
 * Скрипт для исправления поля image в таблице news
 */

const db = require('./config/database');

async function fixNewsImageColumn() {
  try {
    console.log('Исправляем размер поля image в таблице news...');
    
    const query = 'ALTER TABLE news ALTER COLUMN image TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле image в news успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля image в news:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixNewsImageColumn();
