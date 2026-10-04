import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("category/:category", "routes/category.tsx"),
  route("products/:slug", "routes/product-detail.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("order-success/:orderNumber", "routes/order-success.tsx"),
  route("admin", "routes/admin.tsx"),
  // Auth
  route("auth/login", "routes/auth.login.tsx"),
  route("auth/register", "routes/auth.register.tsx"),
  // Customer account
  route("profile", "routes/profile.tsx"),
  route("orders", "routes/orders.tsx"),
  // APIs
  route("api/upload", "routes/api.upload.ts"),
  route("api/orders", "routes/api.orders.ts"),
  route("api/wishlist", "routes/api.wishlist.ts"),
] satisfies RouteConfig;
