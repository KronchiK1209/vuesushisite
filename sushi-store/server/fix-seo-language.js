/**
 * Скрипт для исправления поля language в таблице seo_settings
 */

const db = require('./config/database');

async function fixSeoLanguageColumn() {
  try {
    console.log('Исправляем размер поля language в таблице seo_settings...');
    
    const query = 'ALTER TABLE seo_settings ALTER COLUMN language TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле language в seo_settings успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля language в seo_settings:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixSeoLanguageColumn();
