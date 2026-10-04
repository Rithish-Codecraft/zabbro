import { useState, useEffect } from "react";
import { Link, useLocation, useFetcher } from "react-router";
import {
  ShoppingBag, Menu, X, ShieldCheck, Flame, Database, Cloud,
  Heart, User, LogOut, ChevronDown, Package
} from "lucide-react";
import { useCart } from "~/context/cart-context";

interface NavbarProps {
  user?: { id: number; name: string; email: string; role: string } | null;
  wishlistCount?: number;
}

export function Navbar({ user, wishlistCount = 0 }: NavbarProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistBadge, setWishlistBadge] = useState(wishlistCount);
  const location = useLocation();
  const fetcher = useFetcher();

  // Sync wishlist count from prop
  useEffect(() => {
    setWishlistBadge(wishlistCount);
  }, [wishlistCount]);

  const navLinks = [
    { label: "New Drops", href: "/#products" },
    { label: "Hoodies", href: "/category/hoodies" },
    { label: "Footwear", href: "/category/footwear" },
    { label: "Outerwear", href: "/category/outerwear" },
    { label: "Cargo", href: "/category/pants" },
    { label: "Accessories", href: "/category/accessories" },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-zinc-950 border-b border-zinc-900 text-xs py-2 px-4 text-center flex items-center justify-center gap-4 text-zinc-400"
        style={{ fontFamily: "'Times New Roman', serif", letterSpacing: "0.15em" }}>
        <span className="flex items-center gap-1.5" style={{ color: "#c8ff00" }}>
          <Flame className="w-3.5 h-3.5" />
          <span className="font-bold">DROP 04 ACTIVE</span>
        </span>
        <span className="hidden sm:inline text-zinc-700">|</span>
        <span className="hidden sm:inline font-bold">FREE SHIPPING ON ORDERS OVER ₹5,000</span>
        <span className="hidden md:inline text-zinc-700">|</span>
        <span className="hidden md:flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <Database className="w-3 h-3" /> Neon DB
          </span>
          <span className="text-zinc-700">·</span>
          <span className="flex items-center gap-1 text-sky-400">
            <Cloud className="w-3 h-3" /> Cloudinary CDN
          </span>
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 glass-nav transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand + Nav */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <span
                className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase italic group-hover:text-zinc-200 transition-colors"
                style={{ fontFamily: "'Times New Roman', serif" }}
              >
                ZABBRO<span style={{ color: "#c8ff00" }}>.</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7"
              style={{ fontFamily: "'Times New Roman', serif" }}>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href || location.pathname.startsWith(link.href.replace("/#products", ""));
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`font-bold text-base transition-colors py-1 border-b-2 ${
                      isActive
                        ? "text-[#c8ff00] border-[#c8ff00]"
                        : "text-zinc-300 hover:text-white border-transparent hover:border-zinc-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Admin shortcut - only for admin users or always visible */}
            {(!user || user.role === "admin") && (
              <Link
                to="/admin"
                id="admin-nav-link"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-[#c8ff00] transition uppercase tracking-widest"
                style={{ fontFamily: "'Times New Roman', serif" }}
                title="Admin Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Admin</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to={user ? "/profile" : "/auth/login"}
              id="wishlist-nav-btn"
              className="relative p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition flex items-center justify-center"
              aria-label="Wishlist"
              title="Wishlist"
              onClick={() => user && undefined}
            >
              <Heart className="w-5 h-5" />
              {wishlistBadge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse-volt">
                  {wishlistBadge > 9 ? "9+" : wishlistBadge}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              id="cart-nav-btn"
              className="relative p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition flex items-center justify-center cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
                  style={{ background: "#c8ff00", color: "#000" }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account Menu */}
            {user ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition"
                  style={{ fontFamily: "'Times New Roman', serif" }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-black text-xs font-black"
                    style={{ background: "#c8ff00" }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-bold max-w-24 truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 glass-card rounded-xl py-2 z-20"
                      style={{ fontFamily: "'Times New Roman', serif" }}>
                      <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-white font-bold truncate">{user.name}</p>
                        <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-white/5 transition text-sm font-bold"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-zinc-300 hover:text-white hover:bg-white/5 transition text-sm font-bold"
                      >
                        <Package className="w-4 h-4" />
                        Order History
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-[#c8ff00] hover:bg-[#c8ff00]/10 transition text-sm font-bold"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Admin Portal
                        </Link>
                      )}
                      <div className="border-t border-zinc-800 mt-1 pt-1">
                        <fetcher.Form method="post" action="/profile">
                          <input type="hidden" name="actionType" value="logout" />
                          <button type="submit"
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 transition text-sm font-bold text-left">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </fetcher.Form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/auth/login"
                id="signin-nav-btn"
                className="btn-volt px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel border-t border-zinc-800 px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-1" style={{ fontFamily: "'Times New Roman', serif" }}>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-200 hover:text-[#c8ff00] py-3 px-3 rounded-lg hover:bg-white/5 text-base font-bold border-b border-zinc-900 transition"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-300 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Times New Roman', serif" }}>
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-300 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Times New Roman', serif" }}>
                    <Package className="w-4 h-4" /> Order History
                  </Link>
                </>
              ) : (
                <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}
                  className="btn-volt w-full text-center py-3 rounded-lg text-base flex items-center justify-center gap-2">
                  <User className="w-4 h-4" /> Sign In / Register
                </Link>
              )}
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-sm font-bold text-zinc-400 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Times New Roman', serif" }}>
                <ShieldCheck className="w-4 h-4" /> Admin Portal
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
