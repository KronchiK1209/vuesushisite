/**
 * Скрипт для исправления поля robots в таблице seo_settings
 */

const db = require('./config/database');

async function fixSeoRobotsColumn() {
  try {
    console.log('Исправляем размер поля robots в таблице seo_settings...');
    
    const query = 'ALTER TABLE seo_settings ALTER COLUMN robots TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле robots в seo_settings успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля robots в seo_settings:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixSeoRobotsColumn();
