"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/productService";

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  size_pack?: string;
  image: string;
  price: number;
  price_status?: string;
  price_needs_review?: boolean;
  description?: string;
  onPromo?: boolean;
  promoPrice?: number | null;
  promoLabel?: string | null;
  promoStartDate?: string | null;
  promoEndDate?: string | null;
  outOfStock?: boolean;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        fetch("/products.json")
          .then((res) => res.json())
          .then((data) => {
            setProducts(data);
          })
          .catch(() => {});
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) setSelectedCategory(category);
    const searchParam = searchParams.get("search");
    if (searchParam) setSearch(searchParam);
  }, [searchParams]);

  const categoriesWithProducts = [...new Set(products.map(p => p.category))];
  const subcategoriesWithProducts: string[] = selectedCategory === "Tous" 
    ? [...new Set(products.map(p => p.subcategory).filter((s): s is string => Boolean(s)))]
    : [...new Set(products.filter(p => p.category === selectedCategory).map(p => p.subcategory).filter((s): s is string => Boolean(s)))];

  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchLower) || 
      (product.description?.toLowerCase().includes(searchLower) ?? false) ||
      (product.brand?.toLowerCase().includes(searchLower) ?? false);
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === "Tous" || product.subcategory === selectedSubcategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
  });

  const categoryTitles: Record<string, string> = {
    "Frozen Foods": "Poissons & Surgelés",
    "Pantry Staples": "Épicerie Africaine",
    "Produce & Greens": "Légumes & Feuilles",
    "Beverages": "Boissons",
    "Snacks": "Snacks",
    "Cosmetics": "Cosmétiques",
    "Condiments": "Condiments",
    "Canned Goods": "Conserves"
  };

  const subcategoryMap: Record<string, string> = {
    "Frozen Fish & Seafood": "Poisson Surgelé",
    "Frozen Meat": "Viande Surgelée",
    "Flour & Meal": "Farines",
    "Cassava Flour / Gari": "Gari & Manioc",
    "Seeds & Nuts": "Graines & Noix",
    "Dried Seafood": "Fruits de Mer Séchés",
    "Oils & Fats": "Huiles & Graisses",
    "Rice": "Riz",
    "Beans & Legumes": "Haricots & Légumineuses",
    "Coconut Products": "Produits Coco",
    "Nut Butters": "Pâtes d'Arachides",
    "Dried Vegetables": "Légumes Séchés",
    "Cassava Products": "Produits Manioc",
    "Tubers": "Tubercules",
    "Leafy Greens": "Feuilles",
    "Fruit Drink": "Boissons Fruits",
    "Herbal / Hibiscus Drink": "Tisanes",
    "Malt Drink": "Boisson au Malt",
    "Juice": "Jus",
    "Soft Drink": "Sodas",
    "Chocolate Drink": "Boissons Chocolat",
    "Chips & Crisps": "Chips",
    "Nuts & Seeds": "Noix & Graines",
    "Cookies": "Biscuits",
    "Body Care": "Soins Corps",
    "Soaps": "Savons",
    "Oils": "Huiles",
    "Hot Sauce": "Sauces Épicées",
    "Seasonings": "Assaisonnements",
    "Spice Blends": "Mélanges d'Épices",
    "Spices": "Épices",
    "Herbs": "Herbes",
    "Canned Fish": "Poisson en Conserve",
    "Canned Vegetables": "Légumes en Conserve",
    "Palm Products": "Produits Palme"
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Catégories</h3>
        <div className="space-y-1">
          <button 
            onClick={() => { setSelectedCategory("Tous"); setSelectedSubcategory("Tous"); }} 
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              selectedCategory === "Tous" 
                ? "bg-[#C41E3A] text-white font-medium" 
                : "text-[#6B6B6B] hover:bg-[#F5F2ED] hover:text-[#1A1A1A]"
            }`}
          >
            Tous les produits
          </button>
          {categoriesWithProducts.map((cat) => (
            <button 
              key={cat} 
              onClick={() => { setSelectedCategory(cat); setSelectedSubcategory("Tous"); }} 
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedCategory === cat 
                  ? "bg-[#C41E3A] text-white font-medium" 
                  : "text-[#6B6B6B] hover:bg-[#F5F2ED] hover:text-[#1A1A1A]"
              }`}
            >
              {categoryTitles[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory !== "Tous" && subcategoriesWithProducts.length > 0 && (
        <div>
          <h3 className="font-semibold text-[#1A1A1A] mb-3">Sous-catégories</h3>
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedSubcategory("Tous")} 
              className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                selectedSubcategory === "Tous" 
                  ? "bg-[#C41E3A]/10 text-[#C41E3A] font-medium" 
                  : "text-[#6B6B6B] hover:bg-[#F5F2ED]"
              }`}
            >
              Toutes
            </button>
            {subcategoriesWithProducts.map((sub) => (
              <button 
                key={sub} 
                onClick={() => setSelectedSubcategory(sub)} 
                className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                  selectedSubcategory === sub 
                    ? "bg-[#C41E3A]/10 text-[#C41E3A] font-medium" 
                    : "text-[#6B6B6B] hover:bg-[#F5F2ED]"
                }`}
              >
                {subcategoryMap[sub] || sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-[#1A1A1A] mb-3">Prix</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={priceRange[0]} 
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full px-3 py-2 bg-[#F5F2ED] border border-[#E8E4DD] rounded-lg text-sm"
              placeholder="Min"
            />
            <span className="text-[#6B6B6B]">-</span>
            <input 
              type="number" 
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full px-3 py-2 bg-[#F5F2ED] border border-[#E8E4DD] rounded-lg text-sm"
              placeholder="Max"
            />
          </div>
          <input 
            type="range" 
            min="0" 
            max="200" 
            value={priceRange[1]} 
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-[#C41E3A]"
          />
        </div>
      </div>

      {(selectedCategory !== "Tous" || selectedSubcategory !== "Tous" || priceRange[0] > 0 || priceRange[1] < 200) && (
        <button 
          onClick={() => { setSelectedCategory("Tous"); setSelectedSubcategory("Tous"); setPriceRange([0, 200]); setSearch(""); }}
          className="w-full px-4 py-2.5 bg-[#F5F2ED] text-[#1A1A1A] rounded-lg hover:bg-[#E8E4DD] transition-all text-sm font-medium"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
            Notre <span className="text-[#C41E3A]">Boutique</span>
          </h1>
          <p className="text-[#6B6B6B]">
            {filteredProducts.length} produits disponibles
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-xl">
            <input 
              type="text" 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Rechercher un produit..." 
              className="w-full px-6 py-3 pl-12 bg-[#F5F2ED] border-0 rounded-full text-[#1A1A1A] placeholder-[#A3A3A3] focus:ring-2 focus:ring-[#C41E3A]" 
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F2ED] rounded-lg font-medium text-[#1A1A1A]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtres
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-[#F5F2ED] rounded-2xl p-6 sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileFiltersOpen(false)}>
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#1A1A1A]">Filtres</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-[#E8E4DD]" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-[#E8E4DD] rounded w-1/3" />
                      <div className="h-5 bg-[#E8E4DD] rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-[#F5F2ED] rounded-2xl">
                <svg className="w-16 h-16 mx-auto text-[#A3A3A3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-[#6B6B6B] text-lg">Aucun produit trouvé</p>
                <p className="text-[#A3A3A3] text-sm mt-2">Essayez avec d'autres filtres</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-24 flex items-center justify-center"><span className="text-[#C41E3A]">Chargement...</span></div>}>
      <ShopContent />
    </Suspense>
  );
}
