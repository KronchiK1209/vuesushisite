const db = require('../config/database');

class News {
  static async findAll(filters = {}) {
    const values = [];
    const where = [];
    if (filters.published !== undefined) {
      values.push(filters.published === true);
      where.push(`published = $${values.length}`);
    }
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `
      SELECT 
        id, title, content, COALESCE(excerpt, '') AS excerpt, image, published,
        published_at AS "publishedAt", author_id AS "authorId",
        created_at AS "createdAt", updated_at AS "updatedAt"
      FROM news
      ${whereClause}
      ORDER BY COALESCE(published_at, created_at) DESC
    `;
    const result = await db.query(sql, values);
    return result.rows;
  }

  static async findById(id) {
    const sql = `
      SELECT 
        id, title, content, COALESCE(excerpt, '') AS excerpt, image, published,
        published_at AS "publishedAt", author_id AS "authorId",
        created_at AS "createdAt", updated_at AS "updatedAt"
      FROM news WHERE id = $1
    `;
    const result = await db.query(sql, [id]);
    return result.rows[0] || null;
  }

  static async create(data) {
    const sql = `
      INSERT INTO news (title, content, excerpt, image, published, published_at, author_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id, title, content, COALESCE(excerpt, '') AS excerpt, image, published,
        published_at AS "publishedAt", author_id AS "authorId",
        created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    const values = [
      data.title,
      data.content,
      data.excerpt || '',
      data.image || null,
      data.published === true,
      data.publishedAt ? new Date(data.publishedAt) : null,
      data.authorId || null
    ];
    const result = await db.query(sql, values);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    const setField = (col, val) => {
      values.push(val);
      fields.push(`${col} = $${values.length}`);
    };

    if (data.title !== undefined) setField('title', data.title);
    if (data.content !== undefined) setField('content', data.content);
    if (data.excerpt !== undefined) setField('excerpt', data.excerpt);
    if (data.image !== undefined) setField('image', data.image);
    if (data.published !== undefined) setField('published', data.published === true);
    if (data.publishedAt !== undefined) setField('published_at', data.publishedAt ? new Date(data.publishedAt) : null);
    if (data.authorId !== undefined) setField('author_id', data.authorId);

    if (fields.length === 0) {
      const existing = await this.findById(id);
      return existing;
    }

    values.push(id);
    const sql = `
      UPDATE news SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING 
        id, title, content, COALESCE(excerpt, '') AS excerpt, image, published,
        published_at AS "publishedAt", author_id AS "authorId",
        created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    const result = await db.query(sql, values);
    return result.rows[0] || null;
  }

  static async delete(id) {
    const sql = 'DELETE FROM news WHERE id = $1';
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  }
}

module.exports = News;


