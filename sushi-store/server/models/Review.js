const db = require('../config/database');

class Review {
  static async ensureTable() {
    const sql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(50),
        approved BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rating INTEGER;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS comment TEXT;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS name VARCHAR(100);
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='reviews' AND column_name='id'
        ) THEN
          ALTER TABLE reviews ADD COLUMN id UUID DEFAULT uuid_generate_v4();
        END IF;
      END $$;
    `;
    try { await db.query(sql); } catch (_) {}
  }

  static async findAll(filters = {}) {
    await this.ensureTable();
    const values = [];
    const where = [];
    if (filters.approved !== undefined) {
      values.push(!!filters.approved);
      where.push(`approved = $${values.length}`);
    }
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `
      SELECT 
        id, rating, comment, name, phone, approved,
        created_at AS "createdAt", updated_at AS "updatedAt"
      FROM reviews
      ${whereClause}
      ORDER BY created_at DESC
    `;
    const res = await db.query(sql, values);
    return res.rows;
  }

  static async findById(id) {
    await this.ensureTable();
    const sql = `
      SELECT 
        id, rating, comment, name, phone, approved,
        created_at AS "createdAt", updated_at AS "updatedAt"
      FROM reviews WHERE id = $1
    `;
    const res = await db.query(sql, [id]);
    return res.rows[0] || null;
  }

  static async create(data) {
    await this.ensureTable();
    const sql = `
      INSERT INTO reviews (rating, comment, name, phone, approved)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING 
        id, rating, comment, name, phone, approved,
        created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    const values = [
      Number(data.rating) || 0,
      data.comment || '',
      data.name || 'Аноним',
      data.phone || null,
      data.approved === true
    ];
    const res = await db.query(sql, values);
    return res.rows[0];
  }

  static async update(id, data) {
    await this.ensureTable();
    const fields = [];
    const values = [];
    const setField = (col, val) => { values.push(val); fields.push(`${col} = $${values.length}`); };
    if (data.rating !== undefined) setField('rating', Number(data.rating));
    if (data.comment !== undefined) setField('comment', data.comment);
    if (data.name !== undefined) setField('name', data.name);
    if (data.phone !== undefined) setField('phone', data.phone);
    if (data.approved !== undefined) setField('approved', !!data.approved);
    if (fields.length === 0) return await this.findById(id);
    values.push(id);
    const sql = `
      UPDATE reviews SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING 
        id, rating, comment, name, phone, approved,
        created_at AS "createdAt", updated_at AS "updatedAt"
    `;
    const res = await db.query(sql, values);
    return res.rows[0] || null;
  }

  static async delete(id) {
    await this.ensureTable();
    const res = await db.query('DELETE FROM reviews WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
}

module.exports = Review;


