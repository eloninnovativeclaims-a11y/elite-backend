const { pool, createTables } = require('./config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  // First, create the tables if they don't exist
  console.log('Creating database tables...');
  await createTables();

  const client = await pool.connect();

  try {
    // Create demo user
    const passwordHash = await bcrypt.hash('demo1234', 10);
    await client.query(
      `INSERT INTO users (uid, first_name, last_name, email, phone, password_hash)
       VALUES ('u1', 'Alexander', 'Whitmore', 'collector@elite.com', '+1 310 555 0199', $1)
       ON CONFLICT (email) DO NOTHING`,
      [passwordHash]
    );

    // Seed products
    const products = [
      {
        slug: 'isabella-deste-busts',
        title: "Isabella d'Este & Francesco II Gonzaga Majolica Busts by Angelo Minghetti",
        category: 'Antiques & Collectibles',
        subcategory: 'Porcelain',
        era: '19th C.',
        material: 'Majolica',
        price: 10700,
        old_price: 11700,
        image_url: 'Busts.png'
      },
      {
        slug: 'rolls-royce-1904',
        title: '1969 COPO Camaro ZL1',
        category: 'Luxurious Cars',
        subcategory: 'Classic Car',
        era: '1969',
        material: 'Steel & Fiberglass',
        price: 1359250,
        old_price: 2150000,
        image_url: 'Camaro.png'
      },
      {
        slug: 'meissen-four-elements',
        title: 'Meissen Four Elements Porcelain Ewers',
        category: 'Antiques & Collectibles',
        subcategory: 'Porcelain',
        era: '18th C.',
        material: 'Meissen Porcelain',
        price: 110000,
        old_price: 198500,
        image_url: 'Four.png'
      },
      {
        slug: 'french-necessaire',
        title: 'French Nécessaire de Voyage',
        category: 'Antiques & Collectibles',
        subcategory: 'Travel',
        era: '19th C.',
        material: 'Gold & Leather',
        price: 3800,
        old_price: 4500,
        image_url: 'French.png'
      }
    ];

    for (const p of products) {
      await client.query(
        `INSERT INTO products (slug, title, category, subcategory, era, material, price, old_price, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO NOTHING`,
        [p.slug, p.title, p.category, p.subcategory, p.era, p.material, p.price, p.old_price, p.image_url]
      );
    }

    console.log('✅ Seed data inserted successfully');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    client.release();
    await pool.end(); // Close the database connection so the script exits
  }
};

seedData();
