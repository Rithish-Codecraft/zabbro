import { Form, Link, useLoaderData, useFetcher } from "react-router";
import type { Route } from "./+types/profile";
import { requireUserId, getUser, logout } from "~/lib/auth.server";
import { getAddressesByUser, createAddress, deleteAddress, getWishlistByUser, getProducts } from "~/db/index.server";
import { redirect } from "react-router";
import { useState } from "react";
import {
  User, MapPin, Heart, LogOut, Plus, Trash2, Star, ShoppingBag, Home, ChevronRight
} from "lucide-react";

export function meta() {
  return [
    { title: "My Profile // ZABBRO™" },
    { name: "description", content: "Manage your ZABBRO profile, addresses and wishlist." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await getUser(request);

  const [addresses, wishlistItems] = await Promise.all([
    getAddressesByUser(userId),
    getWishlistByUser(userId),
  ]);

  // Fetch wishlist products
  let wishlistProducts: any[] = [];
  if (wishlistItems.length > 0) {
    const allProducts = await getProducts({ limit: 200 });
    const wishlistIds = new Set(wishlistItems.map((w) => w.productId));
    wishlistProducts = allProducts.filter((p: any) => wishlistIds.has(p.id));
  }

  return { user, addresses, wishlistProducts };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "addAddress") {
    await createAddress({
      userId,
      street: String(formData.get("street") || ""),
      city: String(formData.get("city") || ""),
      state: String(formData.get("state") || ""),
      postalCode: String(formData.get("postalCode") || ""),
      country: String(formData.get("country") || "India"),
      isDefault: formData.get("isDefault") === "on",
    });
    return { success: "Address added!" };
  }

  if (actionType === "deleteAddress") {
    const id = parseInt(String(formData.get("id") || "0"), 10);
    if (id) await deleteAddress(id);
    return { success: "Address removed." };
  }

  if (actionType === "logout") {
    return logout(request);
  }

  return null;
}

export default function ProfilePage() {
  const { user, addresses, wishlistProducts } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "wishlist">("profile");
  const [showAddressForm, setShowAddressForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #c8ff00 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-08"
          style={{ background: "radial-gradient(circle, #00f0ff 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="label-luxury text-[#c8ff00] mb-2">Member Portal</p>
            <h1 className="text-5xl md:text-6xl font-black text-white italic"
              style={{ fontFamily: "'Times New Roman', serif" }}>
              {user?.name || "My Account"}
            </h1>
            <p className="text-zinc-400 mt-2 text-base">{user?.email}</p>
          </div>
          <fetcher.Form method="post">
            <input type="hidden" name="actionType" value="logout" />
            <button
              type="submit"
              id="logout-btn"
              className="btn-glass flex items-center gap-2 mt-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </fetcher.Form>
        </div>

        {/* Tab Navigation */}
        <div className="glass-panel rounded-2xl p-2 flex gap-2 mb-8 w-fit">
          {[
            { key: "profile", label: "Profile", icon: User },
            { key: "addresses", label: "Addresses", icon: MapPin },
            { key: "wishlist", label: `Wishlist (${wishlistProducts.length})`, icon: Heart },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              id={`tab-${key}`}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                activeTab === key
                  ? "bg-[#c8ff00] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ====== PROFILE TAB ====== */}
        {activeTab === "profile" && (
          <div className="glass-card rounded-2xl p-8 md:p-10">
            <h2 className="text-3xl font-black text-white italic mb-8"
              style={{ fontFamily: "'Times New Roman', serif" }}>
              Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-light rounded-xl p-5">
                <p className="label-luxury text-zinc-500 mb-1">Full Name</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Times New Roman', serif" }}>
                  {user?.name}
                </p>
              </div>
              <div className="glass-light rounded-xl p-5">
                <p className="label-luxury text-zinc-500 mb-1">Email</p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Times New Roman', serif" }}>
                  {user?.email}
                </p>
              </div>
              <div className="glass-light rounded-xl p-5">
                <p className="label-luxury text-zinc-500 mb-1">Role</p>
                <p className="text-xl font-bold text-[#c8ff00] uppercase tracking-wider" style={{ fontFamily: "'Times New Roman', serif" }}>
                  {user?.role}
                </p>
              </div>
              <div className="glass-light rounded-xl p-5">
                <p className="label-luxury text-zinc-500 mb-1">Member Since</p>
                <p className="text-xl font-bold text-white" style={{ fontFamily: "'Times New Roman', serif" }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" }) : "—"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-4 flex-wrap">
              <Link
                to="/orders"
                id="go-orders-btn"
                className="btn-volt flex items-center gap-2 px-6 py-3 rounded-lg text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                View Order History
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="btn-glass flex items-center gap-2 px-6 py-3 rounded-lg text-base"
              >
                <Home className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* ====== ADDRESSES TAB ====== */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-white italic"
                  style={{ fontFamily: "'Times New Roman', serif" }}>
                  Saved Addresses
                </h2>
                <button
                  id="add-address-btn"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="btn-volt flex items-center gap-2 px-5 py-3 rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Address
                </button>
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <fetcher.Form method="post" className="glass-light rounded-xl p-6 mb-6"
                  onSubmit={() => setShowAddressForm(false)}>
                  <input type="hidden" name="actionType" value="addAddress" />
                  <h3 className="text-xl font-bold text-white mb-5" style={{ fontFamily: "'Times New Roman', serif" }}>
                    New Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="label-luxury text-zinc-400 block mb-1.5">Street Address</label>
                      <input type="text" name="street" required placeholder="123, MG Road, Apt 4B"
                        className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder:text-zinc-600" />
                    </div>
                    <div>
                      <label className="label-luxury text-zinc-400 block mb-1.5">City</label>
                      <input type="text" name="city" required placeholder="Bangalore"
                        className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder:text-zinc-600" />
                    </div>
                    <div>
                      <label className="label-luxury text-zinc-400 block mb-1.5">State</label>
                      <input type="text" name="state" required placeholder="Karnataka"
                        className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder:text-zinc-600" />
                    </div>
                    <div>
                      <label className="label-luxury text-zinc-400 block mb-1.5">Postal Code</label>
                      <input type="text" name="postalCode" required placeholder="560001"
                        className="glass-input w-full px-4 py-3 rounded-lg text-white placeholder:text-zinc-600" />
                    </div>
                    <div>
                      <label className="label-luxury text-zinc-400 block mb-1.5">Country</label>
                      <input type="text" name="country" defaultValue="India"
                        className="glass-input w-full px-4 py-3 rounded-lg text-white" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                      <input type="checkbox" name="isDefault" id="isDefault"
                        className="w-4 h-4 accent-[#c8ff00] rounded" />
                      <label htmlFor="isDefault" className="text-zinc-300 text-sm font-bold"
                        style={{ fontFamily: "'Times New Roman', serif" }}>
                        Set as default delivery address
                      </label>
                    </div>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <button type="submit" className="btn-volt px-6 py-3 rounded-lg text-sm">Save Address</button>
                    <button type="button" onClick={() => setShowAddressForm(false)}
                      className="btn-glass px-6 py-3 rounded-lg text-sm">Cancel</button>
                  </div>
                </fetcher.Form>
              )}

              {/* Address List */}
              {addresses.length === 0 ? (
                <div className="text-center py-12 text-zinc-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p className="text-xl font-bold" style={{ fontFamily: "'Times New Roman', serif" }}>No addresses saved yet.</p>
                  <p className="text-sm mt-2">Add a delivery address to speed up checkout.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id}
                      className={`glass-light rounded-xl p-5 relative shine-effect ${addr.isDefault ? "border border-[#c8ff00]/30" : ""}`}>
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 label-luxury text-[#c8ff00] bg-[#c8ff00]/10 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                      <MapPin className="w-5 h-5 text-zinc-500 mb-3" />
                      <p className="text-white font-bold text-lg" style={{ fontFamily: "'Times New Roman', serif" }}>
                        {addr.street}
                      </p>
                      <p className="text-zinc-400 text-sm mt-1">
                        {addr.city}, {addr.state} — {addr.postalCode}
                      </p>
                      <p className="text-zinc-500 text-sm">{addr.country}</p>
                      <fetcher.Form method="post" className="mt-4">
                        <input type="hidden" name="actionType" value="deleteAddress" />
                        <input type="hidden" name="id" value={addr.id} />
                        <button type="submit"
                          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors font-bold uppercase tracking-wider">
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </fetcher.Form>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====== WISHLIST TAB ====== */}
        {activeTab === "wishlist" && (
          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-3xl font-black text-white italic mb-8"
              style={{ fontFamily: "'Times New Roman', serif" }}>
              My Wishlist
            </h2>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <Heart className="w-14 h-14 mx-auto mb-4 opacity-30" />
                <p className="text-2xl font-bold italic" style={{ fontFamily: "'Times New Roman', serif" }}>
                  Nothing saved yet.
                </p>
                <p className="text-sm mt-2 mb-6">Add items you love to your wishlist.</p>
                <Link to="/" className="btn-volt px-8 py-3 rounded-lg inline-flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Browse Drops
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {wishlistProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="glass-light rounded-xl overflow-hidden shine-effect group block"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={Array.isArray(product.images) ? product.images[0] : product.images}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-white font-bold text-base line-clamp-1"
                        style={{ fontFamily: "'Times New Roman', serif" }}>
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3.5 h-3.5 text-[#c8ff00] fill-current" />
                        <span className="text-xs text-zinc-400">{product.rating}</span>
                      </div>
                      <p className="text-[#c8ff00] font-black text-xl mt-2"
                        style={{ fontFamily: "'Times New Roman', serif" }}>
                        ₹{parseFloat(String(product.price)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
