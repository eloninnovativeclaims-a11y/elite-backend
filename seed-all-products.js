const { pool, createTables } = require('./config/database');

const seedAllProducts = async () => {
  console.log('Creating database tables...');
  await createTables();

  const client = await pool.connect();

  try {
    const products = [
      // DEALS OF THE WEEK
      {slug:'isabella-deste-busts', title:"Isabella d'Este & Francesco II Gonzaga Majolica Busts by Angelo Minghetti", cat:'Antiques & Collectibles', subcat:'Porcelain', era:'19th C.', material:'Majolica', price:10700, old:11700, img:'Busts.png'},
      {slug:'rolls-royce-1904', title:'1969 COPO Camaro ZL1', cat:'Luxurious Cars', subcat:'Classic Car', era:'1969', material:'Steel & Fiberglass', price:1359250, old:2150000, img:'Camaro.png'},
      {slug:'meissen-four-elements', title:'Meissen Four Elements Porcelain Ewers', cat:'Antiques & Collectibles', subcat:'Porcelain', era:'18th C.', material:'Meissen Porcelain', price:110000, old:198500, img:'Four.png'},
      {slug:'french-necessaire', title:'French Nécessaire de Voyage', cat:'Antiques & Collectibles', subcat:'Travel', era:'19th C.', material:'Gold & Leather', price:3800, old:4500, img:'French.png'},
      
      // ANTIQUES & COLLECTIBLES
      {slug:'cobalt-porcelain-urns', title:'Pair of Cobalt-Blue Porcelain Urns with Ormolu Mounts', cat:'Antiques & Collectibles', subcat:'Porcelain', era:'19th C.', material:'Porcelain & Bronze', price:6500, old:7900, img:'Cobalt.png'},
      {slug:'domergue-console', title:'Domergue Gilt-Bronze Console Table', cat:'Antiques & Collectibles', subcat:'Furniture', era:'19th C.', material:'Gilt Bronze', price:186500, old:275000, img:'photo-1555041469-a586c61ea9bc'},
      {slug:'linke-grand-regulator', title:"The Linke Grand Regulator — World's Fair Clock", cat:'Antiques & Collectibles', subcat:'Clocks', era:'1900', material:'Ormolu & Marble', price:1385000, old:1850000, img:'photo-1501139083538-0139583c060f'},
      {slug:'egyptian-bedroom', title:'Egyptian Empire Bedroom Suite', cat:'Antiques & Collectibles', subcat:'Furniture', era:'19th C.', material:'Kingwood & Ormolu', price:10100, old:15000, img:'Napo.png'},
      {slug:'russian-cloisonne', title:'Russian Cloisonné Enamel Tea Set', cat:'Antiques & Collectibles', subcat:'Silverware', era:'19th C.', material:'Silver & Enamel', price:38500, old:58000, img:'photo-1558618666-fcd25c85cd64'},
      {slug:'three-train-skeleton', title:'Three-Train Skeleton Clock by Smith & Sons', cat:'Antiques & Collectibles', subcat:'Clocks', era:'19th C.', material:'Brass & Glass', price:24500, old:38000, img:'photo-1509048191080-d2984bad6ae5'},
      {slug:'sevres-bureau-plat', title:'Sèvres Porcelain-Mounted Bureau Plat', cat:'Antiques & Collectibles', subcat:'Furniture', era:'18th C.', material:'Porcelain & Bronze', price:425000, old:620000, img:'photo-1567016432779-094069958ea5'},
      {slug:'blue-john-cassolettes', title:'Pair of Blue John and Bronze Cassolettes', cat:'Antiques & Collectibles', subcat:'Decorative', era:'19th C.', material:'Blue John & Bronze', price:68500, old:98000, img:'photo-1616486029900-aa47873c2b53'},
      {slug:'murano-fountain', title:'Murano Venetian Glass Water Fountain', cat:'Antiques & Collectibles', subcat:'Glass', era:'20th C.', material:'Murano Glass', price:52000, old:78000, img:'photo-1578749556568-bc2c40e68b61'},
      {slug:'flora-danica', title:'Flora Danica Porcelain Dinner Service — Royal Copenhagen (119 Pieces)', cat:'Antiques & Collectibles', subcat:'Porcelain', era:'19th C.', material:'Porcelain', price:285000, old:420000, img:'photo-1584266337361-66f4e64497e8'},
      {slug:'satinwood-sideboard', title:'Exhibition Satinwood Sideboard by Wright & Mansfield', cat:'Antiques & Collectibles', subcat:'Furniture', era:'1862', material:'Satinwood', price:165000, old:245000, img:'photo-1556909114-f6e7ad7d3136'},
      {slug:'minton-vases', title:'Pair of Minton Exhibition Vases', cat:'Antiques & Collectibles', subcat:'Porcelain', era:'1862', material:'Parian Porcelain', price:78500, old:115000, img:'photo-1578500351865-d66683452fe5'},
      {slug:'cartier-clock', title:'Cartier Belle Époque Rhodonite Clock', cat:'Antiques & Collectibles', subcat:'Clocks', era:'1910', material:'Rhodonite & Gold', price:385000, old:520000, img:'photo-1509048191080-d2984bad6ae5'},
      {slug:'louis-xv-chandelier', title:'Louis XV-Style Ormolu Chandelier', cat:'Antiques & Collectibles', subcat:'Lighting', era:'19th C.', material:'Ormolu & Crystal', price:92000, old:138000, img:'photo-1524484485831-a92ffc0de03f'},
      {slug:'baccarat-chandelier', title:'Baccarat Crystal Chandelier', cat:'Antiques & Collectibles', subcat:'Lighting', era:'20th C.', material:'Crystal & Bronze', price:15800, old:17000, img:'Crystal.png'},
      {slug:'turkish-baskets', title:'Ottoman Turkish Silver Baskets', cat:'Antiques & Collectibles', subcat:'Silverware', era:'18th C.', material:'Silver', price:1000, old:1800, img:'Ottoman.png'},
      {slug:'leitz-microscope', title:'Leitz Brass Compound Microscope', cat:'Antiques & Collectibles', subcat:'Scientific', era:'1890', material:'Brass', price:12500, old:18500, img:'photo-1532187863486-abf9dbad1b69'},
      {slug:'gouthiere-urn', title:'19th-Century Gilt Bronze & Egitto Serpentino Urn after Pierre Gouthière', cat:'Antiques & Collectibles', subcat:'Decorative', era:'19th C.', material:'Gilt Bronze', price:15000, old:18000, img:'Gilt.png'},
      {slug:'baccarat-centerpiece', title:'Baccarat Crystal and Doré Bronze Centerpiece', cat:'Antiques & Collectibles', subcat:'Decorative', era:'19th C.', material:'Crystal & Bronze', price:78500, old:115000, img:'photo-1578749555655-86e73a95d0a0'},
      {slug:'malachite-inkwell', title:'Malachite and Bronze Inkwell', cat:'Antiques & Collectibles', subcat:'Decorative', era:'19th C.', material:'Malachite & Bronze', price:4700, old:5700, img:'Inkwell.png'},
      {slug:'sevres-box', title:'Sèvres Porcelain and Bronze Box', cat:'Antiques & Collectibles', subcat:'Porcelain', era:'18th C.', material:'Porcelain & Bronze', price:3700, old:5000, img:'Bronze.png'},
      {slug:'dasson-urns', title:'Henry Dasson Egyptian Granite and Bronze Urns', cat:'Antiques & Collectibles', subcat:'Decorative', era:'19th C.', material:'Granite & Bronze', price:325000, old:485000, img:'photo-1616486029900-aa47873c2b53'},
      {slug:'windsor-snuff', title:'Duke & Duchess of Windsor Gold Snuff Box', cat:'Antiques & Collectibles', subcat:'Silverware', era:'1937', material:'Gold & Enamel', price:185000, old:265000, img:'photo-1617038220319-276d3cfab638'},
      {slug:'tiffany-clock', title:'Tiffany & Co. Art Deco Carved Agate, Enamel & Diamond Clock', cat:'Antiques & Collectibles', subcat:'Clocks', era:'1925', material:'Agate & Gold', price:245000, old:365000, img:'photo-1509048191080-d2984bad6ae5'},
      {slug:'silver-tazze', title:'Royal Silver Gilt Tazze by Digby Scott & Benjamin Smith', cat:'Antiques & Collectibles', subcat:'Silverware', era:'1810', material:'Silver Gilt', price:165000, old:245000, img:'photo-1584266337361-66f4e64497e8'},
      {slug:'raingo-orrrery', title:'Raingo Frères Orrery Clock', cat:'Antiques & Collectibles', subcat:'Clocks', era:'1880', material:'Ormolu & Glass', price:425000, old:620000, img:'photo-1509048191080-d2984bad6ae5'},
      {slug:'victoria-inkwell', title:'Silver-Gilt Inkwell Presented by Queen Victoria to Sir John Kirkland', cat:'Antiques & Collectibles', subcat:'Silverware', era:'1873', material:'Silver Gilt', price:38500, old:58000, img:'photo-1584266337361-66f4e64497e8'},
      {slug:'louis-xv-vase', title:'Louis XV Style Bleu Céleste Vase', cat:'Antiques & Collectibles', subcat:'Porcelain', era:'19th C.', material:'Porcelain & Ormolu', price:62000, old:92000, img:'photo-1578321272176-b7bbc0679853'},
      {slug:'louis-xvi-pedestal', title:'Louis XVI-Style Ormolu Pedestal', cat:'Antiques & Collectibles', subcat:'Furniture', era:'19th C.', material:'Ormolu & Marble', price:48500, old:72000, img:'photo-1555041469-a586c61ea9bc'},
      
      // VINTAGE JEWELRY
      {slug:'cartier-tutti', title:'Cartier Tutti Frutti Diamond & Ruby Bracelet', cat:'Vintage Jewelry', subcat:'Bracelets', era:'1928', material:'Platinum, Diamond, Ruby', price:1250000, old:1850000, img:'photo-1599643477877-530eb83abc8e'},
      {slug:'van-cleef-ziara', title:'Van Cleef & Arpels Ziara Emerald Necklace', cat:'Vintage Jewelry', subcat:'Necklaces', era:'1929', material:'Diamond & Emerald', price:985000, old:1450000, img:'photo-1515562141207-7a88fb7ce338'},
      {slug:'tiara-royal', title:'Royal Victorian Diamond Tiara', cat:'Vintage Jewelry', subcat:'Tiaras', era:'1890', material:'Gold & Diamond', price:785000, old:1150000, img:'photo-1535632066927-ab7c9ab60908'},
      {slug:'art-deco-ring', title:'Art Deco Sapphire & Diamond Cocktail Ring', cat:'Vintage Jewelry', subcat:'Rings', era:'1935', material:'Platinum & Sapphire', price:68500, old:98000, img:'photo-1605100804763-247f67b3557e'},
      
      // CARS
      {slug:'ferrari-250-gto', title:'Ferrari F8 Tributo (Rosso Corsa Red)', cat:'Luxurious Cars', subcat:'Sports Car', era:'2024', material:'Carbon Fiber & Aluminum', price:387500, old:419900, img:'FerrariF8.png'},
      {slug:'mercedes-300sl', title:'2026 Mercedes-AMG G 63', cat:'Luxurious Cars', subcat:'Luxury SUV', era:'2026', material:'Aluminum & Steel', price:259000, old:289000, img:'2026Mercedes.png'},
      {slug:'jaguar-etype', title:'LAMBORGHINI URUS', cat:'Luxurious Cars', subcat:'Performance SUV', era:'2022', material:'Carbon Fiber & Aluminum', price:325370, old:325370, img:'Urus.png'},
      {slug:'aston-martin-db5', title:'Porsche 911 Turbo S', cat:'Luxurious Cars', subcat:'Sports Car', era:'2024', material:'Carbon Fiber & Aluminum', price:208000, old:286650, img:'Porshe911.png'},
      {slug:'porsche-911-carrera', title:'Lamborghini Aventador SVJ', cat:'Luxurious Cars', subcat:'Sports Car', era:'2018', material:'Carbon Fiber & Aluminum', price:295000, old:325000, img:'Lambo.png'},
      {slug:'bugatti-type-57', title:'Rolls-Royce Phantom', cat:'Luxurious Cars', subcat:'Luxury Sedan', era:'2024', material:'Aluminum & Leather', price:555350, old:650550, img:'Rolls.png'},
      {slug:'mclaren-720s', title:'McLaren 720S Coupe — Midnight Black', cat:'Luxurious Cars', subcat:'Supercar', era:'2025', material:'Carbon Fiber & Alcantara', price:340000, old:378000, img:'Mc.png'},
      {slug:'bentley-continental-gt', title:'Bentley Continental GT Speed — Mulliner Edition', cat:'Luxurious Cars', subcat:'Grand Tourer', era:'2024', material:'Leather & Wood', price:325000, old:362000, img:'Bentley1.png'},
      {slug:'rolls-royce-cullinan', title:'Rolls-Royce Cullinan Black Badge', cat:'Luxurious Cars', subcat:'Luxury SUV', era:'2024', material:'Steel & Leather', price:435000, old:478000, img:'RR.png'},
      {slug:'porsche-taycan', title:'Porsche Taycan Turbo S — Emerald Green', cat:'Luxurious Cars', subcat:'Electric Sports Car', era:'2025', material:'Aluminum & Leather', price:215000, old:238000, img:'Taycan.png'},
      {slug:'maserati-mc20', title:'Maserati MC20 Coupe', cat:'Luxurious Cars', subcat:'Exotic Sports Car', era:'2023', material:'Carbon Fiber & Alcantara', price:288000, old:318000, img:'Masarati1.png'},
      {slug:'24k-gold-bar', title:'24K Cast Gold Bar — Investment Grade', cat:'Antiques & Collectibles', subcat:'Precious Metals', era:'Modern', material:'24K Gold', price:1495000, old:1795000, img:'photo-1518540720474-010d2ba1625c'},
      {slug:'blue-diamond-necklace', title:'Blue Diamond Solitaire Necklace', cat:'Vintage Jewelry', subcat:'Necklaces', era:'21st C.', material:'Blue Diamond', price:3250000, old:3800000, img:'Bluediamond.png'},
      {slug:'patek-nautilus-5711', title:'Patek Philippe Nautilus 5711 in White Gold', cat:'Vintage Jewelry', subcat:'Watches', era:'1976', material:'White Gold', price:1245000, old:1595000, img:'PatekPhilippeNautilus.png'},
      {slug:'diamond-solitaire-ring', title:'Princess-Cut Diamond Solitaire Ring', cat:'Vintage Jewelry', subcat:'Rings', era:'21st C.', material:'Platinum & Diamond', price:895000, old:1100000, img:'PrincessCut.png'},
      {slug:'emerald-cufflinks', title:'Royal Emerald & Gold Cufflinks', cat:'Vintage Jewelry', subcat:'Accessories', era:'20th C.', material:'Emerald & Gold', price:215000, old:280000, img:'photo-1512436991641-6745cdb1723f'},
    ];

    console.log(`Inserting ${products.length} products...`);
    
    for (const p of products) {
      await client.query(
        `INSERT INTO products (slug, title, category, subcategory, era, material, price, old_price, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (slug) DO NOTHING`,
        [p.slug, p.title, p.cat, p.subcat, p.era, p.material, p.price, p.old, p.img]
      );
    }

    console.log('✅ All products inserted successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    client.release();
    await pool.end();
  }
};

seedAllProducts();
