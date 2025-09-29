const db = require('./config/database');

async function run() {
  console.log('Starting news table migration...');
  try {
    // Ensure table exists
    await db.query('SELECT 1 FROM news LIMIT 1').catch(async (e) => {
      console.log('news table not found, creating...');
      await db.query(`
        CREATE TABLE IF NOT EXISTS news (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title VARCHAR(200) NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          image TEXT,
          author_id UUID REFERENCES users(id) ON DELETE SET NULL,
          published BOOLEAN DEFAULT false,
          published_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await db.query('CREATE INDEX IF NOT EXISTS idx_news_published ON news(published)');
      await db.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);
      await db.query('DROP TRIGGER IF EXISTS update_news_updated_at ON news');
      await db.query('CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()');
    });

    // Add excerpt column if missing
    const colCheck = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'news' AND column_name = 'excerpt'
    `);
    if (colCheck.rows.length === 0) {
      console.log('Adding column news.excerpt TEXT');
      await db.query('ALTER TABLE news ADD COLUMN excerpt TEXT');
    }

    // Change image to TEXT if not already
    const typeCheck = await db.query(`
      SELECT data_type FROM information_schema.columns 
      WHERE table_name = 'news' AND column_name = 'image'
    `);
    if (typeCheck.rows[0] && typeCheck.rows[0].data_type !== 'text') {
      console.log('Altering column news.image to TEXT');
      await db.query('ALTER TABLE news ALTER COLUMN image TYPE TEXT');
    }

    console.log('News table migration completed.');
    process.exit(0);
  } catch (e) {
    console.error('Migration failed:', e);
    process.exit(1);
  }
}

run();


