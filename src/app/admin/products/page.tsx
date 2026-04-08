"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { adminService, Product, Category, PLACEHOLDER_IMAGE } from "../lib/adminService";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [filterPromo, setFilterPromo] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const filter = searchParams.get("filter");
    if (filter === "missing-price") setFilterPrice("missing");
    if (filter === "hidden") setFilterVisibility("hidden");
    if (filter === "featured") setFilterFeatured("yes");
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      const [productsData, categoriesData] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = search === "" || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
      const matchesVisibility = filterVisibility === "all" || 
        (filterVisibility === "visible" && p.visible !== false) || 
        (filterVisibility === "hidden" && p.visible === false);
      const matchesFeatured = filterFeatured === "all" || 
        (filterFeatured === "yes" && p.featured) || 
        (filterFeatured === "no" && !p.featured);
      const matchesPromo = filterPromo === "all" || 
        (filterPromo === "yes" && p.onPromo) || 
        (filterPromo === "no" && !p.onPromo);
      const matchesPrice = filterPrice === "all" || 
        (filterPrice === "has" && p.price && p.price > 0) || 
        (filterPrice === "missing" && (!p.price || p.price === 0));
      return matchesSearch && matchesCategory && matchesVisibility && matchesFeatured && matchesPromo && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      return b.id - a.id;
    });

  const handleToggleVisible = async (product: Product) => {
    const updated = await adminService.updateProduct(product.id, { visible: product.visible === false ? true : false });
    if (updated) {
      setProducts(products.map(p => p.id === product.id ? updated : p));
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const updated = await adminService.updateProduct(product.id, { featured: !product.featured });
    if (updated) {
      setProducts(products.map(p => p.id === product.id ? updated : p));
    }
  };

  const handleTogglePromo = async (product: Product) => {
    const updated = await adminService.updateProduct(product.id, { onPromo: !product.onPromo });
    if (updated) {
      setProducts(products.map(p => p.id === product.id ? updated : p));
    }
  };

  const handleToggleOutOfStock = async (product: Product) => {
    const updated = await adminService.updateProduct(product.id, { outOfStock: !product.outOfStock });
    if (updated) {
      setProducts(products.map(p => p.id === product.id ? updated : p));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) return;
    const deleted = await adminService.deleteProduct(id);
    if (deleted) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e0e6ed] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[#e0e6ed] rounded w-full"></div>
          <div className="h-64 bg-[#e0e6ed] rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#19212b]">Produits</h1>
          <p className="text-[#6c7a89]">{filteredProducts.length} produits</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#47b6b1] text-white font-medium rounded-xl hover:bg-[#39918d] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau Produit
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#e0e6ed] overflow-hidden">
        <div className="p-4 border-b border-[#e0e6ed] space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] placeholder-[#A3A3A3] focus:ring-2 focus:ring-[#47b6b1] focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
            >
              <option value="all">Toutes catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
            >
              <option value="all">Tous visibilité</option>
              <option value="visible">Visible</option>
              <option value="hidden">Masqué</option>
            </select>
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value)}
              className="px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
            >
              <option value="all">Tous</option>
              <option value="yes">Vedette</option>
              <option value="no">Non vedette</option>
            </select>
            <select
              value={filterPromo}
              onChange={(e) => setFilterPromo(e.target.value)}
              className="px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#B8962E]"
            >
              <option value="all">Promo</option>
              <option value="yes">En promo</option>
              <option value="no">Non promo</option>
            </select>
            <select
              value={filterPrice}
              onChange={(e) => setFilterPrice(e.target.value)}
              className="px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
            >
              <option value="all">Tous prix</option>
              <option value="has">Avec prix</option>
              <option value="missing">Prix manquant</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
            >
              <option value="newest">Plus récent</option>
              <option value="name">Nom A-Z</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f5f7fa]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#19212b]">Image</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#19212b]">Produit</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#19212b]">Catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#19212b]">Prix</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#19212b]">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[#19212b]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e6ed]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#6c7a89]">
                    Aucun produit trouvé
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#f5f7fa] transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-[#f5f7fa] rounded-lg overflow-hidden">
                        <img 
                          src={product.image || PLACEHOLDER_IMAGE} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/edit?id=${product.id}`} className="font-medium text-[#19212b] hover:text-[#47b6b1]">
                        {product.name}
                      </Link>
                      {product.sku && <p className="text-xs text-[#6c7a89]">{product.sku}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#6c7a89]">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-[#19212b]">
                        {product.price ? `${product.price.toFixed(2)} $` : <span className="text-[#6c7a89]">-</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.visible === false && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">Hidden</span>
                        )}
                        {product.featured && (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-md">Featured</span>
                        )}
                        {product.onPromo && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-md">Promo</span>
                        )}
                        {product.outOfStock && (
                          <span className="px-2 py-1 bg-gray-800 text-white text-xs font-medium rounded-md">Out of Stock</span>
                        )}
                        {(!product.price || product.price === 0) && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-md">No Price</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVisible(product)}
                          className={`p-2 rounded-lg transition-colors ${product.visible === false ? 'text-[#6c7a89] hover:bg-[#f5f7fa]' : 'text-[#47b6b1] hover:bg-[#47b6b1]/10'}`}
                          title={product.visible === false ? "Rendre visible" : "Masquer"}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {product.visible === false ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            )}
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(product)}
                          className={`p-2 rounded-lg transition-colors ${product.featured ? 'text-[#B8962E]' : 'text-[#6c7a89] hover:bg-[#f5f7fa]'}`}
                          title={product.featured ? "Retirer des vedette" : "Mettre en vedette"}
                        >
                          <svg className="w-5 h-5" fill={product.featured ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleTogglePromo(product)}
                          className={`p-2 rounded-lg transition-colors ${product.onPromo ? 'text-[#ec7205]' : 'text-[#6c7a89] hover:bg-[#f5f7fa]'}`}
                          title={product.onPromo ? "Retirer de la promo" : "Mettre en promo"}
                        >
                          <svg className="w-5 h-5" fill={product.onPromo ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleOutOfStock(product)}
                          className={`p-2 rounded-lg transition-colors ${product.outOfStock ? 'text-[#19212b]' : 'text-[#6c7a89] hover:bg-[#f5f7fa]'}`}
                          title={product.outOfStock ? "Remettre en stock" : "Marquer rupture de stock"}
                        >
                          <svg className="w-5 h-5" fill={product.outOfStock ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </button>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-[#47b6b1] hover:bg-[#47b6b1]/10 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-[#ec7205] hover:bg-[#ec7205]/10 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="bg-white rounded-2xl border border-[#e0e6ed] p-6 text-center text-[#6c7a89]">Chargement...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
