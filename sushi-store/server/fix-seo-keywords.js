/**
 * Скрипт для исправления поля keywords в таблице seo_settings
 */

const db = require('./config/database');

async function fixSeoKeywordsColumn() {
  try {
    console.log('Исправляем размер поля keywords в таблице seo_settings...');
    
    const query = 'ALTER TABLE seo_settings ALTER COLUMN keywords TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле keywords в seo_settings успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля keywords в seo_settings:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixSeoKeywordsColumn();
