# ZABBRO™ // Luxury Streetwear E-Commerce Platform

A production-ready full-stack E-Commerce platform built for high-performance apparel drops, featuring **React Router v7 / Remix**, **Neon Serverless PostgreSQL (Drizzle ORM)**, **Cloudinary CDN Image Optimization**, and optimized for **Vercel** serverless edge hosting.

![Zabbro Streetwear](https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80)

---

## ⚡ Architecture & Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React Router v7 (Remix)** | Full-stack server-side rendering, loaders, actions, and client hydration |
| **Neon PostgreSQL** | Serverless SQL database with auto-scaling connection pooling |
| **Drizzle ORM** | Type-safe SQL schema definitions, migrations, and query execution |
| **Cloudinary** | Image transformation CDN (auto WebP/AVIF, dynamic crops, direct uploads) |
| **Tailwind CSS v4** | Cyberpunk luxury dark aesthetic with glassmorphism and micro-animations |
| **Vercel** | Edge network hosting & serverless function execution |
| **GitHub** | Version control & automated CI/CD deployment pipelines |

---

## 🚀 Key Features

- **High-Impact Cyberpunk Luxury Storefront**:
  - Live Drop countdown ticker ("DROP 04 // NEO-TOKYO ACTIVE").
  - Value proposition strip (Global express, 100% Authentic NFC chip, 30-day returns).
  - Editorial Lookbook showcasing high-res streetwear photography.
- **Dynamic Catalog & Filtering**:
  - Category navigation (Hoodies, Footwear, Outerwear, Modular Cargo, Accessories).
  - Instant sorting by Newest, Price (Low-High / High-Low), and Rating.
  - Streetwear Product Cards with dual-image hover preview and quick size selector pills.
- **Product Detail Experience (`/products/:slug`)**:
  - Cloudinary-powered multi-angle image gallery with interactive thumbnail switching.
  - Size (S to XXL) and Color variant selectors.
  - Real-time stock status counter.
  - Interactive accordion for Fabric/GSM specs and Global Shipping timelines.
  - Recommended drops to complete the outfit.
- **Interactive Shopping Cart & Drawer**:
  - Slide-over cart drawer with free shipping progress threshold.
  - Quantity adjusters, subtotal calculations, and `localStorage` persistence.
- **Two-Column Express Checkout (`/checkout`)**:
  - Customer delivery details and country selector.
  - Multi-method payment protocol simulation (Card, Apple Pay, Crypto).
  - Promo code engine (`ZABBRO10` for 10% off).
  - Direct order persistence to Neon PostgreSQL with unique order reference (`ZAB-XXXXXX`).
  - Order confirmation screen (`/order-success/:orderNumber`).
- **Command Center Admin Portal (`/admin`)**:
  - Inventory tracker with stock alerts.
  - Customer orders ledger.
  - **Cloudinary Image Uploader**: Publish new technical apparel drops directly to the store with Cloudinary image upload.
  - System diagnostics for Neon and Cloudinary connectivity.

---

## 🛠️ Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/zabbro.git
cd zabbro
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and configure your credentials:

```ini
# Neon PostgreSQL Database
# Get from https://console.neon.tech
DATABASE_URL="postgresql://username:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Cloudinary CDN
# Get from https://console.cloudinary.com
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_PRESET="zabbro_uploads"

# App Host
SESSION_SECRET="zabbro-dev-secret-super-safe-key-32chars"
APP_URL="http://localhost:5173"
```

> **Note**: If `DATABASE_URL` is left empty, the application automatically runs in **Resilient Fallback Mode** with high-fidelity in-memory streetwear catalog and simulated checkout orders. Once you provide your Neon credentials, it seamlessly connects to live PostgreSQL!

### 3. Setup & Seed Neon PostgreSQL

Push the schema to your Neon database:
```bash
npm run db:push
```

Seed the database with the initial streetwear catalog:
```bash
npm run db:seed
```

To explore and edit data visually using Drizzle Studio:
```bash
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Deploying to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "feat: initial Zabbro e-commerce platform release"
git remote add origin https://github.com/YOUR_USERNAME/zabbro.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your `zabbro` GitHub repository.
3. In **Environment Variables**, add:
   - `DATABASE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `SESSION_SECRET`
4. Click **Deploy**. Vercel will automatically build and deploy your React Router serverless app globally!

---

## 📦 Project Structure

```
zabbro/
├── app/
│   ├── components/            # Reusable UI components
│   │   ├── CartDrawer.tsx     # Slide-over cart drawer & progress bar
│   │   ├── Footer.tsx         # Techwear branding & links
│   │   ├── Navbar.tsx         # Main header, ticker, and cart trigger
│   │   └── ProductCard.tsx    # Responsive streetwear item card
│   ├── context/
│   │   └── cart-context.tsx   # Persistent cart state & checkout context
│   ├── db/
│   │   ├── index.server.ts    # Neon client & resilient query functions
│   │   ├── mock-data.ts       # Streetwear seed data & fallbacks
│   │   ├── schema.ts          # Drizzle ORM PostgreSQL schema
│   │   └── seed.ts            # Neon database seeder script
│   ├── lib/
│   │   ├── cloudinary.server.ts # Cloudinary server upload & signature API
│   │   └── cloudinary.ts        # Client-side dynamic image transformer
│   ├── routes/
│   │   ├── admin.tsx          # Inventory & Order Command Center
│   │   ├── api.orders.ts      # REST API for order processing
│   │   ├── api.upload.ts      # REST API for Cloudinary uploads
│   │   ├── category.tsx       # Collection filter pages (/category/:category)
│   │   ├── checkout.tsx       # 2-column express checkout
│   │   ├── home.tsx           # Hero drop, filters, and catalog grid
│   │   ├── order-success.tsx  # Order confirmation receipt
│   │   └── product-detail.tsx # Product gallery, sizes, and specs
│   ├── app.css                # Obsidian & neon volt theme styles
│   ├── root.tsx               # Root layout & providers
│   └── routes.ts              # Route registry
├── drizzle.config.ts          # Drizzle Kit configuration
├── vercel.json                # Vercel deployment specification
└── package.json               # Dependencies & scripts
```

---

## 🔒 Security & Best Practices

- Secret keys (`DATABASE_URL`, `CLOUDINARY_API_SECRET`) are kept strictly on the server (`*.server.ts` or server actions) and never bundled into client assets.
- Images uploaded through Cloudinary are delivered over HTTPS with automated WebP/AVIF format negotiation and responsive width scaling.
- Input validation on order creation and catalog publishing endpoints.

---

© 2026 ZABBRO™ Studio. Built with React Router v7, Neon, Cloudinary, and Vercel.
