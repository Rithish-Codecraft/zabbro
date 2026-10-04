import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("category/:category", "routes/category.tsx"),
  route("products/:slug", "routes/product-detail.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("order-success/:orderNumber", "routes/order-success.tsx"),
  route("admin", "routes/admin.tsx"),
  route("api/upload", "routes/api.upload.ts"),
  route("api/orders", "routes/api.orders.ts"),
] satisfies RouteConfig;
