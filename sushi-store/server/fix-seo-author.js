/**
 * Скрипт для исправления поля author в таблице seo_settings
 */

const db = require('./config/database');

async function fixSeoAuthorColumn() {
  try {
    console.log('Исправляем размер поля author в таблице seo_settings...');
    
    const query = 'ALTER TABLE seo_settings ALTER COLUMN author TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле author в seo_settings успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля author в seo_settings:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixSeoAuthorColumn();
