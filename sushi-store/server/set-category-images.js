// Assign curated images to categories based on their names
// Won't overwrite existing non-empty images

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sushi_store',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  client_encoding: 'utf8'
});

function pickImageByCategoryName(nameRaw) {
  const name = (nameRaw || '').toLowerCase();
  // Curated Unsplash images (royalty-free). Replace with CDN if needed
  const images = {
    rolls: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
    hotrolls: 'https://images.unsplash.com/photo-1607301405418-780ee5e6dd10',
    sushi: 'https://images.unsplash.com/photo-1553621045-1b8f9e79c8fa',
    sets: 'https://images.unsplash.com/photo-1514516870926-2059892e42f3',
    pizza: 'https://images.unsplash.com/photo-1548365328-9f547fb09530',
    wok: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    noodles: 'https://images.unsplash.com/photo-1542444459-db63c02e93b3',
    soup: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    salad: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141',
    drinks: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd',
    dessert: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55',
    default: 'https://images.unsplash.com/photo-1562158074-d49fbeffcc91'
  };

  if (/(ролл|roll)/.test(name)) {
    if (/(горяч|hot)/.test(name)) return images.hotrolls;
    return images.rolls;
  }
  if (/(суши|sushi|нигири|nigiri)/.test(name)) return images.sushi;
  if (/(сет|сетЫ|set)/.test(name)) return images.sets;
  if (/(пицц|pizza)/.test(name)) return images.pizza;
  if (/(вок|лапш|wok|nood)/.test(name)) return images.noodles;
  if (/(суп|soup)/.test(name)) return images.soup;
  if (/(салат|salad)/.test(name)) return images.salad;
  if (/(напит|drink|сок|кола|лимонад)/.test(name)) return images.drinks;
  if (/(десерт|dessert|морож|торт)/.test(name)) return images.dessert;
  return images.default;
}

async function run() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT id, name, image FROM categories ORDER BY name');
    let updated = 0;
    for (const row of rows) {
      const img = pickImageByCategoryName(row.name);
      await client.query('UPDATE categories SET image = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [img, row.id]);
      updated++;
      console.log(`Updated category ${row.name} (${row.id}) → image set`);
    }
    console.log(`Done. Categories updated: ${updated}/${rows.length}`);
  } catch (e) {
    console.error('Failed to set category images:', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();


