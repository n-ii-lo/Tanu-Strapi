/**
 * Seed initial data for Tanu Ice Cream
 * Categories and Products from existing catalog
 */

const categoriesData = [
  { key: 'ice-cream', label: 'Морозиво', slug: 'ice-cream', sortOrder: 1 },
  { key: 'sorbet', label: 'Сорбети', slug: 'sorbet', sortOrder: 2 },
  { key: 'jar', label: 'Морозиво в банці', slug: 'jar', sortOrder: 3 },
  { key: 'cone', label: 'Рожки', slug: 'cone', sortOrder: 4 },
];

const productsData = [
  {
    name: 'Макадамія',
    slug: 'makadamiia',
    description: 'Вершкове морозиво з шматочками горіхів макадамія та медом',
    price: 100,
    categoryKey: 'ice-cream',
    sortOrder: 1,
    available: true,
  },
  {
    name: 'Анчан',
    slug: 'anchan',
    description: 'Блакитне морозиво з квіток метелика з делікатним квітковим смаком',
    price: 90,
    categoryKey: 'ice-cream',
    sortOrder: 2,
    available: true,
  },
  {
    name: 'Малина',
    slug: 'malyna',
    description: 'Інтенсивний сорбет зі свіжої малини без додавання вершків',
    price: 75,
    categoryKey: 'sorbet',
    sortOrder: 3,
    available: true,
  },
  {
    name: 'Манго',
    slug: 'mango',
    description: 'Стиглий тропічний манго у вигляді охолоджуючого сорбету',
    price: 80,
    categoryKey: 'sorbet',
    sortOrder: 4,
    available: true,
  },
  {
    name: 'Гранат',
    slug: 'hranat',
    description: 'Кислуватий та освіжаючий сорбет з гранатовим соком',
    price: 80,
    categoryKey: 'sorbet',
    sortOrder: 5,
    available: true,
  },
  {
    name: 'Жасмин + Порічка',
    slug: 'zhasmyn-porychka',
    description: 'Квітковий аромат жасмину поєднується з кислинкою чорної порічки',
    price: 85,
    categoryKey: 'sorbet',
    sortOrder: 6,
    available: true,
  },
  {
    name: 'Полуниця + Базилік',
    slug: 'polunytsia-bazylyk-banka',
    description: 'Класичне поєднання полуниці з пряним базиліком у маленькій баночці',
    price: 120,
    categoryKey: 'jar',
    sortOrder: 7,
    available: true,
  },
  {
    name: 'Персик + Розмарин',
    slug: 'pershyk-rozmaryn-banka',
    description: "Сонячний персик з трав'яною ноткою розмарину — несподівано гарно",
    price: 125,
    categoryKey: 'jar',
    sortOrder: 8,
    available: true,
  },
  {
    name: 'Йогурт + Лохина',
    slug: 'yohurt-lokhyna-banka',
    description: 'Легкий йогуртовий пломбір з лісовою лохиною у баночці',
    price: 115,
    categoryKey: 'jar',
    sortOrder: 9,
    available: true,
  },
  {
    name: 'Куркума + Імбир',
    slug: 'kurkuma-imber-banka',
    description: 'Зігрівальний та яскравий смак куркуми з пряним імбиром',
    price: 118,
    categoryKey: 'jar',
    sortOrder: 10,
    available: true,
  },
  {
    name: 'Рожок класичний',
    slug: 'rozhok-klasychnyi',
    description: 'Хрустка вафельна ріжка з однією кулькою морозива на вибір',
    price: 60,
    categoryKey: 'cone',
    sortOrder: 11,
    available: true,
  },
  {
    name: 'Рожок шоколадний',
    slug: 'rozhok-shokoladnyi',
    description: 'Вафельна ріжка, вкрита темним шоколадом та горіховою крихтою',
    price: 70,
    categoryKey: 'cone',
    sortOrder: 12,
    available: true,
  },
  {
    name: 'Рожок подвійний',
    slug: 'rozhok-podoiinyi',
    description: 'Велика хрустка ріжка з двома кульками морозива та топінгом',
    price: 80,
    categoryKey: 'cone',
    sortOrder: 13,
    available: true,
  },
];

module.exports = async ({ strapi }) => {
  // Only seed in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const seedEnabled = process.env.SEED_DATA === 'true';
  if (!seedEnabled) {
    console.log('Skipping seed data. Set SEED_DATA=true to enable.');
    return;
  }

  console.log('Seeding categories and products...');

  try {
    // Create categories first
    const categoryMap = {};
    
    for (const catData of categoriesData) {
      const existing = await strapi.db.query('api::category.category').findOne({
        where: { key: catData.key },
      });

      if (!existing) {
        const category = await strapi.db.query('api::category.category').create({
          data: {
            key: catData.key,
            label: catData.label,
            slug: catData.slug,
            sortOrder: catData.sortOrder,
            publishedAt: new Date(),
          },
        });
        categoryMap[catData.key] = category.id;
        console.log(`Created category: ${catData.label}`);
      } else {
        categoryMap[catData.key] = existing.id;
        console.log(`Category already exists: ${catData.label}`);
      }
    }

    // Create products with category relations
    for (const prodData of productsData) {
      const categoryId = categoryMap[prodData.categoryKey];
      
      if (!categoryId) {
        console.warn(`Category ${prodData.categoryKey} not found, skipping product ${prodData.name}`);
        continue;
      }

      const existing = await strapi.db.query('api::product.product').findOne({
        where: { slug: prodData.slug },
      });

      if (!existing) {
        await strapi.db.query('api::product.product').create({
          data: {
            name: prodData.name,
            slug: prodData.slug,
            description: prodData.description,
            price: prodData.price,
            category: categoryId,
            sortOrder: prodData.sortOrder,
            available: prodData.available,
            publishedAt: new Date(),
          },
        });
        console.log(`Created product: ${prodData.name}`);
      } else {
        console.log(`Product already exists: ${prodData.name}`);
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
};
