const { Pool } = require('pg');

class CategoryBlocks {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'sushi_store',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
      client_encoding: 'utf8',
    });
  }

  async findAll() {
    const query = 'SELECT * FROM category_blocks ORDER BY order_index, created_at';
    
    try {
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error finding all category blocks:', error);
      throw error;
    }
  }

  async findById(id) {
    const query = 'SELECT * FROM category_blocks WHERE id = $1';
    const values = [id];
    
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding category block by id:', error);
      throw error;
    }
  }

  async create(data) {
    const { title, description, image, order_index = 0, enabled = true, category_id = null } = data;
    const query = `
      INSERT INTO category_blocks (title, description, image, order_index, enabled, category_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, description, image, order_index, enabled, category_id];
    
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating category block:', error);
      throw error;
    }
  }

  async update(id, data) {
    const { title, description, image, order_index, enabled, category_id } = data;
    const query = `
      UPDATE category_blocks 
      SET title = $1, description = $2, image = $3, 
          order_index = $4, enabled = $5, category_id = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [title, description, image, order_index, enabled, category_id, id];
    
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating category block:', error);
      throw error;
    }
  }

  async delete(id) {
    const query = 'DELETE FROM category_blocks WHERE id = $1 RETURNING *';
    const values = [id];
    
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting category block:', error);
      throw error;
    }
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = CategoryBlocks;
