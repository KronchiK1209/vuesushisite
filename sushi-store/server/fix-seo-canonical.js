/**
 * Скрипт для исправления поля canonical в таблице seo_settings
 */

const db = require('./config/database');

async function fixSeoCanonicalColumn() {
  try {
    console.log('Исправляем размер поля canonical в таблице seo_settings...');
    
    const query = 'ALTER TABLE seo_settings ALTER COLUMN canonical TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле canonical в seo_settings успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля canonical в seo_settings:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixSeoCanonicalColumn();
