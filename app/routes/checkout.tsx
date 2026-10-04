import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "~/context/cart-context";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  Lock,
  CheckCircle,
  Tag,
  AlertCircle,
} from "lucide-react";
import { getOptimizedImageUrl } from "~/lib/cloudinary";

export function meta() {
  return [{ title: "Secure Checkout // ZABBRO™" }];
}

export default function CheckoutPage() {
  const { items, subtotal, freeShippingThreshold, clearCart } = useCart();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "Alex Mercer",
    email: "alex.mercer@cyberpunk.io",
    phone: "+1 (555) 019-2831",
    street: "742 Evergreen Terraces, Apt 4B",
    city: "San Francisco",
    state: "CA",
    postalCode: "94107",
    country: "United States",
    paymentMethod: "card",
  });

  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (promoCode.trim().toUpperCase() === "ZABBRO10") {
      const discount = subtotal * 0.1;
      setDiscountAmount(discount);
      setPromoSuccess("10% VIP Discount Applied!");
    } else if (promoCode.trim().toUpperCase() === "FREEDROP") {
      setDiscountAmount(shippingFee);
      setPromoSuccess("Free Shipping Unlocked!");
    } else {
      setPromoError("Invalid promotional key. Try 'ZABBRO10'.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          items,
          subtotal: subtotal.toFixed(2),
          shippingFee: shippingFee.toFixed(2),
          totalAmount: finalTotal.toFixed(2),
          paymentMethod: formData.paymentMethod,
        }),
      });

      const result = await response.json();

      if (response.ok && result.order) {
        clearCart();
        navigate(`/order-success/${result.order.orderNumber}`);
      } else {
        alert(result.error || "Failed to process order.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error processing order. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-24 max-w-2xl mx-auto px-4 text-center font-mono flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black uppercase text-white mb-2">Cart Is Empty</h1>
        <p className="text-zinc-500 text-xs mb-6">Select apparel items before checking out.</p>
        <Link
          to="/"
          className="px-6 py-3 rounded bg-[#c8ff00] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#b2e600] transition"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full font-mono flex-1">
      <div className="mb-8">
        <Link to="/" className="text-xs text-zinc-500 hover:text-white transition flex items-center gap-1.5 mb-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Express Checkout
        </h1>
        <p className="text-zinc-400 text-xs mt-1 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-Bit Encrypted Secure Serverless Transaction</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form: Shipping & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer Contacts */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#c8ff00] text-black flex items-center justify-center text-xs">
                1
              </span>
              <span>Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#c8ff00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Email Address (Order Confirmation)</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#c8ff00]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Mobile Phone (Delivery SMS)</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#c8ff00]"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#c8ff00] text-black flex items-center justify-center text-xs">
                2
              </span>
              <span>Delivery Address</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400">Street Address</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#c8ff00]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#c8ff00]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">State / Province</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#c8ff00]"
                  />
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <label className="text-zinc-400">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#c8ff00]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2.5 text-white focus:outline-none focus:border-[#c8ff00] cursor-pointer"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Japan</option>
                  <option>Germany</option>
                  <option>Canada</option>
                  <option>France</option>
                  <option>Australia</option>
                  <option>India</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase text-white tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#c8ff00] text-black flex items-center justify-center text-xs">
                3
              </span>
              <span>Payment Protocol</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: "card" })}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between h-24 transition cursor-pointer ${
                  formData.paymentMethod === "card"
                    ? "border-[#c8ff00] bg-zinc-900 shadow-[0_0_12px_rgba(200,255,0,0.2)]"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#c8ff00]" />
                <span className="font-bold text-white">Credit / Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: "apple_pay" })}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between h-24 transition cursor-pointer ${
                  formData.paymentMethod === "apple_pay"
                    ? "border-[#c8ff00] bg-zinc-900 shadow-[0_0_12px_rgba(200,255,0,0.2)]"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <Lock className="w-5 h-5 text-zinc-400" />
                <span className="font-bold text-white">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: "crypto" })}
                className={`p-4 rounded-lg border text-left flex flex-col justify-between h-24 transition cursor-pointer ${
                  formData.paymentMethod === "crypto"
                    ? "border-[#c8ff00] bg-zinc-900 shadow-[0_0_12px_rgba(200,255,0,0.2)]"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <CheckCircle className="w-5 h-5 text-zinc-400" />
                <span className="font-bold text-white">Crypto / USDC</span>
              </button>
            </div>

            {/* Mock card info */}
            {formData.paymentMethod === "card" && (
              <div className="mt-4 p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400">Card Number (Sandbox Simulation)</label>
                  <input
                    type="text"
                    readOnly
                    value="•••• •••• •••• 4242"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-300 mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400">Expiry</label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-300 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400">CVC</label>
                    <input
                      type="text"
                      readOnly
                      value="888"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-300 mt-1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-6 sticky top-28">
            <h2 className="text-sm font-bold uppercase text-white tracking-wider pb-3 border-b border-zinc-900">
              Order Manifest ({items.length} {items.length === 1 ? "item" : "items"})
            </h2>

            {/* Cart Items List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.cartId} className="flex gap-3 text-xs">
                  <img
                    src={getOptimizedImageUrl(item.image, { width: 100, height: 100, crop: "fill" })}
                    alt={item.name}
                    className="w-14 h-16 object-cover rounded bg-zinc-900 border border-zinc-800 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-zinc-400">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#c8ff00]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-4 border-t border-zinc-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO KEY (e.g. ZABBRO10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white uppercase placeholder-zinc-600 focus:outline-none focus:border-[#c8ff00]"
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoSuccess && (
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {promoSuccess}
                </p>
              )}
              {promoError && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {promoError}
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-zinc-900 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Shipping Courier</span>
                <span>{shippingFee === 0 ? <strong className="text-[#c8ff00]">FREE</strong> : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="pt-3 border-t border-zinc-900 flex justify-between text-base font-bold">
                <span className="text-white">Total Amount</span>
                <span className="text-[#c8ff00]">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-lg bg-[#c8ff00] hover:bg-[#b2e600] text-black font-mono font-bold text-xs uppercase tracking-widest transition duration-200 shadow-[0_0_20px_rgba(200,255,0,0.3)] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "TRANSMITTING ORDER TO NEON..." : `AUTHORIZE PAYMENT • $${finalTotal.toFixed(2)}`}
            </button>

            <div className="text-[11px] text-zinc-500 text-center leading-relaxed">
              By placing this order you agree to Zabbro terms of delivery and express customs clearance.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
