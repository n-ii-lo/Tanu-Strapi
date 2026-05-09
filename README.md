# Tanu Strapi CMS

Strapi v4 CMS for managing Tanu Ice Cream catalog.

## Structure

- **Categories** (`api::category.category`): key, label, slug, description, sortOrder
- **Products** (`api::product.product`): name, slug, description, price, image, category, available, sortOrder

## Quick Start

### 1. Install Strapi

```bash
cd strapi
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Seed Initial Data

For first run, seed data is enabled by default via `SEED_DATA=true`:

```bash
npm run develop
```

This will create:
- 4 Categories (Морозиво, Сорбети, Морозиво в банці, Рожки)
- 13 Products with all your existing items

### 4. Access Admin Panel

Open: `http://localhost:1337/admin`

Default admin credentials will be created on first run.

---

## Strapi Cloud Deployment

### 1. Create Project on Strapi Cloud

- Go to [https://cloud.strapi.io](https://cloud.strapi.io)
- Create new project
- Copy your **Project ID** and **API Token**

### 2. Add Strapi Cloud Remote

```bash
# In the strapi/ folder
git init
git add .
git commit -m "Initial commit"

# Add Strapi Cloud as remote
git remote add strapi https://git.strapi.io/your-username/tanu-strapi.git
git push --set-upstream strapi main
```

### 3. Configure for Strapi Cloud

Update `.env`:

```
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host.from.strapi.cloud
DATABASE_PORT=5432
DATABASE_NAME=your_db_name
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_db_password
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Strapi Cloud will provide these:
STRAPI_CLOUD_TOKEN=your_token
STRAPI_CLOUD_PROJECT_ID=your_project_id
```

### 4. Deploy

Push to Strapi Cloud:

```bash
git add .
git commit -m "Ready for Strapi Cloud"
git push strapi main
```

---

## API Endpoints

| Resource | Endpoint |
|----------|----------|
| Categories | `/api/categories` |
| Products | `/api/products` |
| Single Product | `/api/products/:slug` |
| Products by Category | `/api/products?filters[category][slug][$eq]=:categorySlug` |

### Example: Get all products with categories

```bash
curl http://localhost:1337/api/products?populate=category,image
```

### Example: Get ice-cream products only

```bash
curl http://localhost:1337/api/products?filters[category][key][$eq]=ice-cream&populate=category,image
```

---

## Connecting Frontend

In your frontend (React/Next.js/etc.), fetch products:

```javascript
const response = await fetch('http://your-strapi-url/api/products?populate=category,image');
const { data } = await response.json();
```

For production, use environment variables:

```javascript
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
```

---

## Project Structure

```
strapi/
├── config/                 # Strapi configuration
│   ├── admin.js           # Admin panel settings
│   ├── api.js             # API settings
│   ├── database.js        # Database configuration
│   ├── middlewares.js     # Middleware configuration
│   └── server.js          # Server settings
├── src/
│   └── api/
│       ├── category/      # Category Content-Type
│       │   ├── content-types/
│       │   │   └── category/
│       │   │       └── schema.json
│       │   ├── controllers/
│       │   ├── routes/
│       │   └── services/
│       └── product/       # Product Content-Type
│           ├── content-types/
│           │   └── product/
│           │       └── schema.json
│           ├── controllers/
│           ├── routes/
│           └── services/
│   └── bootstrap/
│       └── seed.js        # Initial data seeding
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Notes

- Images are stored in Strapi's media library
- Use `image` field for product images
- All products are linked to categories via relation
- Slugs are unique identifiers for products and categories
- Prices are stored as decimal numbers (in UAH)
