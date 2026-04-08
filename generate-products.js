const fs = require('fs');

const csv = fs.readFileSync('marche_lt_eben_ezer_248_queries_and_filenames.csv', 'utf8');
const lines = csv.split('\n').slice(1);

const categoryMap = {
  'Food': 'food',
  'Frozen Vegetables': 'frozen-vegetables',
  'Frozen Fish': 'frozen-fish',
  'Canned Food': 'canned-food',
  'Dry Goods': 'dry-goods',
  'Spices': 'spices',
  'Condiments': 'condiments',
  'Snacks': 'snacks',
  'Beverages': 'beverages',
  'Household': 'household',
  'Fresh Vegetables': 'fresh-vegetables',
  'Medical': 'medical'
};

const products = lines.map(line => {
  const [id, category, name, details, searchQuery, fileName] = line.split(',');
  if (!id || !name) return null;
  
  const subcategory = categoryMap[category] || 'food';
  const imagePath = fileName ? `/product_images/${subcategory}/${fileName.trim()}` : '/products/placeholder.svg';
  
  return {
    id: parseInt(id),
    name: name.trim(),
    size_pack: details ? details.trim() : '',
    category: 'Pantry Staples',
    subcategory: subcategory,
    image: imagePath,
    price: 9.99,
    description: '',
    inStock: true,
    visible: true,
    featured: false,
    source: 'csv'
  };
}).filter(p => p !== null);

fs.writeFileSync('public/products.json', JSON.stringify(products, null, 2));
console.log('Generated products.json with ' + products.length + ' products');
