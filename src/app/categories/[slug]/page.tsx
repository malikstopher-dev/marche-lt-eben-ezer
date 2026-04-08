"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProducts, getProductImage, Product } from "@/lib/productService";

const departmentSlugs: Record<string, string> = {
  "Pantry Staples": "epicerie",
  "Frozen Foods": "surgeles",
  "Beverages": "boissons",
  "Produce & Greens": "legumes",
  "Snacks": "snacks",
  "Cosmetics": "cosmetiques",
  "Condiments": "condiments",
  "Maison": "maison",
};

const slugToDepartment: Record<string, string> = Object.fromEntries(
  Object.entries(departmentSlugs).map(([key, value]) => [value, key])
);

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const categoryParam = searchParams.get("category");

  const categoryId = slugToDepartment[slug] || categoryParam;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        const visibleProducts = data.filter((p: Product) => p.visible !== false);
        setProducts(visibleProducts);
      } catch {
        fetch("/products.json")
          .then((res) => res.json())
          .then((data) => {
            const visibleProducts = data.filter((p: Product) => p.visible !== false);
            setProducts(visibleProducts);
          })
          .catch(() => {});
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (p) => p.category === categoryId || p.subcategory === categoryId
    );
    setFilteredProducts(filtered);
  }, [products, categoryId]);

  const categoryName = slugToDepartment[slug] || categoryParam || "Produits";

  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-24">
      <div className="bg-[#2D5A3D] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-2">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white">Boutique</Link>
            <span>/</span>
            <span className="text-white font-medium">{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-bold text-white">{categoryName}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 mb-6">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé{filteredProducts.length !== 1 ? "s" : ""}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-2xl p-4 hover:shadow-xl transition-shadow group border border-gray-100"
              >
                <div className="aspect-square relative mb-4 bg-gray-100 rounded-xl overflow-hidden">
                  {product.onPromo && product.promoLabel && (
                    <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-[#C41E3A] text-white text-xs font-bold rounded">
                      {product.promoLabel}
                    </span>
                  )}
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-semibold text-[#1A1A1A] line-clamp-2">{product.name}</h3>
                {product.size_pack && (
                  <p className="text-sm text-gray-500 mt-1">{product.size_pack}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  {product.onPromo && product.promoPrice ? (
                    <>
                      <span className="font-bold text-[#C41E3A]">{product.promoPrice.toFixed(2)}$</span>
                      <span className="text-sm text-gray-400 line-through">{product.price.toFixed(2)}$</span>
                    </>
                  ) : (
                    <span className="font-bold text-[#2D5A3D]">{product.price.toFixed(2)}$</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Aucun produit dans cette catégorie</p>
            <Link href="/shop" className="text-[#2D5A3D] hover:underline mt-2 inline-block">
              Voir tous les produits
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-20 flex items-center justify-center">Chargement...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
