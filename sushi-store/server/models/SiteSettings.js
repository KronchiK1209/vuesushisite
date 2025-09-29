const db = require('../config/database');

class SiteSettings {
  static async ensureTable() {
    await db.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        site_title VARCHAR(200) DEFAULT 'Точка суши и пиццы',
        logo TEXT,
        favicon TEXT,
        background_color VARCHAR(7) DEFAULT '#dc2626',
        home_blocks JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Добавляем колонку background_color если её нет
    await db.query(`
      ALTER TABLE site_settings 
      ADD COLUMN IF NOT EXISTS background_color VARCHAR(7) DEFAULT '#dc2626';
    `);
  }

  static async get() {
    await this.ensureTable();
    const res = await db.query('SELECT * FROM site_settings ORDER BY created_at ASC LIMIT 1');
    if (res.rows.length === 0) {
      const defaultBlocks = {
        hero: {
          heading: "БЫСТРО И ВКУСНО",
          subheading: "Попробуйте наши особые суши",
          description: "Самые свежие роллы и нигири для любого настроения. Заказывайте онлайн или забирайте сами.",
          buttonText: "Заказать сейчас",
          backgroundImage: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d"
        },
        categories: {
          heading: "Категории и блюда",
          subheading: "которые вы нигде не найдете",
          description: "Уникальные рецепты от наших шеф-поваров"
        },
        menu: {
          heading: "Популярные блюда",
          subheading: "Попробуйте наши хиты",
          description: "Самые любимые блюда наших клиентов"
        },
        delivery: {
          heading: "Быстрая доставка",
          subheading: "Доставляем за 30 минут",
          description: "Свежие суши и пицца прямо к вашей двери",
          features: [
            "Бесплатная доставка от 1500₽",
            "Доставка за 30 минут",
            "Свежие ингредиенты",
            "Горячие блюда"
          ]
        },
        reviews: {
          heading: "Отзывы наших клиентов",
          subheading: "Что говорят о нас",
          description: "Более 1000 довольных клиентов"
        }
      };
      
      const inserted = await db.query(
        `INSERT INTO site_settings (site_title, logo, favicon, background_color, home_blocks)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          'Точка суши и пиццы',
          null,
          null,
          '#dc2626',
          JSON.stringify(defaultBlocks)
        ]
      );
      return inserted.rows[0];
    }
    return res.rows[0];
  }

  static async update(data) {
    await this.ensureTable();
    const current = await this.get();
    
    // Объединяем существующие home_blocks с новыми данными
    const currentBlocks = typeof current.home_blocks === 'string' 
      ? JSON.parse(current.home_blocks) 
      : (current.home_blocks || {});
    
    const newBlocks = data.home_blocks || {};
    const mergedBlocks = { ...currentBlocks, ...newBlocks };
    
    const values = {
      site_title: data.site_title ?? current.site_title,
      logo: data.logo ?? current.logo,
      favicon: data.favicon ?? current.favicon,
      background_color: data.background_color ?? current.background_color,
      home_blocks: JSON.stringify(mergedBlocks)
    };
    
    const res = await db.query(
      `UPDATE site_settings
       SET site_title = $1, logo = $2, favicon = $3, background_color = $4, home_blocks = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [values.site_title, values.logo, values.favicon, values.background_color, values.home_blocks, current.id]
    );
    return res.rows[0];
  }
}

module.exports = SiteSettings;


