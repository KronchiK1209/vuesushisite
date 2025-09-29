/**
 * Модель категории
 */

const db = require('../config/database');

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.description = data.description;
    this.order_index = data.order_index;
    this.is_active = data.is_active;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Создание новой категории
  static async create(categoryData) {
    const { name, image, description, order_index = 0, is_active = true } = categoryData;
    
    const query = `
      INSERT INTO categories (name, image, description, order_index, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await db.query(query, [name, image, description, order_index, is_active]);
    return new Category(result.rows[0]);
  }

  // Поиск категории по ID
  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Category(result.rows[0]);
  }

  // Получение всех категорий
  static async findAll(activeOnly = true) {
    let query = 'SELECT * FROM categories';
    
    if (activeOnly) {
      query += ' WHERE is_active = true';
    }
    
    query += ' ORDER BY order_index ASC, name ASC';
    
    const result = await db.query(query);
    return result.rows.map(row => new Category(row));
  }

  // Обновление категории
  async update(updateData) {
    const allowedFields = ['name', 'image', 'description', 'order_index', 'is_active'];
    const updates = [];
    const params = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        paramCount++;
        updates.push(`${key} = $${paramCount}`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      return this;
    }

    paramCount++;
    params.push(this.id);

    const query = `
      UPDATE categories 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await db.query(query, params);
      const updatedCategory = new Category(result.rows[0]);
      
      // Обновляем текущий объект
      Object.assign(this, updatedCategory);
      
      return this;
    } catch (error) {
      // Если ошибка связана с ограничениями базы данных
      if (error.code === '23514') {
        const constraintError = new Error('Validation failed');
        constraintError.statusCode = 400;
        constraintError.details = error.detail;
        throw constraintError;
      }
      throw error;
    }
  }

  // Удаление категории
  async delete() {
    const query = 'DELETE FROM categories WHERE id = $1';
    await db.query(query, [this.id]);
  }

  // Деактивация категории
  async deactivate() {
    const query = 'UPDATE categories SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1';
    await db.query(query, [this.id]);
    this.is_active = false;
  }

  // Активация категории
  async activate() {
    const query = 'UPDATE categories SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1';
    await db.query(query, [this.id]);
    this.is_active = true;
  }

  // Получение товаров в категории
  async getProducts(limit = 50) {
    const query = `
      SELECT * FROM products 
      WHERE category_id = $1 AND available = true
      ORDER BY order_index ASC, name ASC
      LIMIT $2
    `;
    
    const result = await db.query(query, [this.id, limit]);
    return result.rows;
  }

  // Подсчет товаров в категории
  async getProductCount() {
    const query = 'SELECT COUNT(*) FROM products WHERE category_id = $1 AND available = true';
    const result = await db.query(query, [this.id]);
    return parseInt(result.rows[0].count);
  }

  // Поиск категории по названию
  static async findByName(name) {
    const query = 'SELECT * FROM categories WHERE name = $1 AND is_active = true';
    const result = await db.query(query, [name]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Category(result.rows[0]);
  }

  // Получение категорий с количеством товаров
  static async findAllWithProductCount() {
    const query = `
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.available = true
      WHERE c.is_active = true
      GROUP BY c.id
      ORDER BY c.order_index ASC, c.name ASC
    `;
    
    const result = await db.query(query);
    return result.rows.map(row => {
      const category = new Category(row);
      category.product_count = parseInt(row.product_count);
      return category;
    });
  }

  // Подсчет общего количества категорий
  static async count(activeOnly = true) {
    let query = 'SELECT COUNT(*) FROM categories';
    
    if (activeOnly) {
      query += ' WHERE is_active = true';
    }
    
    const result = await db.query(query);
    return parseInt(result.rows[0].count);
  }

  // Статический метод удаления категории по ID
  static async delete(categoryId) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0;
  }

  // Получение данных категории
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      description: this.description,
      order_index: this.order_index,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at,
      product_count: this.product_count
    };
  }
}

module.exports = Category;
