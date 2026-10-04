import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/orders";
import { requireUserId } from "~/lib/auth.server";
import { getOrdersByUser } from "~/db/index.server";
import { ShoppingBag, Package, Truck, CheckCircle2, Clock, ChevronRight, ArrowLeft } from "lucide-react";

export function meta() {
  return [
    { title: "Order History // ZABBRO™" },
    { name: "description", content: "Track all your ZABBRO orders." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const orders = await getOrdersByUser(userId);
  return { orders };
}

const statusConfig: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  processing: {
    label: "Processing",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10 border-yellow-400/20",
    icon: Clock,
  },
  shipped: {
    label: "Shipped",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
    icon: Package,
  },
};

export default function OrdersPage() {
  const { orders } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 opacity-10"
          style={{ background: "radial-gradient(circle, #c8ff00 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <Link to="/profile"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
          style={{ fontFamily: "'Times New Roman', serif" }}>
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        <div className="mb-10">
          <p className="label-luxury text-[#c8ff00] mb-2">Customer History</p>
          <h1 className="text-5xl md:text-6xl font-black text-white italic"
            style={{ fontFamily: "'Times New Roman', serif" }}>
            Order History
          </h1>
          <p className="text-zinc-400 mt-3 text-base">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-zinc-600" />
            <h2 className="text-3xl font-black text-white italic mb-3"
              style={{ fontFamily: "'Times New Roman', serif" }}>
              No orders yet.
            </h2>
            <p className="text-zinc-400 mb-8">Your purchased drops will appear here.</p>
            <Link to="/" className="btn-volt px-8 py-4 rounded-lg inline-flex items-center gap-2 text-lg">
              <ShoppingBag className="w-5 h-5" />
              Browse Drops
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order: any) => {
              const status = statusConfig[order.status] || statusConfig.processing;
              const StatusIcon = status.icon;
              const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div key={order.id} className="glass-card rounded-2xl p-6 md:p-8 shine-effect">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="label-luxury text-zinc-500 mb-1">Order Number</p>
                      <p className="text-2xl font-black text-white"
                        style={{ fontFamily: "'Times New Roman', serif" }}>
                        {order.orderNumber}
                      </p>
                      <p className="text-zinc-500 text-sm mt-1">{orderDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${status.bg} ${status.color}`}
                        style={{ fontFamily: "'Times New Roman', serif" }}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                      <p className="text-2xl font-black text-[#c8ff00]"
                        style={{ fontFamily: "'Times New Roman', serif" }}>
                        ₹{parseFloat(String(order.totalAmount)).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-6">
                    {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                      <div key={idx}
                        className="flex items-center gap-4 glass-light rounded-xl p-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&q=80"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-base line-clamp-1"
                            style={{ fontFamily: "'Times New Roman', serif" }}>
                            {item.name}
                          </p>
                          <p className="text-zinc-400 text-sm">
                            {item.size} · {item.color} · Qty {item.quantity}
                          </p>
                        </div>
                        <p className="text-white font-bold text-base flex-shrink-0"
                          style={{ fontFamily: "'Times New Roman', serif" }}>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="glass-light rounded-xl p-4">
                    <p className="label-luxury text-zinc-500 mb-2">Shipped To</p>
                    <p className="text-white font-bold" style={{ fontFamily: "'Times New Roman', serif" }}>
                      {order.customerName}
                    </p>
                    <p className="text-zinc-400 text-sm">
                      {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
                    </p>
                  </div>

                  {/* Reorder link */}
                  <div className="mt-5 flex justify-end">
                    <Link
                      to={`/order-success/${order.orderNumber}`}
                      className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-[#c8ff00] transition-colors uppercase tracking-widest"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      View Receipt <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
