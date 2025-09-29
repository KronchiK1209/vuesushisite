/**
 * Скрипт для создания админа с правильным паролем
 */

const bcrypt = require('bcrypt');
const db = require('../config/database');

async function createAdmin() {
  try {
    console.log('🔐 Создаем админа...');
    
    // Хешируем пароль
    const saltRounds = 12;
    const password_hash = await bcrypt.hash('admin123', saltRounds);
    
    // Создаем пользователя
    const query = `
      INSERT INTO users (phone, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await db.query(query, ['+7 (999) 123-45-67', password_hash, 'admin']);
    
    console.log('✅ Админ создан успешно!');
    console.log('📱 Телефон: +7 (999) 123-45-67');
    console.log('🔑 Пароль: admin123');
    console.log('👤 Роль: admin');
    
  } catch (error) {
    console.error('❌ Ошибка создания админа:', error);
  } finally {
    await db.close();
    process.exit(0);
  }
}

createAdmin();


