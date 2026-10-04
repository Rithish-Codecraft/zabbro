import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { CartProvider } from "./context/cart-context";
import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";
import { getUser } from "./lib/auth.server";
import { getWishlistByUser } from "./db/index.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const user = await getUser(request);
    let wishlistCount = 0;
    if (user) {
      const wishlist = await getWishlistByUser(user.id);
      wishlistCount = wishlist.length;
    }
    return { user, wishlistCount };
  } catch {
    return { user: null, wishlistCount: 0 };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <style>{`
          * { font-family: 'Times New Roman', Times, serif !important; }
        `}</style>
      </head>
      <body className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 antialiased selection:bg-[#c8ff00] selection:text-black">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  const user = data?.user ?? null;
  const wishlistCount = data?.wishlistCount ?? 0;

  return (
    <CartProvider>
      <Navbar user={user} wishlistCount={wishlistCount} />
      <CartDrawer />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <Footer />
    </CartProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "System Error";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 — Not Found" : "Error";
    details =
      error.status === 404
        ? "The page or product you are looking for does not exist."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <CartProvider>
      <Navbar />
      <main className="py-24 px-4 max-w-3xl mx-auto text-center flex-1 flex flex-col items-center justify-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-red-500/30 flex items-center justify-center text-red-400 font-black text-3xl"
          style={{ background: "rgba(127,29,29,0.2)" }}>
          !
        </div>
        <h1 className="text-5xl font-black uppercase text-white mb-4 italic"
          style={{ fontFamily: "'Times New Roman', serif" }}>{message}</h1>
        <p className="text-zinc-400 text-lg mb-10" style={{ fontFamily: "'Times New Roman', serif" }}>{details}</p>
        <a
          href="/"
          className="btn-volt px-8 py-4 rounded-lg text-lg inline-block"
        >
          Return to Catalog
        </a>
        {stack && (
          <pre className="mt-8 text-left p-4 rounded-xl glass-panel text-red-300 text-xs overflow-x-auto max-w-full">
            <code>{stack}</code>
          </pre>
        )}
      </main>
      <Footer />
    </CartProvider>
  );
}
