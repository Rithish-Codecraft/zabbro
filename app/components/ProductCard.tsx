import { useState } from "react";
import { Link } from "react-router";
import { Star, ShoppingBag, Check } from "lucide-react";
import { useCart } from "~/context/cart-context";
import { getOptimizedImageUrl } from "~/lib/cloudinary";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: string;
    compareAtPrice?: string | null;
    category: string;
    images: string[];
    sizes: string[];
    colors: string[];
    rating: string;
    reviewsCount: number;
    tags?: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage = product.images[0] || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80";
  const hoverImage = product.images[1] || primaryImage;

  const currentDisplayImage = isHovered ? hoverImage : primaryImage;
  const optimizedUrl = getOptimizedImageUrl(currentDisplayImage, { width: 700, height: 850, crop: "fill" });

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.price),
      size: selectedSize,
      color: product.colors[0] || "Standard",
      image: primaryImage,
      quantity: 1,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const discountPercent = product.compareAtPrice
    ? Math.round(
        ((parseFloat(product.compareAtPrice) - parseFloat(product.price)) /
          parseFloat(product.compareAtPrice)) *
          100
      )
    : null;

  return (
    <div
      className="group flex flex-col bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <Link to={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-zinc-900 block">
        <img
          src={optimizedUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tags && product.tags[0] && (
            <span className="bg-black/80 backdrop-blur-md text-[#c8ff00] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#c8ff00]/40 uppercase tracking-wider">
              {product.tags[0]}
            </span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="bg-red-950/80 backdrop-blur-md text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-red-500/40">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick Size Select Overlay on Hover */}
        <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2 p-2 rounded-lg bg-black/80 backdrop-blur-md border border-zinc-700">
          <div className="flex gap-1 overflow-x-auto py-0.5">
            {product.sizes.slice(0, 4).map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`text-[10px] font-mono px-2 py-1 rounded transition cursor-pointer ${
                  selectedSize === size
                    ? "bg-[#c8ff00] text-black font-bold"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={justAdded}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-mono font-bold uppercase transition cursor-pointer flex-shrink-0 ${
              justAdded
                ? "bg-emerald-500 text-black"
                : "bg-zinc-100 hover:bg-[#c8ff00] text-black"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-zinc-400">
              <Star className="w-3 h-3 fill-[#c8ff00] text-[#c8ff00]" />
              <span>{product.rating}</span>
            </div>
          </div>

          <Link
            to={`/products/${product.slug}`}
            className="text-sm font-semibold text-zinc-100 group-hover:text-[#c8ff00] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-zinc-900 font-mono">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-white">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-zinc-500 line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>
          <span className="text-[10px] text-zinc-500 uppercase">
            {product.colors[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
