import { useState } from "react";
import { useLoaderData, useFetcher, Link } from "react-router";
import type { Route } from "./+types/admin";
import { getProducts, getOrders, createProduct, isDatabaseConfigured, getCategories, createCategory, deleteProduct, deleteCategory } from "~/db/index.server";
import { isCloudinaryConfigured } from "~/lib/cloudinary.server";
import { getOptimizedImageUrl } from "~/lib/cloudinary";
import {
  Package,
  ShoppingBag,
  Plus,
  Upload,
  Cloud,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  X,
  Eye,
  Check,
  Zap,
} from "lucide-react";

export function meta() {
  return [{ title: "Admin Portal // ZABBRO™" }];
}

export async function loader() {
  const [products, orders, categories] = await Promise.all([
    getProducts({ limit: 50 }),
    getOrders(),
    getCategories(),
  ]);

  return {
    products,
    orders,
    categories,
    isNeonLive: isDatabaseConfigured(),
    isCloudinaryLive: isCloudinaryConfigured,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "createProduct") {
    const name = String(formData.get("name") || "");
    const category = String(formData.get("category") || "hoodies");
    const price = String(formData.get("price") || "0.00");
    const compareAtPrice = String(formData.get("compareAtPrice") || "");
    const description = String(formData.get("description") || "");
    const stock = parseInt(String(formData.get("stock") || "15"), 10);
    const imageUrl = String(formData.get("imageUrl") || "");
    const sizes = String(formData.get("sizes") || "S,M,L,XL")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = String(formData.get("colors") || "Black Obsidian")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const created = await createProduct({
      name,
      slug: slug || "apparel-" + Date.now(),
      category,
      price,
      compareAtPrice: compareAtPrice || undefined,
      description,
      stock,
      images: imageUrl ? [imageUrl] : [],
      sizes,
      colors,
      tags: ["New Drop"],
      isFeatured: true,
    });

    return Response.json({ success: true, product: created });
  }

  if (actionType === "createCategory") {
    const name = String(formData.get("name") || "");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const description = String(formData.get("description") || "");
    const image = String(formData.get("image") || "");
    if (!name || !image) return Response.json({ error: "Name and image are required" }, { status: 400 });
    try {
      const cat = await createCategory({ name, slug, description, image });
      return Response.json({ success: true, category: cat });
    } catch (err: any) {
      return Response.json({ error: err.message || "Failed to create category" }, { status: 500 });
    }
  }

  if (actionType === "deleteProduct") {
    const id = parseInt(String(formData.get("id") || "0"), 10);
    if (id) await deleteProduct(id);
    return Response.json({ success: true });
  }

  if (actionType === "deleteCategory") {
    const id = parseInt(String(formData.get("id") || "0"), 10);
    if (id) await deleteCategory(id);
    return Response.json({ success: true });
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}

export default function AdminPortal() {
  const { products, orders, categories, isNeonLive, isCloudinaryLive } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [activeTab, setActiveTab] = useState<"products" | "categories" | "orders" | "settings">("products");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryImageUrl, setCategoryImageUrl] = useState("");
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  const [isCategoryUploading, setIsCategoryUploading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setImagePreview(base64Data);

      // Upload to Cloudinary via serverless endpoint
      setIsUploading(true);
      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Data }),
        });

        const data = await response.json();
        if (data.url) {
          setUploadedImageUrl(data.url);
        }
      } catch (err) {
        console.error("Cloudinary upload failed", err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full font-mono flex-1">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-900">
        <div>
          <Link to="/" className="text-xs text-zinc-500 hover:text-white transition flex items-center gap-1.5 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Zabbro Command Center</span>
            <span className="text-xs font-normal px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[#c8ff00]">
              ADMIN v1.0
            </span>
          </h1>
        </div>

        <button
          onClick={() => {
            setUploadedImageUrl("");
            setImagePreview("");
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c8ff00] hover:bg-[#b2e600] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(200,255,0,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Product Drop</span>
        </button>
      </div>

      {/* Cloud & Database Status Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${isNeonLive ? "bg-emerald-950/60 text-emerald-400" : "bg-yellow-950/60 text-yellow-400"}`}>
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Neon SQL Database</p>
              <h4 className="text-xs font-bold text-white uppercase">
                {isNeonLive ? "Connected (Live)" : "Local Fallback (Active)"}
              </h4>
            </div>
          </div>
          {isNeonLive ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <span title="Add DATABASE_URL to .env for live Neon cloud">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </span>
          )}
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${isCloudinaryLive ? "bg-sky-950/60 text-sky-400" : "bg-yellow-950/60 text-yellow-400"}`}>
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Cloudinary CDN</p>
              <h4 className="text-xs font-bold text-white uppercase">
                {isCloudinaryLive ? "Cloudinary Connected" : "Local Mock Uploader"}
              </h4>
            </div>
          </div>
          {isCloudinaryLive ? (
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          ) : (
            <span title="Add CLOUDINARY_* keys in .env">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </span>
          )}
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-950/60 text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Vercel Serverless Ready</p>
              <h4 className="text-xs font-bold text-white uppercase">Ready to Deploy</h4>
            </div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-900 pb-3 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
            activeTab === "products"
              ? "bg-zinc-800 text-[#c8ff00] border border-zinc-700"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
            activeTab === "orders"
              ? "bg-zinc-800 text-[#c8ff00] border border-zinc-700"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Manifest ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
            activeTab === "settings"
              ? "bg-zinc-800 text-[#c8ff00] border border-zinc-700"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Cloud Configuration Guide</span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
            activeTab === "categories"
              ? "bg-zinc-800 text-[#c8ff00] border border-zinc-700"
              : "text-zinc-400 hover:text-white"
          }`}
          id="admin-tab-categories"
        >
          <Database className="w-4 h-4" />
          <span>Categories ({(categories as any[]).length})</span>
        </button>
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === "products" && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Sizes</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-300">
                {products.map((p: any) => {
                  const img = p.images?.[0] || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80";
                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={getOptimizedImageUrl(img, { width: 80, height: 80, crop: "fill" })}
                          alt=""
                          className="w-10 h-12 object-cover rounded bg-zinc-900 border border-zinc-800"
                        />
                        <div>
                          <div className="font-bold text-white">{p.name}</div>
                          <div className="text-[10px] text-zinc-500">{p.slug}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 uppercase text-zinc-400">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-[#c8ff00]">${p.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${p.stock > 5 ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/20" : "bg-red-950/60 text-red-400 border border-red-500/20"}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">{p.sizes?.join(", ")}</td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/products/${p.slug}`}
                          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition mr-3"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                        <fetcher.Form method="post" className="inline">
                          <input type="hidden" name="actionType" value="deleteProduct" />
                          <input type="hidden" name="id" value={p.id} />
                          <button type="submit"
                            className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition"
                            onClick={(e) => { if (!confirm(`Delete "${p.name}"?`)) e.preventDefault(); }}>
                            <X className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </fetcher.Form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CATEGORIES */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white uppercase tracking-wider">
              Category Management
            </h2>
            <button
              id="add-category-btn"
              onClick={() => { setCategoryImageUrl(""); setCategoryImagePreview(""); setIsCategoryModalOpen(true); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c8ff00] hover:bg-[#b2e600] text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Category
            </button>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(categories as any[]).map((cat: any) => (
              <div key={cat.id} className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-white font-bold text-sm">{cat.name}</p>
                  {cat.slug && <p className="text-zinc-500 text-xs">{cat.slug}</p>}
                  {cat.description && <p className="text-zinc-400 text-xs mt-1 line-clamp-2">{cat.description}</p>}
                  <fetcher.Form method="post" className="mt-3">
                    <input type="hidden" name="actionType" value="deleteCategory" />
                    <input type="hidden" name="id" value={cat.id} />
                    <button type="submit"
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition font-bold uppercase tracking-wider"
                      onClick={(e) => { if (!confirm(`Delete category "${cat.name}"?`)) e.preventDefault(); }}>
                      <X className="w-3 h-3" />
                      Delete
                    </button>
                  </fetcher.Form>
                </div>
              </div>
            ))}
            {(categories as any[]).length === 0 && (
              <div className="col-span-4 text-center py-12 text-zinc-500">
                <Database className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No categories yet. Create your first one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== ADD CATEGORY MODAL ===== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCategoryModalOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">New Category</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-zinc-500 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <fetcher.Form
              method="post"
              className="space-y-4"
              onSubmit={() => setIsCategoryModalOpen(false)}
            >
              <input type="hidden" name="actionType" value="createCategory" />
              <input type="hidden" name="image" value={categoryImageUrl} />
              <div>
                <label className="block text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1.5">Category Name *</label>
                <input type="text" name="name" required placeholder="e.g. Hoodies"
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:border-[#c8ff00] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1.5">Description</label>
                <textarea name="description" rows={2} placeholder="Brief category description..."
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:border-[#c8ff00] focus:outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 font-bold uppercase tracking-wider mb-1.5">Category Image *</label>
                <label className="flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:border-[#c8ff00]/50 transition bg-zinc-900 relative overflow-hidden">
                  {categoryImagePreview ? (
                    <img src={categoryImagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : null}
                  <div className="relative z-10 text-center">
                    <Upload className="w-6 h-6 mx-auto mb-1 text-zinc-500" />
                    <span className="text-xs text-zinc-400">
                      {isCategoryUploading ? "Uploading..." : categoryImageUrl ? "Image Ready ✓" : "Click to upload"}
                    </span>
                  </div>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async () => {
                        const b64 = reader.result as string;
                        setCategoryImagePreview(b64);
                        setIsCategoryUploading(true);
                        try {
                          const res = await fetch("/api/upload", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ image: b64 }),
                          });
                          const data = await res.json();
                          if (data.url) setCategoryImageUrl(data.url);
                        } catch (err) { console.error(err); }
                        finally { setIsCategoryUploading(false); }
                      };
                      reader.readAsDataURL(file);
                    }} />
                </label>
                {categoryImageUrl && (
                  <p className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Uploaded to Cloudinary
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  disabled={!categoryImageUrl || isCategoryUploading}
                  className="flex-1 py-2.5 rounded-lg bg-[#c8ff00] hover:bg-[#b2e600] text-black font-bold text-sm uppercase tracking-wider transition disabled:opacity-40">
                  Create Category
                </button>
                <button type="button" onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-sm font-bold transition">
                  Cancel
                </button>
              </div>
            </fetcher.Form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === "orders" && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-zinc-700" />
              <p className="text-sm">No customer orders recorded yet.</p>
              <p className="text-xs">Place a test checkout to see orders flow into Neon SQL!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {orders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-zinc-900/40 transition">
                      <td className="py-3.5 px-4 font-bold text-white">{o.orderNumber}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-200">{o.customerName}</div>
                        <div className="text-[10px] text-zinc-500">{o.customerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {o.items?.length || 0} item(s)
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#c8ff00]">${o.totalAmount}</td>
                      <td className="py-3.5 px-4 uppercase text-zinc-400">{o.paymentMethod || "card"}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 uppercase font-bold">
                          {o.status || "processing"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: CLOUD CONFIG GUIDE */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>1. Neon PostgreSQL Integration</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Neon provides serverless PostgreSQL with auto-scaling and branching. Once you obtain your database connection string from the Neon Console:
            </p>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300">
              <code>DATABASE_URL="postgresql://[user]:[password]@[endpoint].us-east-2.aws.neon.tech/neondb?sslmode=require"</code>
            </div>
            <p className="text-xs text-zinc-500">
              Push your schema and seed initial data in one step:
              <br />
              <code className="text-[#c8ff00] bg-black px-2 py-1 rounded inline-block mt-1">npx drizzle-kit push</code> &nbsp;
              <code className="text-[#c8ff00] bg-black px-2 py-1 rounded inline-block mt-1">npm run db:seed</code>
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <Cloud className="w-5 h-5 text-sky-400" />
              <span>2. Cloudinary Media Storage & CDN</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cloudinary powers high-speed image uploads, automatic format conversion (WebP/AVIF), and dynamic resolution resizing. Configure in your <code className="text-white">.env</code>:
            </p>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
              <div><code>CLOUDINARY_CLOUD_NAME="your-cloud-name"</code></div>
              <div><code>CLOUDINARY_API_KEY="your-api-key"</code></div>
              <div><code>CLOUDINARY_API_SECRET="your-api-secret"</code></div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span>3. Vercel Hosting Deployment</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              To deploy Zabbro to Vercel:
            </p>
            <ol className="list-decimal list-inside text-xs text-zinc-400 space-y-2">
              <li>Push your code to a GitHub repository: <code className="text-zinc-200">git push origin main</code></li>
              <li>Import the GitHub repo into <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-[#c8ff00] underline">Vercel</a></li>
              <li>Add the environment variables (<code className="text-zinc-200">DATABASE_URL</code>, <code className="text-zinc-200">CLOUDINARY_*</code>) in Vercel Project Settings</li>
              <li>Click Deploy! Vercel automatically deploys the serverless React Router application to edge nodes worldwide.</li>
            </ol>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL WITH CLOUDINARY UPLOADER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
              <h3 className="text-base font-bold uppercase text-white tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#c8ff00]" />
                <span>Publish New Technical Garment</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <fetcher.Form
              method="post"
              onSubmit={() => setIsModalOpen(false)}
              className="space-y-4 text-xs"
            >
              <input type="hidden" name="actionType" value="createProduct" />
              <input type="hidden" name="imageUrl" value={uploadedImageUrl || imagePreview} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400">Garment Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. CYBER-V3 Tactical Windbreaker"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#c8ff00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Category</label>
                  <select
                    name="category"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#c8ff00] cursor-pointer"
                  >
                    <option value="hoodies">Hoodies & Sweats</option>
                    <option value="footwear">Footwear & Runners</option>
                    <option value="outerwear">Tactical Outerwear</option>
                    <option value="pants">Cargo & Pants</option>
                    <option value="accessories">Utility Accessories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Price ($ USD)</label>
                  <input
                    type="text"
                    name="price"
                    required
                    placeholder="145.00"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#c8ff00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Compare At Price ($ USD, optional)</label>
                  <input
                    type="text"
                    name="compareAtPrice"
                    placeholder="180.00"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#c8ff00]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Fabric & Silhouette Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Engineered with 480 GSM organic cotton, concealed pockets..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#c8ff00]"
                />
              </div>

              {/* Cloudinary Image Upload Box */}
              <div className="space-y-2 pt-2">
                <label className="text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-sky-400" />
                    Cloudinary Image Upload
                  </span>
                  {uploadedImageUrl && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Uploaded to Cloudinary
                    </span>
                  )}
                </label>

                <div className="border-2 border-dashed border-zinc-800 hover:border-[#c8ff00] rounded-xl p-4 text-center bg-zinc-900/40 relative">
                  {imagePreview ? (
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={imagePreview}
                        alt="Upload preview"
                        className="w-20 h-24 object-cover rounded-lg border border-zinc-700"
                      />
                      <div className="text-left">
                        <p className="text-white font-bold">Image Ready</p>
                        <p className="text-zinc-500 text-[10px]">
                          {isUploading ? "Uploading to Cloudinary..." : "Uploaded & Optimized"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 py-4">
                      <Upload className="w-8 h-8 mx-auto text-zinc-600" />
                      <p className="text-zinc-400">Select garment photo to upload</p>
                      <p className="text-zinc-600 text-[10px]">PNG, JPG, WebP up to 10MB</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-zinc-400">Available Sizes (comma separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    defaultValue="S, M, L, XL"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#c8ff00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Colors (comma separated)</label>
                  <input
                    type="text"
                    name="colors"
                    defaultValue="Obsidian Black, Acid Volt"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-[#c8ff00]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 rounded bg-[#c8ff00] hover:bg-[#b2e600] text-black font-bold uppercase tracking-wider transition cursor-pointer shadow-[0_0_15px_rgba(200,255,0,0.25)]"
                >
                  Publish To Catalog
                </button>
              </div>
            </fetcher.Form>
          </div>
        </div>
      )}
    </div>
  );
}
