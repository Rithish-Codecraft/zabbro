import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { ProductCard } from "~/components/ProductCard";
import { getProducts, getCategories, isDatabaseConfigured } from "~/db/index.server";
import {
  Flame,
  ArrowRight,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  Layers,
  Database,
  Cloud,
} from "lucide-react";

export function meta() {
  return [
    { title: "ZABBRO™ // Engineered Luxury Streetwear & Techwear" },
    {
      name: "description",
      content:
        "Limited edition luxury techwear, heavyweight French Terry hoodies, modular cargo pants, and futuristic runners. Powered by Neon Postgres & Cloudinary CDN.",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "all";
  const sort = (url.searchParams.get("sort") || "newest") as any;
  const search = url.searchParams.get("q") || undefined;

  const [products, categories] = await Promise.all([
    getProducts({
      category: category === "all" ? undefined : category,
      sort,
      search,
    }),
    getCategories(),
  ]);

  return {
    products,
    categories,
    activeCategory: category,
    activeSort: sort,
    dbConnected: isDatabaseConfigured(),
  };
}

export default function Home() {
  const { products, categories, activeCategory, activeSort, dbConnected } = useLoaderData<typeof loader>();
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);
  const [sortBy, setSortBy] = useState(activeSort);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden border-b border-zinc-900 bg-zinc-950">
        {/* Cyberpunk background grid & glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(200,255,0,0.12),transparent_70%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10 flex flex-col items-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 mb-6 font-mono text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-ping" />
            <span className="text-[#c8ff00] font-bold">DROP 04 ACTIVE</span>
            <span className="text-zinc-500">•</span>
            <span>NEO-TOKYO CYBERNETIC LINE</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-white mb-6 leading-none max-w-4xl">
            ENGINEERED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-[#c8ff00]">
              STREETWEAR
            </span>
          </h1>

          <p className="max-w-2xl text-zinc-400 text-sm sm:text-base font-mono mb-10 leading-relaxed">
            Constructed with 500 GSM French Terry, waterproof GORE membranes, and modular Fidlock utility architecture. Strict limit of 200 pairs per release.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
            <a
              href="#products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c8ff00] hover:bg-[#b2e600] text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg transition duration-200 shadow-[0_0_25px_rgba(200,255,0,0.3)] cursor-pointer"
            >
              <span>Explore Drop 04</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/category/outerwear"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs uppercase tracking-widest rounded-lg border border-zinc-800 hover:border-zinc-700 transition"
            >
              <span>View Techwear</span>
            </Link>
          </div>

          {/* System Status Ticker */}
          <div className="mt-14 pt-6 border-t border-zinc-900/80 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Neon SQL: {dbConnected ? "Connected (Live)" : "Local Fallback Ready"}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-sky-400" />
              <span>Cloudinary CDN: Dynamic WebP/AVIF</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span>Vercel Edge Ready</span>
            </span>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION STRIP */}
      <section className="border-b border-zinc-900 bg-zinc-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left font-mono">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#c8ff00] flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">Global Express</h4>
                <p className="text-[11px] text-zinc-500">Free courier on $150+</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#c8ff00] flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">100% Authentic</h4>
                <p className="text-[11px] text-zinc-500">NFC chipped garments</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#c8ff00] flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">Heavyweight Tech</h4>
                <p className="text-[11px] text-zinc-500">500 GSM French Terry</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#c8ff00] flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">30-Day Returns</h4>
                <p className="text-[11px] text-zinc-500">Hassle-free guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY EXPLORER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-mono text-[#c8ff00] uppercase tracking-widest">
              COLLECTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
              Select Your Armor
            </h2>
          </div>
          <Link
            to="/#products"
            className="text-xs font-mono text-zinc-400 hover:text-white transition flex items-center gap-1"
          >
            All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group relative h-48 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition duration-300 flex flex-col justify-end p-4"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-white uppercase tracking-tight group-hover:text-[#c8ff00] transition">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">View Drop →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUCTS & CATALOG GRID */}
      <section id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Filters and sorting bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-zinc-900">
          <div>
            <span className="text-xs font-mono text-[#c8ff00] uppercase tracking-widest">
              LATEST DROP
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
              All Garments & Footwear
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded transition ${
                  selectedCategory === "all"
                    ? "bg-[#c8ff00] text-black font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/?category=${c.slug}`}
                  className={`px-3 py-1.5 rounded transition capitalize ${
                    selectedCategory === c.slug
                      ? "bg-[#c8ff00] text-black font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {c.slug}
                </Link>
              ))}
            </div>

            {/* Sort selector */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const searchParams = new URLSearchParams(window.location.search);
                  searchParams.set("sort", e.target.value);
                  window.location.search = searchParams.toString();
                }}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#c8ff00] cursor-pointer"
              >
                <option value="newest">Sort: Newest Drop</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="pt-8">
          {products.length === 0 ? (
            <div className="text-center py-20 font-mono space-y-4 bg-zinc-900/30 rounded-2xl border border-zinc-900">
              <p className="text-zinc-400 text-sm">No garments found in this category.</p>
              <Link
                to="/"
                className="inline-block px-4 py-2 rounded bg-zinc-800 text-xs text-white hover:bg-zinc-700 transition"
              >
                Reset Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EDITORIAL LOOKBOOK BANNER */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[16/9] md:aspect-[21/9]">
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1800&q=80"
              alt="Zabbro Cyberpunk Lookbook"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center p-8 sm:p-14 max-w-xl font-mono">
              <span className="text-[#c8ff00] text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                LOOKBOOK // VOLUME 04
              </span>
              <h3 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight mb-4">
                THE SHADOWS OF NEO-TOKYO
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Shot on 35mm film across the underground corridors of Shinjuku. Weather-sealed construction meet tactical asymmetry.
              </p>
              <div>
                <Link
                  to="/category/outerwear"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-[#c8ff00] transition"
                >
                  <span>Explore Technical Coats</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
