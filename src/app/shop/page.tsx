"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getProductImage, Product } from "@/lib/productService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const departments = [
  { id: "Pantry Staples", name: "Épicerie Africaine", icon: "🫘", slug: "epicerie" },
  { id: "Frozen Foods", name: "Poissons & Surgelés", icon: "🐟", slug: "surgeles" },
  { id: "Beverages", name: "Boissons", icon: "🥤", slug: "boissons" },
  { id: "Produce & Greens", name: "Légumes & Feuilles", icon: "🥬", slug: "legumes" },
  { id: "Snacks", name: "Snacks", icon: "🍿", slug: "snacks" },
  { id: "Cosmetics", name: "Cosmétiques", icon: "🧴", slug: "cosmetiques" },
  { id: "Condiments", name: "Condiments", icon: "🌶️", slug: "condiments" },
  { id: "Maison", name: "Maison", icon: "🧹", slug: "maison" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("q");

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [search, setSearch] = useState(searchQuery || "");

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
    setSelectedCategory(categoryParam);
    setSearch(searchQuery || "");
  }, [categoryParam, searchQuery]);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory || p.subcategory === selectedCategory);
    }

    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, search]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedCategory) params.set("category", selectedCategory);
    window.location.href = `/shop${params.toString() ? "?" + params.toString() : ""}`;
  };

  const currentDept = departments.find((d) => d.id === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header Banner */}
      <div className="bg-[#47b6b1] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            {currentDept ? currentDept.name : "Notre Boutique"}
          </h1>
          {selectedCategory && (
            <Link href="/shop" className="text-white/70 hover:text-white text-sm mt-2 inline-block">
              ← Retour à tous les produits
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Departments */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
              <h3 className="font-bold text-[#19212b] mb-4">Départements</h3>
              <div className="space-y-1">
                <Link
                  href="/shop"
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !selectedCategory ? "bg-[#47b6b1] text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Tous les produits
                </Link>
                {departments.map((dept) => (
                  <Link
                    key={dept.id}
                    href={`/shop/${dept.slug}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === dept.id
                        ? "bg-[#47b6b1] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{dept.icon}</span>
                    <span>{dept.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#47b6b1]"
                />
                <button type="submit" className="px-6 py-3 bg-[#47b6b1] text-white font-bold rounded-lg hover:bg-[#39918d] transition-colors">
                  Rechercher
                </button>
              </div>
            </form>

            {/* Results Count */}
            <p className="text-gray-600 mb-4">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé{filteredProducts.length !== 1 ? "s" : ""}
            </p>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
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
                        <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-[#ec7205] text-white text-xs font-bold rounded">
                          {product.promoLabel}
                        </span>
                      )}
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="font-semibold text-[#19212b] line-clamp-2">{product.name}</h3>
                    {product.size_pack && (
                      <p className="text-sm text-gray-500 mt-1">{product.size_pack}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      {product.onPromo && product.promoPrice ? (
                        <>
                          <span className="font-bold text-[#ec7205]">{product.promoPrice.toFixed(2)}$</span>
                          <span className="text-sm text-gray-400 line-through">{product.price.toFixed(2)}$</span>
                        </>
                      ) : (
                        <span className="font-bold text-[#47b6b1]">{product.price.toFixed(2)}$</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                <Link href="/shop" className="text-[#47b6b1] hover:underline mt-2 inline-block">
                  Voir tous les produits
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Chargement...</div>}>
      <ShopContent />
    </Suspense>
  );
}
