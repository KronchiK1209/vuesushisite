const { Pool } = require('pg');

class SEOSettings {
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

  async findByPage(page) {
    const query = 'SELECT * FROM seo_settings WHERE page = $1';
    const values = [page];
    
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding SEO setting by page:', error);
      throw error;
    }
  }

  async createOrUpdate(page, seoData) {
    const {
      site = {},
      pages = {}
    } = seoData;

    // Обновляем основную страницу - используем все поля из site объекта
    const mainPageData = {
      title: site.title || '',
      description: site.description || '',
      keywords: site.keywords || '',
      author: site.author || '',
      language: site.language || '',
      robots: site.robots || '',
      canonical: site.canonical || '',
      og_title: site.ogTitle || '',
      og_description: site.ogDescription || '',
      og_image: site.ogImage || '',
      og_site_name: site.ogSiteName || '',
      twitter_card: site.twitterCard || '',
      twitter_title: site.twitterTitle || '',
      twitter_description: site.twitterDescription || '',
      twitter_image: site.twitterImage || '',
      structured_data: site.structuredData || {}
    };

    const query = `
      INSERT INTO seo_settings (page, title, description, keywords, author, language, robots, canonical,
                               og_title, og_description, og_image, og_site_name, twitter_card, twitter_title,
                               twitter_description, twitter_image, structured_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (page)
      DO UPDATE SET 
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        keywords = EXCLUDED.keywords,
        author = EXCLUDED.author,
        language = EXCLUDED.language,
        robots = EXCLUDED.robots,
        canonical = EXCLUDED.canonical,
        og_title = EXCLUDED.og_title,
        og_description = EXCLUDED.og_description,
        og_image = EXCLUDED.og_image,
        og_site_name = EXCLUDED.og_site_name,
        twitter_card = EXCLUDED.twitter_card,
        twitter_title = EXCLUDED.twitter_title,
        twitter_description = EXCLUDED.twitter_description,
        twitter_image = EXCLUDED.twitter_image,
        structured_data = EXCLUDED.structured_data,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [
      page,
      mainPageData.title,
      mainPageData.description,
      mainPageData.keywords,
      mainPageData.author,
      mainPageData.language,
      mainPageData.robots,
      mainPageData.canonical,
      mainPageData.og_title,
      mainPageData.og_description,
      mainPageData.og_image,
      mainPageData.og_site_name,
      mainPageData.twitter_card,
      mainPageData.twitter_title,
      mainPageData.twitter_description,
      mainPageData.twitter_image,
      JSON.stringify(mainPageData.structured_data)
    ];
    
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating/updating SEO setting:', error);
      throw error;
    }
  }

  async getAll() {
    const query = 'SELECT * FROM seo_settings ORDER BY page';
    
    try {
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting all SEO settings:', error);
      throw error;
    }
  }

  async delete(page) {
    const query = 'DELETE FROM seo_settings WHERE page = $1 RETURNING *';
    const values = [page];
    
    try {
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting SEO setting:', error);
      throw error;
    }
  }

  // Преобразует данные из базы в формат для фронтенда
  formatForFrontend(dbData) {
    if (!dbData) return null;

    return {
      site: {
        title: dbData.title || '',
        description: dbData.description || '',
        keywords: dbData.keywords || '',
        author: dbData.author || '',
        language: dbData.language || '',
        robots: dbData.robots || '',
        canonical: dbData.canonical || '',
        siteName: dbData.og_site_name || '',
        locale: dbData.language || 'ru_RU',
        // Open Graph
        ogTitle: dbData.og_title || '',
        ogDescription: dbData.og_description || '',
        ogImage: dbData.og_image || '',
        ogSiteName: dbData.og_site_name || '',
        ogType: 'website',
        ogUrl: dbData.canonical || '',
        // Twitter Cards
        twitterCard: dbData.twitter_card || '',
        twitterTitle: dbData.twitter_title || '',
        twitterDescription: dbData.twitter_description || '',
        twitterImage: dbData.twitter_image || '',
        // VK Cards
        vkCard: 'article',
        vkTitle: dbData.og_title || '',
        vkDescription: dbData.og_description || '',
        vkImage: dbData.og_image || '',
        vkSiteName: dbData.og_site_name || '',
        // Одноклассники Cards
        okCard: 'article',
        okTitle: dbData.og_title || '',
        okDescription: dbData.og_description || '',
        okImage: dbData.og_image || '',
        okSiteName: dbData.og_site_name || '',
        // Структурированные данные
        structuredData: dbData.structured_data || {
          name: dbData.og_site_name || '',
          description: dbData.description || '',
          url: dbData.canonical || '',
          telephone: '+7 (999) 123-45-67',
          address: {
            addressCountry: 'Россия',
            addressLocality: 'Москва'
          },
          servesCuisine: ['Японская кухня', 'Итальянская кухня'],
          hasMenu: 'https://sushi-store.com/',
          acceptsReservations: false,
          priceRange: '$$',
          paymentAccepted: ['Наличные', 'Карта', 'Онлайн'],
          deliveryAvailable: true,
          openingHours: 'Mo-Su 10:00-23:00'
        }
      },
      pages: {
        home: { 
          title: dbData.title || 'Главная страница | Точка суши и пиццы', 
          description: dbData.description || 'Лучший интернет-магазин суши и пиццы', 
          keywords: dbData.keywords || 'суши, пицца, доставка' 
        },
        cart: { 
          title: 'Корзина | Точка суши и пиццы', 
          description: 'Ваша корзина с заказами', 
          keywords: 'корзина, заказ' 
        },
        news: { 
          title: 'Новости | Точка суши и пиццы', 
          description: 'Последние новости нашего магазина', 
          keywords: 'новости, акции' 
        }
      },
      sitemap: {
        enabled: true,
        priority: { home: 1.0, news: 0.8, products: 0.7, cart: 0.6 },
        changefreq: { home: "daily", news: "weekly", products: "weekly", cart: "monthly" }
      },
      robots: {
        enabled: true,
        userAgent: "*",
        allow: ["/", "/api/products", "/api/categories", "/api/news", "/api/reviews", "/assets/", "/client/"],
        disallow: ["/admin/", "/api/admin/", "/api/orders", "/api/users", "/api/login", "/api/seo", "/api/category-blocks", "/checkout", "/thankyou", "/review/"],
        sitemap: "https://sushi-store.com/sitemap.xml"
      }
    };
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = SEOSettings;
