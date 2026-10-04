import { pgTable, serial, text, varchar, numeric, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  category: varchar("category", { length: 100 }).notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  stock: integer("stock").notNull().default(20),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("4.9"),
  reviewsCount: integer("reviews_count").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: text("image").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 64 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  shippingAddress: jsonb("shipping_address").$type<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>().notNull(),
  items: jsonb("items").$type<{
    productId: number;
    name: string;
    slug: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }[]>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).notNull().default("0.00"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("processing"),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull().default("card"),
  paymentStatus: varchar("payment_status", { length: 50 }).notNull().default("paid"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userName: varchar("user_name", { length: 100 }).notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  comment: text("comment").notNull(),
  verified: boolean("verified").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Review = typeof reviews.$inferSelect;
