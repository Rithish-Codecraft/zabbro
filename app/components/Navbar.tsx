import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ShoppingBag, Search, Menu, X, ShieldCheck, Flame, Database, Cloud } from "lucide-react";
import { useCart } from "~/context/cart-context";

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "NEW DROPS", href: "/#products" },
    { label: "HOODIES", href: "/category/hoodies" },
    { label: "FOOTWEAR", href: "/category/footwear" },
    { label: "OUTERWEAR", href: "/category/outerwear" },
    { label: "CARGO", href: "/category/pants" },
    { label: "ACCESSORIES", href: "/category/accessories" },
    { label: "ADMIN", href: "/admin" },
  ];

  return (
    <>
      {/* Top Banner Announcement Ticker */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-xs py-1.5 px-4 text-center font-mono tracking-wider flex items-center justify-center gap-4 text-zinc-400">
        <span className="flex items-center gap-1.5 text-[#c8ff00]">
          <Flame className="w-3.5 h-3.5" />
          <span>DROP 04 ACTIVE</span>
        </span>
        <span className="hidden sm:inline text-zinc-600">|</span>
        <span className="hidden sm:inline">FREE WORLDWIDE SHIPPING ON ORDERS OVER $150</span>
        <span className="hidden md:inline text-zinc-600">|</span>
        <span className="hidden md:flex items-center gap-2 text-zinc-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <Database className="w-3 h-3" /> Neon Postgres
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-sky-400">
            <Cloud className="w-3 h-3" /> Cloudinary CDN
          </span>
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 glass-nav transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase italic group-hover:text-zinc-200 transition-colors">
                ZABBRO<span className="text-[#c8ff00]">.</span>
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                TECHWEAR
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs font-mono tracking-widest uppercase">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`transition-colors py-1 ${
                      isActive
                        ? "text-[#c8ff00] font-bold border-b border-[#c8ff00]"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Quick Admin Shortcut */}
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-[#c8ff00] px-2.5 py-1.5 rounded border border-zinc-800 hover:border-zinc-700 transition"
              title="Cloudinary & Neon Inventory Admin"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition flex items-center justify-center cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5 text-zinc-200" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#c8ff00] text-black text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-3 font-mono text-sm tracking-wider">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-300 hover:text-[#c8ff00] py-2 border-b border-zinc-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300"
              >
                Go to Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
