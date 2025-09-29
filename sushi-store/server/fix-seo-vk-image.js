/**
 * Скрипт для исправления поля vk_image в таблице seo_settings
 */

const db = require('./config/database');

async function fixSeoVkImageColumn() {
  try {
    console.log('Исправляем размер поля vk_image в таблице seo_settings...');
    
    const query = 'ALTER TABLE seo_settings ALTER COLUMN vk_image TYPE VARCHAR(100000);';
    await db.query(query);
    
    console.log('✅ Поле vk_image в seo_settings успешно изменено на VARCHAR(100000)');
    
  } catch (error) {
    console.error('❌ Ошибка при изменении поля vk_image в seo_settings:', error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
}

fixSeoVkImageColumn();
