import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc, like, or, and } from "drizzle-orm";
import * as schema from "./schema";
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, type MockProduct } from "./mock-data";

// Fallback in-memory state for development prior to adding DATABASE_URL
let inMemoryProducts = [...INITIAL_PRODUCTS];
let inMemoryOrders: any[] = [];

function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL.startsWith("postgres") &&
    !process.env.DATABASE_URL.includes("username:password")
  );
}

export function getDb() {
  if (!isDatabaseConfigured()) {
    return null;
  }
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating";
  limit?: number;
}) {
  const db = getDb();

  if (db) {
    try {
      const conditions = [];

      if (options?.category && options.category !== "all") {
        conditions.push(eq(schema.products.category, options.category));
      }

      if (options?.featured) {
        conditions.push(eq(schema.products.isFeatured, true));
      }

      if (options?.search) {
        conditions.push(
          or(
            like(schema.products.name, `%${options.search}%`),
            like(schema.products.description, `%${options.search}%`)
          )
        );
      }

      let query: any = db.select().from(schema.products);

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      if (options?.sort === "price_asc") {
        query = query.orderBy(schema.products.price);
      } else if (options?.sort === "price_desc") {
        query = query.orderBy(desc(schema.products.price));
      } else if (options?.sort === "rating") {
        query = query.orderBy(desc(schema.products.rating));
      } else {
        query = query.orderBy(desc(schema.products.createdAt));
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const rows = await query;
      if (rows && rows.length > 0) {
        return rows;
      }
    } catch (err) {
      console.warn("Neon query failed or table not seeded, falling back to mock dataset:", err);
    }
  }

  // Fallback in-memory filter
  let results = [...inMemoryProducts];

  if (options?.category && options.category !== "all") {
    results = results.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  }

  if (options?.featured) {
    results = results.filter((p) => p.isFeatured);
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (options?.sort === "price_asc") {
    results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (options?.sort === "price_desc") {
    results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (options?.sort === "rating") {
    results.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else {
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  if (options?.limit) {
    results = results.slice(0, options.limit);
  }

  return results;
}

export async function getProductBySlug(slug: string) {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.slug, slug))
        .limit(1);
      if (rows.length > 0) return rows[0];
    } catch (err) {
      console.warn("Neon getProductBySlug failed:", err);
    }
  }

  return inMemoryProducts.find((p) => p.slug === slug) || null;
}

export async function createProduct(newProduct: {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  tags?: string[];
  isFeatured?: boolean;
}) {
  const db = getDb();
  if (db) {
    try {
      const inserted = await db
        .insert(schema.products)
        .values({
          name: newProduct.name,
          slug: newProduct.slug,
          description: newProduct.description,
          price: newProduct.price,
          compareAtPrice: newProduct.compareAtPrice,
          category: newProduct.category,
          images: newProduct.images,
          sizes: newProduct.sizes,
          colors: newProduct.colors,
          stock: newProduct.stock,
          tags: newProduct.tags || [],
          isFeatured: newProduct.isFeatured ?? false,
          rating: "5.0",
          reviewsCount: 1,
        })
        .returning();
      return inserted[0];
    } catch (err) {
      console.error("Neon createProduct error:", err);
    }
  }

  // In-memory fallback
  const mockCreated: MockProduct = {
    id: inMemoryProducts.length + 1,
    name: newProduct.name,
    slug: newProduct.slug,
    description: newProduct.description,
    price: newProduct.price,
    compareAtPrice: newProduct.compareAtPrice,
    category: newProduct.category,
    images: newProduct.images.length > 0 ? newProduct.images : ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"],
    sizes: newProduct.sizes.length > 0 ? newProduct.sizes : ["S", "M", "L", "XL"],
    colors: newProduct.colors.length > 0 ? newProduct.colors : ["Standard Black"],
    stock: newProduct.stock,
    rating: "5.0",
    reviewsCount: 1,
    isFeatured: newProduct.isFeatured ?? false,
    tags: newProduct.tags || ["New Drop"],
    createdAt: new Date(),
  };

  inMemoryProducts.unshift(mockCreated);
  return mockCreated;
}

export async function createOrder(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: number;
    name: string;
    slug: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  subtotal: string;
  shippingFee: string;
  totalAmount: string;
  paymentMethod?: string;
}) {
  const orderNumber = "ZAB-" + Math.floor(100000 + Math.random() * 900000);
  const db = getDb();

  if (db) {
    try {
      const inserted = await db
        .insert(schema.orders)
        .values({
          orderNumber,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          customerPhone: orderData.customerPhone || "",
          shippingAddress: orderData.shippingAddress,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shippingFee: orderData.shippingFee,
          totalAmount: orderData.totalAmount,
          paymentMethod: orderData.paymentMethod || "card",
          paymentStatus: "paid",
          status: "processing",
        })
        .returning();
      return inserted[0];
    } catch (err) {
      console.error("Neon createOrder error:", err);
    }
  }

  // In-memory fallback
  const mockOrder = {
    id: inMemoryOrders.length + 1,
    orderNumber,
    ...orderData,
    paymentMethod: orderData.paymentMethod || "card",
    paymentStatus: "paid",
    status: "processing",
    createdAt: new Date(),
  };

  inMemoryOrders.unshift(mockOrder);
  return mockOrder;
}

export async function getOrders() {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
      return rows;
    } catch (err) {
      console.warn("Neon getOrders error:", err);
    }
  }
  return inMemoryOrders;
}

export async function getCategories() {
  return INITIAL_CATEGORIES;
}

export { isDatabaseConfigured };
