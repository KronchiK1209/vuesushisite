/**
 * Модель товара
 */

const db = require('../config/database');

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = parseFloat(data.price);
    this.image = data.image;
    this.category_id = data.category_id;
    this.available = data.available;
    this.hit = data.hit;
    this.purchases = data.purchases;
    this.order_index = data.order_index;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Создание нового товара
  static async create(productData) {
    const { name, description, price, image, category_id, available = true, hit = false, order_index = 0 } = productData;
    
    const query = `
      INSERT INTO products (name, description, price, image, category_id, available, hit, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await db.query(query, [name, description, price, image, category_id, available, hit, order_index]);
    return new Product(result.rows[0]);
  }

  // Поиск товара по ID
  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const product = new Product(result.rows[0]);
    product.category_name = result.rows[0].category_name;
    return product;
  }

  // Получение всех товаров с фильтрацией
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 0;

    // Фильтр по категории
    if (filters.category) {
      paramCount++;
      query += ` AND c.name = $${paramCount}`;
      params.push(filters.category);
    }

    // Фильтр по доступности
    if (filters.available !== undefined) {
      paramCount++;
      query += ` AND p.available = $${paramCount}`;
      params.push(filters.available);
    }

    // Фильтр по хитам
    if (filters.hit !== undefined) {
      paramCount++;
      query += ` AND p.hit = $${paramCount}`;
      params.push(filters.hit);
    }

    // Поиск по названию
    if (filters.search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }

    // Сортировка
    if (filters.sortBy) {
      const validSortFields = ['name', 'price', 'created_at', 'order_index'];
      if (validSortFields.includes(filters.sortBy)) {
        const direction = filters.sortDirection === 'desc' ? 'DESC' : 'ASC';
        query += ` ORDER BY p.${filters.sortBy} ${direction}`;
      }
    } else {
      query += ` ORDER BY p.order_index ASC, p.name ASC`;
    }

    // Пагинация
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    }

    if (filters.offset) {
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      params.push(filters.offset);
    }

    const result = await db.query(query, params);
    return result.rows.map(row => {
      const product = new Product(row);
      product.category_name = row.category_name;
      return product;
    });
  }

  // Обновление товара
  async update(updateData) {
    const allowedFields = ['name', 'description', 'price', 'image', 'category_id', 'available', 'hit', 'order_index'];
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
      UPDATE products 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await db.query(query, params);
      const updatedProduct = new Product(result.rows[0]);
      
      // Обновляем текущий объект
      Object.assign(this, updatedProduct);
      
      return this;
    } catch (error) {
      // Если ошибка связана с ограничениями базы данных (например, отрицательная цена)
      if (error.code === '23514') {
        const constraintError = new Error('Validation failed');
        constraintError.statusCode = 400;
        constraintError.details = error.detail;
        throw constraintError;
      }
      throw error;
    }
  }

  // Удаление товара
  async delete() {
    const query = 'DELETE FROM products WHERE id = $1';
    await db.query(query, [this.id]);
  }

  // Увеличение счетчика покупок
  async incrementPurchases(amount = 1) {
    const query = 'UPDATE products SET purchases = purchases + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    await db.query(query, [amount, this.id]);
    this.purchases += amount;
  }

  // Получение товаров по категории
  static async findByCategory(categoryId, limit = 50) {
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1 AND p.available = true
      ORDER BY p.order_index ASC, p.name ASC
      LIMIT $2
    `;
    
    const result = await db.query(query, [categoryId, limit]);
    return result.rows.map(row => {
      const product = new Product(row);
      product.category_name = row.category_name;
      return product;
    });
  }

  // Получение хитов продаж
  static async getHits(limit = 10) {
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.hit = true AND p.available = true
      ORDER BY p.purchases DESC, p.order_index ASC
      LIMIT $1
    `;
    
    const result = await db.query(query, [limit]);
    return result.rows.map(row => {
      const product = new Product(row);
      product.category_name = row.category_name;
      return product;
    });
  }

  // Подсчет общего количества товаров
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (filters.category) {
      paramCount++;
      query += ` AND c.name = $${paramCount}`;
      params.push(filters.category);
    }

    if (filters.available !== undefined) {
      paramCount++;
      query += ` AND p.available = $${paramCount}`;
      params.push(filters.available);
    }

    if (filters.hit !== undefined) {
      paramCount++;
      query += ` AND p.hit = $${paramCount}`;
      params.push(filters.hit);
    }

    if (filters.search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count);
  }

  // Поиск товаров по ID категории
  static async findByCategoryId(categoryId) {
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1
      ORDER BY p.order_index ASC, p.name ASC
    `;
    
    const result = await db.query(query, [categoryId]);
    return result.rows.map(row => new Product(row));
  }

  // Получение данных товара
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image,
      category_id: this.category_id,
      category_name: this.category_name,
      available: this.available,
      hit: this.hit,
      purchases: this.purchases,
      order_index: this.order_index,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Product;
