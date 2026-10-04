import { Link } from "react-router";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "~/context/cart-context";
import { getOptimizedImageUrl } from "~/lib/cloudinary";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
  } = useCart();

  if (!isCartOpen) return null;

  const difference = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c8ff00]" />
              <h2 className="text-base font-mono font-bold uppercase tracking-wider text-white">
                Your Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-zinc-900/60 p-4 border-b border-zinc-800">
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-4 h-4 text-[#c8ff00]" />
                {difference <= 0 ? (
                  <span className="text-[#c8ff00] font-bold">You qualify for FREE worldwide shipping!</span>
                ) : (
                  <span>Add <strong className="text-white">${difference.toFixed(2)}</strong> more for free shipping</span>
                )}
              </span>
              <span className="text-zinc-500">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#c8ff00] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-medium text-zinc-300">Your bag is currently empty</p>
                  <p className="text-xs text-zinc-500 mt-1">Discover latest drops and limited technical apparel.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded bg-zinc-900 border border-zinc-700 hover:border-[#c8ff00] text-xs font-mono uppercase tracking-wider text-white transition"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              items.map((item) => {
                const optimizedImg = getOptimizedImageUrl(item.image, { width: 160, height: 160, crop: "fill" });
                return (
                  <div
                    key={item.cartId}
                    className="flex gap-4 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 group"
                  >
                    <img
                      src={optimizedImg}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded bg-zinc-900 border border-zinc-800 flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link
                            to={`/products/${item.slug}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs font-semibold text-zinc-100 hover:text-[#c8ff00] transition line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.cartId)}
                            className="text-zinc-500 hover:text-red-400 transition p-0.5 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] font-mono text-zinc-400 mt-1">
                          Size: <span className="text-zinc-200">{item.size}</span> | Color: <span className="text-zinc-200">{item.color}</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-zinc-700 rounded bg-zinc-950">
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                            className="px-2 py-1 text-zinc-400 hover:text-white transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                            className="px-2 py-1 text-zinc-400 hover:text-white transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right font-mono text-xs font-bold text-[#c8ff00]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-800 bg-zinc-950 space-y-4">
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span>{difference <= 0 ? <strong className="text-[#c8ff00]">FREE</strong> : "$15.00"}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#c8ff00] hover:bg-[#b2e600] text-black font-mono font-bold text-xs uppercase tracking-widest rounded transition duration-200 shadow-[0_0_20px_rgba(200,255,0,0.25)]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs font-mono text-zinc-500 hover:text-zinc-300 transition"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
