/**
 * Скрипт для исправления поля twitter_image в таблице seo_settings
 */

const db = require('./config/database');

async function fixSeoTwitterImageColumn() {
  try {
    console.log('Исправляем размер поля twitter_image в таблице seo_settings...');
    
    const query = 'ALTER TABLE seo_settings ALTER COLUMN twitter_image TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле twitter_image в seo_settings успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля twitter_image в seo_settings:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixSeoTwitterImageColumn();
