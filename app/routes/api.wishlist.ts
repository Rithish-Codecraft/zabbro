import type { Route } from "./+types/api.wishlist";
import { getUserId } from "~/lib/auth.server";
import { toggleWishlist, getWishlistByUser } from "~/db/index.server";

export async function action({ request }: Route.ActionArgs) {
  const userId = await getUserId(request);
  if (!userId) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const productId = parseInt(String(formData.get("productId") || "0"), 10);

  if (!productId) {
    return Response.json({ error: "Missing productId" }, { status: 400 });
  }

  try {
    const result = await toggleWishlist(userId, productId);
    const wishlist = await getWishlistByUser(userId);
    return Response.json({ ...result, count: wishlist.length });
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    return Response.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) {
    return Response.json({ items: [], count: 0 });
  }

  try {
    const wishlist = await getWishlistByUser(userId);
    return Response.json({ items: wishlist, count: wishlist.length });
  } catch {
    return Response.json({ items: [], count: 0 });
  }
}
