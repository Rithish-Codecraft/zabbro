import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/category";
import { ProductCard } from "~/components/ProductCard";
import { getProducts, getCategories } from "~/db/index.server";
import { ArrowLeft } from "lucide-react";

export function meta({ params }: any) {
  const title = (params?.category || "Collection").toUpperCase();
  return [
    { title: `${title} // ZABBRO™ STREETWEAR` },
    { name: "description", content: `Browse our limited drop of ${params.category} engineered with modern techwear fabrics.` },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const categorySlug = params.category || "all";
  const [products, categories] = await Promise.all([
    getProducts({ category: categorySlug }),
    getCategories(),
  ]);

  const currentCategory = categories.find((c) => c.slug === categorySlug);

  return {
    products,
    categorySlug,
    categoryName: currentCategory?.name || categorySlug.toUpperCase(),
    categoryDescription: currentCategory?.description || "Engineered modern technical apparel.",
  };
}

export default function CategoryPage() {
  const { products, categoryName, categoryDescription } = useLoaderData<typeof loader>();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full font-mono flex-1">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link to="/" className="hover:text-white transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-zinc-300 uppercase">{categoryName}</span>
      </div>

      {/* Header */}
      <div className="pb-8 border-b border-zinc-900 mb-8">
        <span className="text-xs font-mono text-[#c8ff00] uppercase tracking-widest">
          COLLECTION
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mt-1">
          {categoryName}
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-xl">
          {categoryDescription}
        </p>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-zinc-900/30 rounded-2xl border border-zinc-900">
          <p className="text-zinc-400 text-sm">No items currently available in this drop.</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 rounded bg-zinc-800 text-xs text-white hover:bg-zinc-700 transition"
          >
            Explore Other Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      )}
    </div>
  );
}
