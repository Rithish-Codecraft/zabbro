import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { CartProvider } from "./context/cart-context";
import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100 antialiased selection:bg-[#c8ff00] selection:text-black">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </CartProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "System Error";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404 - Drop Not Found" : "Error";
    details =
      error.status === 404
        ? "The apparel or page you are looking for has been archived or does not exist."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="py-24 px-4 max-w-3xl mx-auto text-center font-mono">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xl">
        !
      </div>
      <h1 className="text-3xl font-black uppercase text-white mb-3">{message}</h1>
      <p className="text-zinc-400 text-sm mb-8">{details}</p>
      <a
        href="/"
        className="inline-flex items-center px-6 py-3 rounded bg-zinc-900 border border-zinc-700 hover:border-[#c8ff00] text-xs font-mono uppercase text-white tracking-widest transition"
      >
        Return to Catalog
      </a>
      {stack && (
        <pre className="mt-8 text-left p-4 rounded bg-zinc-950 border border-zinc-900 text-red-300 text-xs overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
