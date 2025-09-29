/**
 * Скрипт для исправления схемы базы данных
 */

const db = require('./config/database');

async function fixImageColumn() {
  try {
    console.log('Исправляем размер поля image в таблице products...');
    
    const query = 'ALTER TABLE products ALTER COLUMN image TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле image успешно изменено на VARCHAR(100000)');
    
    // Проверяем, что изменение применилось
    const checkQuery = `
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'image';
    `;
    
    const result = await db.query(checkQuery);
    console.log('📊 Текущие настройки поля image:', result.rows[0]);
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля image:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixImageColumn();
