"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminService, Product, Category, PLACEHOLDER_IMAGE } from "../../lib/adminService";

export default function NewProductPage() {
  const router = useRouter();
  
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    category: "Pantry Staples",
    subcategory: "",
    brand: "",
    size_pack: "",
    sku: "",
    price: 0,
    compare_at_price: 0,
    image: "",
    description: "",
    visible: true,
    featured: false,
    price_needs_review: false,
    source: "manual",
    onPromo: false,
    promoPrice: null,
    promoLabel: null,
    promoStartDate: null,
    promoEndDate: null,
    outOfStock: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const categoriesData = await adminService.getCategories();
      setCategories(categoriesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      await adminService.createProduct(product as Omit<Product, "id">);
      setMessage("Produit enregistré avec succès!");
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (error) {
      setMessage("Erreur lors de l'enregistrement");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e0e6ed] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#e0e6ed] rounded w-1/4"></div>
          <div className="h-64 bg-[#e0e6ed] rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-[#f5f7fa] rounded-lg transition-colors">
          <svg className="w-5 h-5 text-[#6c7a89]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#19212b]">Nouveau Produit</h1>
          <p className="text-[#6c7a89]">{product.name || "Sans titre"}</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes("Erreur") ? "bg-[#ec7205]/10 text-[#ec7205]" : "bg-[#47b6b1]/10 text-[#47b6b1]"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#e0e6ed] p-6">
            <h2 className="text-lg font-semibold text-[#19212b] mb-4">Informations du Produit</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#19212b] mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#19212b] mb-2">Catégorie</label>
                  <select
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#19212b] mb-2">Sous-catégorie</label>
                  <input
                    type="text"
                    value={product.subcategory}
                    onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#19212b] mb-2">Marque</label>
                  <input
                    type="text"
                    value={product.brand}
                    onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#19212b] mb-2">Format/Taille</label>
                  <input
                    type="text"
                    value={product.size_pack}
                    onChange={(e) => setProduct({ ...product, size_pack: e.target.value })}
                    placeholder="Ex: 1 kg, 500ml"
                    className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#19212b] mb-2">Description</label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e0e6ed] p-6">
            <h2 className="text-lg font-semibold text-[#19212b] mb-4">Prix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#19212b] mb-2">Prix (CAD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#19212b] mb-2">Prix comparatif</label>
                <input
                  type="number"
                  step="0.01"
                  value={product.compare_at_price}
                  onChange={(e) => setProduct({ ...product, compare_at_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] focus:ring-2 focus:ring-[#47b6b1]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e0e6ed] p-6">
            <h2 className="text-lg font-semibold text-[#19212b] mb-4">Image</h2>
            <div className="space-y-4">
              <div className="aspect-square bg-[#f5f7fa] rounded-xl overflow-hidden flex items-center justify-center">
                {product.image && product.image !== PLACEHOLDER_IMAGE ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-[#6c7a89]">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Pas d'image</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#19212b]">URL de l'image</label>
                <input
                  type="text"
                  value={product.image || ""}
                  onChange={(e) => setProduct({ ...product, image: e.target.value })}
                  placeholder="/products/filename.jpg"
                  className="w-full px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e0e6ed] rounded-xl text-[#19212b] text-sm cursor-pointer hover:bg-[#f5f7fa] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Sélectionner un fichier</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const result = event.target?.result;
                          if (typeof result === 'string') {
                            setProduct({ ...product, image: result });
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {(product.image && product.image !== PLACEHOLDER_IMAGE) && (
                  <button
                    type="button"
                    onClick={() => setProduct({ ...product, image: PLACEHOLDER_IMAGE })}
                    className="px-4 py-2.5 border border-[#ec7205] text-[#ec7205] rounded-xl text-sm hover:bg-[#ec7205]/10 transition-colors"
                  >
                    Effacer
                  </button>
                )}
              </div>
              <p className="text-xs text-[#6c7a89]">
                Collez une URL ou sélectionnez une image depuis votre ordinateur. Utilisera le placeholder si vide.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={product.visible !== false}
                  onChange={(e) => setProduct({ ...product, visible: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Product Visible</p>
                  <p className="text-xs text-gray-500">Show in storefront</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Featured Product</p>
                  <p className="text-xs text-gray-500">Show on homepage</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Promotion Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={product.onPromo || false}
                  onChange={(e) => setProduct({ ...product, onPromo: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable Promotion</p>
                  <p className="text-xs text-gray-500">Show product in promotions</p>
                </div>
              </label>
              {product.onPromo && (
                <div className="pl-3 space-y-4 border-l-2 border-red-200 ml-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Promo Price (CAD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={product.promoPrice || ""}
                      onChange={(e) => setProduct({ ...product, promoPrice: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Promo Badge</label>
                    <select
                      value={product.promoLabel || ""}
                      onChange={(e) => setProduct({ ...product, promoLabel: e.target.value || null })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select badge</option>
                      <option value="PROMO">PROMO</option>
                      <option value="SALE">SALE</option>
                      <option value="SPECIAL">SPECIAL</option>
                      <option value="LIMITED">LIMITED</option>
                      <option value="BEST DEAL">BEST DEAL</option>
                      <option value="-20%">-20%</option>
                      <option value="-30%">-30%</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={product.promoStartDate || ""}
                        onChange={(e) => setProduct({ ...product, promoStartDate: e.target.value || null })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={product.promoEndDate || ""}
                        onChange={(e) => setProduct({ ...product, promoEndDate: e.target.value || null })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock Status</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={product.outOfStock || false}
                  onChange={(e) => setProduct({ ...product, outOfStock: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">Out of Stock</p>
                  <p className="text-xs text-gray-500">Product not available</p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-[#47b6b1] text-white font-semibold rounded-xl hover:bg-[#39918d] transition-colors disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}
