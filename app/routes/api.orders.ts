import type { Route } from "./+types/api.orders";
import { createOrder, getOrders } from "~/db/index.server";

export async function loader() {
  const orders = await getOrders();
  return Response.json({ orders });
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const payload = await request.json();

    if (!payload.customerName || !payload.customerEmail || !payload.items || payload.items.length === 0) {
      return Response.json({ error: "Missing required order information" }, { status: 400 });
    }

    const order = await createOrder({
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone || "",
      shippingAddress: payload.shippingAddress,
      items: payload.items,
      subtotal: payload.subtotal,
      shippingFee: payload.shippingFee,
      totalAmount: payload.totalAmount,
      paymentMethod: payload.paymentMethod || "card",
    });

    return Response.json({ success: true, order });
  } catch (error) {
    console.error("Order creation error:", error);
    return Response.json({ error: "Failed to persist order in database" }, { status: 500 });
  }
}
