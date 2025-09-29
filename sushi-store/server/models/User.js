/**
 * Модель пользователя
 */

const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  constructor(data) {
    this.id = data.id;
    this.phone = data.phone;
    this.password_hash = data.password_hash;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.last_login = data.last_login;
    this.is_active = data.is_active;
  }

  // Создание нового пользователя
  static async create(userData) {
    const { phone, password, name, email, role = 'user' } = userData;
    
    // Хешируем пароль
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (phone, password_hash, name, email, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await db.query(query, [phone, password_hash, name, email, role]);
    return new User(result.rows[0]);
  }

  // Создание гостевого пользователя по номеру телефона (без пароля)
  static async createGuest(phone) {
    // Генерируем случайный пароль для гостевого пользователя
    const randomPassword = Math.random().toString(36).slice(-12);
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(randomPassword, saltRounds);
    
    const query = `
      INSERT INTO users (phone, password_hash, role)
      VALUES ($1, $2, 'user')
      RETURNING *
    `;
    
    const result = await db.query(query, [phone, password_hash]);
    return new User(result.rows[0]);
  }

  // Найти или создать пользователя по номеру телефона
  static async findOrCreateByPhone(phone) {
    // Сначала пытаемся найти существующего пользователя
    let user = await this.findByPhone(phone);
    
    if (user) {
      return user;
    }
    
    // Если пользователь не найден, создаем гостевого пользователя
    return await this.createGuest(phone);
  }

  // Поиск пользователя по телефону
  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = $1 AND is_active = true';
    const result = await db.query(query, [phone]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  // Поиск пользователя по ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  // Проверка пароля
  async checkPassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }

  // Обновление времени последнего входа
  async updateLastLogin() {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await db.query(query, [this.id]);
  }

  // Обновление пароля
  async updatePassword(newPassword) {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);
    
    const query = 'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await db.query(query, [password_hash, this.id]);
    
    this.password_hash = password_hash;
  }

  // Получение всех пользователей (только для админов)
  static async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT id, phone, role, created_at, last_login, is_active
      FROM users 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await db.query(query, [limit, offset]);
    return result.rows.map(row => new User(row));
  }

  // Подсчет общего количества пользователей
  static async count() {
    const query = 'SELECT COUNT(*) FROM users WHERE is_active = true';
    const result = await db.query(query);
    return parseInt(result.rows[0].count);
  }

  // Деактивация пользователя
  async deactivate() {
    const query = 'UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1';
    await db.query(query, [this.id]);
    this.is_active = false;
  }

  // Активация пользователя
  async activate() {
    const query = 'UPDATE users SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1';
    await db.query(query, [this.id]);
    this.is_active = true;
  }

  // Удаление пользователя (мягкое удаление)
  async delete() {
    await this.deactivate();
  }

  // Получение данных пользователя без пароля
  toJSON() {
    return {
      id: this.id,
      phone: this.phone,
      name: this.name,
      email: this.email,
      role: this.role,
      created_at: this.created_at,
      updated_at: this.updated_at,
      last_login: this.last_login,
      is_active: this.is_active
    };
  }

  // Проверка, является ли пользователь админом
  isAdmin() {
    return this.role === 'admin';
  }

  // Проверка, является ли пользователь активным
  isActive() {
    return this.is_active;
  }
}

module.exports = User;
