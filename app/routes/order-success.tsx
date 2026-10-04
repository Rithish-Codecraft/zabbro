import { Link, useParams } from "react-router";
import { CheckCircle2, PackageCheck, ArrowRight, Truck, Mail } from "lucide-react";

export function meta() {
  return [{ title: "Order Confirmed // ZABBRO™" }];
}

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();

  return (
    <div className="py-20 max-w-3xl mx-auto px-4 sm:px-6 w-full font-mono flex-1 text-center">
      {/* Glow icon */}
      <div className="w-20 h-20 mx-auto rounded-full bg-[#c8ff00]/10 border border-[#c8ff00] flex items-center justify-center text-[#c8ff00] mb-8 shadow-[0_0_30px_rgba(200,255,0,0.3)] animate-pulse">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <span className="text-xs text-[#c8ff00] uppercase tracking-widest font-bold">
        TRANSACTION CONFIRMED
      </span>
      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2 mb-4">
        Manifest Dispatched
      </h1>

      <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed mb-8">
        Your order has been recorded into our Neon PostgreSQL database and assigned to the Tokyo technical fulfillment center.
      </p>

      {/* Order info card */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-left max-w-lg mx-auto space-y-4 mb-8">
        <div className="flex justify-between items-center pb-3 border-b border-zinc-900 text-xs">
          <span className="text-zinc-500">Order Reference</span>
          <span className="text-white font-bold tracking-wider">{orderNumber}</span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-zinc-900 text-xs">
          <span className="text-zinc-500">Status</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <PackageCheck className="w-3.5 h-3.5" /> Processing in Hub
          </span>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-zinc-900 text-xs">
          <span className="text-zinc-500">Carrier Service</span>
          <span className="text-zinc-300 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#c8ff00]" /> DHL Global Express
          </span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-500">Email Confirmation</span>
          <span className="text-zinc-300 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-zinc-400" /> Sent to your inbox
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#c8ff00] hover:bg-[#b2e600] text-black font-bold text-xs uppercase tracking-widest transition shadow-[0_0_20px_rgba(200,255,0,0.25)]"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
