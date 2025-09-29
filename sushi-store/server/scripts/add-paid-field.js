const db = require('../config/database');

async function addPaidField() {
  try {
    console.log('Добавляем поле paid в таблицу orders...');
    
    // Добавляем поле paid
    await db.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT false');
    console.log('Поле paid добавлено');
    
    // Обновляем существующие заказы
    await db.query('UPDATE orders SET paid = false WHERE paid IS NULL');
    console.log('Существующие заказы обновлены');
    
    console.log('Миграция завершена успешно');
  } catch (error) {
    console.error('Ошибка миграции:', error);
  } finally {
    await db.end();
  }
}

addPaidField();


