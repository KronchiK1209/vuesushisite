/**
 * Модель заказа
 */

const db = require('../config/database');

class Order {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.customer_name = data.customer_name;
    this.customer_phone = data.customer_phone;
    this.customer_address = data.customer_address;
    this.total_amount = parseFloat(data.total_amount);
    this.status = data.status;
    this.delivery_time = data.delivery_time;
    this.scheduled_time = data.scheduled_time;
    this.persons = data.persons;
    this.extras_selection = data.extras_selection || [];
    this.notes = data.notes;
    this.paid = data.paid || false;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Создание нового заказа
  static async create(orderData) {
    try {
      const {
        user_id,
        customer_name,
        customer_phone,
        customer_address,
        total_amount,
        delivery_time = 'asap',
        scheduled_time,
        persons = 1,
        extras_selection = [],
        notes
      } = orderData;

      console.log('Order.create called with:', orderData);

      const query = `
        INSERT INTO orders (
          user_id, customer_name, customer_phone, customer_address,
          total_amount, status, delivery_time, scheduled_time, persons,
          extras_selection, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const params = [
        user_id, customer_name, customer_phone, customer_address,
        total_amount, 'pending', delivery_time, scheduled_time, persons,
        JSON.stringify(extras_selection), notes
      ];

      console.log('Executing query with params:', params);

      const result = await db.query(query, params);

      console.log('Order created successfully:', result.rows[0]);
      return new Order(result.rows[0]);
    } catch (error) {
      console.error('Error in Order.create:', error);
      throw error;
    }
  }

  // Поиск заказа по ID
  static async findById(id) {
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const order = new Order(result.rows[0]);
    // Безопасный парсинг JSON
    try {
      order.extras_selection = JSON.parse(order.extras_selection || '[]');
    } catch (error) {
      console.warn('Invalid JSON in extras_selection for order', order.id, ':', order.extras_selection);
      order.extras_selection = [];
    }
    return order;
  }

  // Получение всех заказов с фильтрацией
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    let paramCount = 0;

    // Фильтр по пользователю
    if (filters.user_id) {
      paramCount++;
      query += ` AND user_id = $${paramCount}`;
      params.push(filters.user_id);
    }

    // Фильтр по статусу
    if (filters.status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
    }

    // Фильтр по дате (от)
    if (filters.date_from) {
      paramCount++;
      query += ` AND created_at >= $${paramCount}`;
      params.push(filters.date_from);
    }

    // Фильтр по дате (до)
    if (filters.date_to) {
      paramCount++;
      query += ` AND created_at <= $${paramCount}`;
      params.push(filters.date_to);
    }

    // Сортировка
    query += ' ORDER BY created_at DESC';

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
    const orders = [];
    
    for (const row of result.rows) {
      const order = new Order(row);
      // Безопасный парсинг JSON
      try {
        order.extras_selection = JSON.parse(order.extras_selection || '[]');
      } catch (error) {
        console.warn('Invalid JSON in extras_selection for order', order.id, ':', order.extras_selection);
        order.extras_selection = [];
      }
      
      // Загружаем товары заказа
      try {
        const items = await order.getItems();
        order.items = items;
      } catch (error) {
        console.warn('Failed to load items for order', order.id, ':', error.message);
        order.items = [];
      }
      
      // Создаем массив допов для совместимости с админкой
      order.extras = [
        { name: 'Соевый соус', price: 50 },
        { name: 'Имбирь', price: 50 },
        { name: 'Васаби', price: 50 }
      ];
      
      orders.push(order);
    }
    
    return orders;
  }

  // Обновление заказа
  async update(updateData) {
    const allowedFields = [
      'customer_name', 'customer_phone', 'customer_address',
      'total_amount', 'status', 'delivery_time', 'scheduled_time',
      'persons', 'extras_selection', 'notes', 'paid'
    ];
    
    const updates = [];
    const params = [];
    let paramCount = 0;

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedFields.includes(key)) {
        paramCount++;
        if (key === 'extras_selection') {
          updates.push(`${key} = $${paramCount}`);
          params.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = $${paramCount}`);
          params.push(value);
        }
      }
    }

    if (updates.length === 0) {
      return this;
    }

    paramCount++;
    params.push(this.id);

    const query = `
      UPDATE orders 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await db.query(query, params);
    const updatedOrder = new Order(result.rows[0]);
    // Безопасный парсинг JSON
    try {
      updatedOrder.extras_selection = JSON.parse(updatedOrder.extras_selection || '[]');
    } catch (error) {
      console.warn('Invalid JSON in extras_selection for order', updatedOrder.id, ':', updatedOrder.extras_selection);
      updatedOrder.extras_selection = [];
    }
    
    // Обновляем текущий объект
    Object.assign(this, updatedOrder);
    
    return this;
  }

  // Удаление заказа
  async delete() {
    const query = 'DELETE FROM orders WHERE id = $1';
    await db.query(query, [this.id]);
  }

  // Добавление товара в заказ
  async addItem(productId, quantity, price) {
    const query = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [this.id, productId, quantity, price]);
    return result.rows[0];
  }

  // Получение товаров заказа
  async getItems() {
    const query = `
      SELECT oi.*, p.name as product_name, p.image as product_image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at ASC
    `;
    
    const result = await db.query(query, [this.id]);
    return result.rows;
  }

  // Обновление товара в заказе
  async updateItem(itemId, quantity, price) {
    const query = `
      UPDATE order_items 
      SET quantity = $1, price = $2
      WHERE id = $3 AND order_id = $4
      RETURNING *
    `;
    
    const result = await db.query(query, [quantity, price, itemId, this.id]);
    return result.rows[0];
  }

  // Удаление товара из заказа
  async removeItem(itemId) {
    const query = 'DELETE FROM order_items WHERE id = $1 AND order_id = $2';
    await db.query(query, [itemId, this.id]);
  }

  // Пересчет общей суммы заказа
  async recalculateTotal() {
    const query = `
      SELECT SUM(quantity * price) as total
      FROM order_items
      WHERE order_id = $1
    `;
    
    const result = await db.query(query, [this.id]);
    const total = parseFloat(result.rows[0].total || 0);
    
    await this.update({ total_amount: total });
    this.total_amount = total;
    
    return total;
  }

  // Изменение статуса заказа
  async updateStatus(status) {
    const validStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    
    await this.update({ status });
    this.status = status;
  }

  // Получение заказов пользователя
  static async findByUserId(userId, limit = 20) {
    const query = `
      SELECT * FROM orders 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    
    const result = await db.query(query, [userId, limit]);
    return result.rows.map(row => {
      const order = new Order(row);
      // Безопасный парсинг JSON
      try {
        order.extras_selection = JSON.parse(order.extras_selection || '[]');
      } catch (error) {
        console.warn('Invalid JSON in extras_selection for order', order.id, ':', order.extras_selection);
        order.extras_selection = [];
      }
      return order;
    });
  }

  // Получение статистики заказов
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        SUM(CASE WHEN status = 'delivered' THEN total_amount ELSE 0 END) as total_revenue,
        AVG(CASE WHEN status = 'delivered' THEN total_amount ELSE NULL END) as avg_order_value
      FROM orders
    `;
    
    const result = await db.query(query);
    return result.rows[0];
  }

  // Подсчет общего количества заказов
  static async count(filters = {}) {
    let query = 'SELECT COUNT(*) FROM orders WHERE 1=1';
    const params = [];
    let paramCount = 0;

    if (filters.user_id) {
      paramCount++;
      query += ` AND user_id = $${paramCount}`;
      params.push(filters.user_id);
    }

    if (filters.status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters.date_from) {
      paramCount++;
      query += ` AND created_at >= $${paramCount}`;
      params.push(filters.date_from);
    }

    if (filters.date_to) {
      paramCount++;
      query += ` AND created_at <= $${paramCount}`;
      params.push(filters.date_to);
    }

    const result = await db.query(query, params);
    return parseInt(result.rows[0].count);
  }

  // Получение данных заказа
  toJSON() {
    return {
      id: this.id,
      user_id: this.user_id,
      customer_name: this.customer_name,
      customer_phone: this.customer_phone,
      customer_address: this.customer_address,
      // Добавляем структуру customer для совместимости с админкой
      customer: {
        name: this.customer_name,
        address: {
          phone: this.customer_phone,
          city: this.customer_address ? this.customer_address.split(',')[0] : '',
          street: this.customer_address ? this.customer_address.split(',')[1] : '',
          apartment: this.customer_address ? this.customer_address.split(',')[2] : ''
        }
      },
      total_amount: this.total_amount,
      status: this.status,
      delivery_time: this.delivery_time,
      scheduled_time: this.scheduled_time,
      persons: this.persons,
      extras_selection: this.extras_selection || [],
      notes: this.notes,
      paid: this.paid || false,
      created_at: this.created_at,
      updated_at: this.updated_at,
      // Добавляем поля для совместимости с админкой
      date: this.created_at,
      total: this.total_amount,
      items: this.items || [], // Товары заказа
      extras: this.extras || [] // Допы
    };
  }
}

module.exports = Order;
