import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/product-detail";
import { getProductBySlug, getProducts } from "~/db/index.server";
import { useCart } from "~/context/cart-context";
import { getOptimizedImageUrl } from "~/lib/cloudinary";
import { ProductCard } from "~/components/ProductCard";
import {
  Star,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  ArrowLeft,
  Share2,
} from "lucide-react";

export function meta({ loaderData, params }: any) {
  const name =
    loaderData?.product?.name ||
    (params?.slug ? params.slug.replace(/-/g, " ").toUpperCase() : "TECHNICAL GARMENT");
  return [
    { title: `${name} // ZABBRO™ TECHWEAR` },
    {
      name: "description",
      content:
        loaderData?.product?.description ||
        "Engineered luxury streetwear and technical silhouette.",
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug || "";
  const product = await getProductBySlug(slug);

  if (!product) {
    throw new Response("Product Not Found", { status: 404 });
  }

  const related = await getProducts({ category: product.category, limit: 3 });
  const otherDrops = related.filter((p: any) => p.slug !== product.slug);

  return { product, otherDrops };
}

export default function ProductDetailPage() {
  const { product, otherDrops } = useLoaderData<typeof loader>();
  const { addItem } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("specs");

  const images = product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80"];

  const currentMainImage = images[activeImageIndex] || images[0];
  const optimizedMainImage = getOptimizedImageUrl(currentMainImage, {
    width: 1200,
    height: 1400,
    crop: "fill",
  });

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      size: selectedSize,
      color: selectedColor,
      image: images[0],
      quantity,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(
        ((parseFloat(product.compareAtPrice) - parseFloat(product.price)) /
          parseFloat(product.compareAtPrice)) *
          100
      )
    : null;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full font-mono flex-1">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-white transition uppercase">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-zinc-300 line-clamp-1">{product.name}</span>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Product link copied to clipboard!");
          }}
          className="flex items-center gap-1 hover:text-white transition text-zinc-400 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Cloudinary Image Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] flex-shrink-0">
              {images.map((img, idx) => {
                const thumb = getOptimizedImageUrl(img, { width: 140, height: 160, crop: "fill" });
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition cursor-pointer flex-shrink-0 ${
                      activeImageIndex === idx
                        ? "border-[#c8ff00] opacity-100 shadow-[0_0_12px_rgba(200,255,0,0.3)]"
                        : "border-zinc-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={thumb} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Photo View */}
          <div className="flex-1 relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
            <img
              src={optimizedMainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.tags && product.tags[0] && (
              <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#c8ff00] text-xs font-mono font-bold px-3 py-1 rounded border border-[#c8ff00]/40 uppercase tracking-widest">
                {product.tags[0]}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Purchasing Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#c8ff00]">
                {product.category} // EDITION 04
              </span>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <Star className="w-4 h-4 fill-[#c8ff00] text-[#c8ff00]" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-zinc-500">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-black text-white">${product.price}</span>
              {product.compareAtPrice && (
                <>
                  <span className="text-base text-zinc-500 line-through">
                    ${product.compareAtPrice}
                  </span>
                  <span className="text-xs font-bold text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Color Swatches */}
            <div className="pt-4 border-t border-zinc-900 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 uppercase">Color Variant</span>
                <span className="text-white font-bold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-2 rounded text-xs transition cursor-pointer border ${
                      selectedColor === color
                        ? "border-[#c8ff00] bg-zinc-900 text-white font-bold shadow-[0_0_10px_rgba(200,255,0,0.2)]"
                        : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 uppercase">Select Size</span>
                <span className="text-zinc-400 underline cursor-pointer hover:text-white">
                  Fit Guide
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 rounded text-xs font-mono font-bold transition cursor-pointer border ${
                      selectedSize === size
                        ? "bg-[#c8ff00] text-black border-[#c8ff00]"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>In Stock — Dispatched within 24 hours from Tokyo Hub</span>
            </div>

            {/* Quantity and Add to Cart CTAs */}
            <div className="flex gap-3 pt-4">
              {/* Quantity Adjuster */}
              <div className="flex items-center border border-zinc-800 rounded-lg bg-zinc-900 px-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-zinc-400 hover:text-white text-base py-1 px-1 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-zinc-400 hover:text-white text-base py-1 px-1 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Main Add Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-mono font-bold text-xs uppercase tracking-widest transition duration-200 cursor-pointer ${
                  isAdded
                    ? "bg-emerald-500 text-black"
                    : "bg-[#c8ff00] hover:bg-[#b2e600] text-black shadow-[0_0_20px_rgba(200,255,0,0.3)]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added To Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • ${(parseFloat(product.price) * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Value Props Strip */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-zinc-900 text-center text-[10px] text-zinc-400">
            <div className="p-2 rounded bg-zinc-900/50 border border-zinc-900 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#c8ff00]" />
              <span>Free on $150+</span>
            </div>
            <div className="p-2 rounded bg-zinc-900/50 border border-zinc-900 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#c8ff00]" />
              <span>NFC Authenticated</span>
            </div>
            <div className="p-2 rounded bg-zinc-900/50 border border-zinc-900 flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-[#c8ff00]" />
              <span>30-Day Returns</span>
            </div>
          </div>

          {/* Accordion Specs */}
          <div className="border-t border-zinc-900 pt-4 space-y-2">
            {/* Tech Specs */}
            <div className="border border-zinc-900 rounded-lg overflow-hidden bg-zinc-950">
              <button
                onClick={() =>
                  setActiveAccordion(activeAccordion === "specs" ? null : "specs")
                }
                className="w-full flex items-center justify-between p-3.5 text-xs text-zinc-200 font-bold uppercase tracking-wider text-left"
              >
                <span>Fabric & Engineering Specifications</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeAccordion === "specs" ? "rotate-180 text-[#c8ff00]" : ""
                  }`}
                />
              </button>
              {activeAccordion === "specs" && (
                <div className="p-3.5 pt-0 text-xs text-zinc-400 space-y-1.5 border-t border-zinc-900/60 leading-relaxed">
                  <p>• 100% Ring-spun Heavyweight French Terry Cotton (500 GSM)</p>
                  <p>• Pre-shrunk industrial silicone wash for lifetime shape retention</p>
                  <p>• Reinforced bar-tack stitching on all stress points</p>
                  <p>• Concealed utility pocket with waterproof YKK zipper</p>
                </div>
              )}
            </div>

            {/* Shipping */}
            <div className="border border-zinc-900 rounded-lg overflow-hidden bg-zinc-950">
              <button
                onClick={() =>
                  setActiveAccordion(activeAccordion === "shipping" ? null : "shipping")
                }
                className="w-full flex items-center justify-between p-3.5 text-xs text-zinc-200 font-bold uppercase tracking-wider text-left"
              >
                <span>Global Express & Packaging</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    activeAccordion === "shipping" ? "rotate-180 text-[#c8ff00]" : ""
                  }`}
                />
              </button>
              {activeAccordion === "shipping" && (
                <div className="p-3.5 pt-0 text-xs text-zinc-400 space-y-1.5 border-t border-zinc-900/60 leading-relaxed">
                  <p>• Packaged in 100% biodegradable anti-static vacuum sealed foil</p>
                  <p>• Tracked express DHL / FedEx courier (3-5 business days)</p>
                  <p>• Duties and import taxes prepaid worldwide</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED DROPS */}
      {otherDrops.length > 0 && (
        <div className="mt-24 pt-12 border-t border-zinc-900">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs text-[#c8ff00] uppercase tracking-widest">
                RECOMMENDED
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white mt-1">
                Complete The Kit
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {otherDrops.map((item: any) => (
              <ProductCard key={item.id} product={item as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
