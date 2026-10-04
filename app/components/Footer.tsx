import { Link } from "react-router";
import { ArrowUpRight, Cloud, Database, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-16 pb-12 text-zinc-400 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                ZABBRO<span className="text-[#c8ff00]">.</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Engineered luxury techwear and modern streetwear silhouettes. Heavyweight fabrics, modular utility systems, and limited-run drops.
            </p>

            {/* Architecture Stack Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-sky-400">
                <Cloud className="w-3.5 h-3.5" />
                Cloudinary CDN
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
                <Database className="w-3.5 h-3.5" />
                Neon Postgres
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-purple-400">
                <Shield className="w-3.5 h-3.5" />
                Vercel Hosting
              </span>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
              Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/#products" className="hover:text-white transition">
                  Drop 04 // Neo-Tokyo
                </Link>
              </li>
              <li>
                <Link to="/category/hoodies" className="hover:text-white transition">
                  French Terry Hoodies
                </Link>
              </li>
              <li>
                <Link to="/category/footwear" className="hover:text-white transition">
                  Exoskeleton Runners
                </Link>
              </li>
              <li>
                <Link to="/category/outerwear" className="hover:text-white transition">
                  Tactical Outerwear
                </Link>
              </li>
              <li>
                <Link to="/category/pants" className="hover:text-white transition">
                  Modular Cargo Pants
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
              Platform & Orders
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/admin" className="hover:text-[#c8ff00] transition flex items-center gap-1">
                  Admin Dashboard <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <span className="text-zinc-500">Shipping Policy (Worldwide)</span>
              </li>
              <li>
                <span className="text-zinc-500">Authenticity Guarantee</span>
              </li>
              <li>
                <span className="text-zinc-500">Size & Fit Architecture</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Drops */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
              VIP Drop Alerts
            </h4>
            <p className="text-xs text-zinc-400">
              Receive secret SMS and email keys 30 minutes before public releases.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("VIP notification subscription confirmed."); }} className="flex gap-2">
              <input
                type="email"
                placeholder="YOUR_EMAIL_ADDRESS"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#c8ff00]"
              />
              <button
                type="submit"
                className="bg-[#c8ff00] text-black font-bold px-3 py-2 rounded text-xs hover:bg-[#b2e600] transition"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 ZABBRO™ STUDIO. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-zinc-400 transition cursor-pointer">PRIVACY</span>
            <span className="hover:text-zinc-400 transition cursor-pointer">TERMS</span>
            <span className="hover:text-zinc-400 transition cursor-pointer">SECURITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
