const db = require('./config/database');

async function fixOrders() {
  try {
    console.log('🔧 Исправляем данные заказов...\n');
    
    // Получаем все заказы с проблемными данными
    const result = await db.query('SELECT id, extras_selection FROM orders');
    
    console.log(`Найдено заказов: ${result.rows.length}`);
    
    for (const order of result.rows) {
      const orderId = order.id;
      const extrasSelection = order.extras_selection;
      
      console.log(`\nЗаказ ${orderId}:`);
      console.log(`  extras_selection: "${extrasSelection}"`);
      
      // Проверяем, является ли это валидным JSON
      let isValidJson = true;
      let parsedData = [];
      
      try {
        if (extrasSelection && extrasSelection !== '[]' && extrasSelection !== 'null') {
          parsedData = JSON.parse(extrasSelection);
        }
      } catch (error) {
        isValidJson = false;
        console.log(`  ❌ Некорректный JSON: ${error.message}`);
      }
      
      if (!isValidJson || extrasSelection === null || extrasSelection === 'null') {
        // Исправляем данные
        const updateQuery = 'UPDATE orders SET extras_selection = $1 WHERE id = $2';
        await db.query(updateQuery, ['[]', orderId]);
        console.log(`  ✅ Исправлено: установлено []`);
      } else {
        console.log(`  ✅ JSON корректен`);
      }
    }
    
    console.log('\n🎉 Исправление завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    process.exit(0);
  }
}

fixOrders();


