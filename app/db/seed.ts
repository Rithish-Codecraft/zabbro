import * as dotenv from "dotenv";
dotenv.config();

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from "./mock-data";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: DATABASE_URL is not set in your .env file!");
    process.exit(1);
  }

  console.log("🔌 Connecting to Neon PostgreSQL...");
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  console.log("🌱 Seeding categories into Neon...");
  for (const cat of INITIAL_CATEGORIES) {
    await db
      .insert(schema.categories)
      .values({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
      })
      .onConflictDoNothing();
  }

  console.log("👕 Seeding streetwear products into Neon...");
  for (const prod of INITIAL_PRODUCTS) {
    await db
      .insert(schema.products)
      .values({
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        category: prod.category,
        images: prod.images,
        sizes: prod.sizes,
        colors: prod.colors,
        stock: prod.stock,
        rating: prod.rating,
        reviewsCount: prod.reviewsCount,
        isFeatured: prod.isFeatured,
        tags: prod.tags,
      })
      .onConflictDoNothing();
  }

  console.log("✅ Neon Database seeded successfully with Zabbro catalog!");
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
