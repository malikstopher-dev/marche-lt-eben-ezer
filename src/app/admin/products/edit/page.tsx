"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { adminService, Product, Category } from "../../lib/adminService";

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") ? parseInt(searchParams.get("id") as string) : null;

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
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const categoriesData = await adminService.getCategories();
      setCategories(categoriesData);

      if (productId) {
        const productData = await adminService.getProduct(productId);
        if (productData) {
          setProduct(productData);
        } else {
          router.push("/admin/products");
          return;
        }
      }
      setLoading(false);
    }
    loadData();
  }, [productId, router]);

  const handleSave = async () => {
    if (!productId) return;
    
    setSaving(true);
    setMessage("");

    try {
      await adminService.updateProduct(productId, product);
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
      <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E8E4DD] rounded w-1/4"></div>
          <div className="h-64 bg-[#E8E4DD] rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-[#F5F2ED] rounded-lg transition-colors">
          <svg className="w-5 h-5 text-[#6B6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Modifier le Produit</h1>
          <p className="text-[#6B6B6B]">{product.name || "Sans titre"}</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes("Erreur") ? "bg-[#C41E3A]/10 text-[#C41E3A]" : "bg-[#2D5A3D]/10 text-[#2D5A3D]"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Informations du Produit</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#2D5A3D]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Catégorie</label>
                  <select
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#2D5A3D]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Sous-catégorie</label>
                  <input
                    type="text"
                    value={product.subcategory}
                    onChange={(e) => setProduct({ ...product, subcategory: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#2D5A3D]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Marque</label>
                  <input
                    type="text"
                    value={product.brand}
                    onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#2D5A3D]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Format/Taille</label>
                  <input
                    type="text"
                    value={product.size_pack}
                    onChange={(e) => setProduct({ ...product, size_pack: e.target.value })}
                    placeholder="Ex: 1 kg, 500ml"
                    className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#2D5A3D]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Description</label>
                <textarea
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#2D5A3D]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Prix</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Prix (CAD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#2D5A3D]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Prix comparatif</label>
                <input
                  type="number"
                  step="0.01"
                  value={product.compare_at_price}
                  onChange={(e) => setProduct({ ...product, compare_at_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] focus:ring-2 focus:ring-[#2D5A3D]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Image</h2>
            <div className="space-y-4">
              <div className="aspect-square bg-[#F5F2ED] rounded-xl overflow-hidden flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-[#6B6B6B]">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Pas d'image</p>
                  </div>
                )}
              </div>
              <input
                type="text"
                value={product.image}
                onChange={(e) => setProduct({ ...product, image: e.target.value })}
                placeholder="URL de l'image"
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl text-[#1A1A1A] text-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Statut</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-[#E8E4DD] rounded-xl cursor-pointer hover:bg-[#F5F2ED]">
                <input
                  type="checkbox"
                  checked={product.visible !== false}
                  onChange={(e) => setProduct({ ...product, visible: e.target.checked })}
                  className="w-5 h-5 rounded border-[#E8E4DD] text-[#2D5A3D] focus:ring-[#2D5A3D]"
                />
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Produit visible</p>
                  <p className="text-xs text-[#6B6B6B]">Affiché dans la boutique</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-[#E8E4DD] rounded-xl cursor-pointer hover:bg-[#F5F2ED]">
                <input
                  type="checkbox"
                  checked={product.featured}
                  onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-[#E8E4DD] text-[#2D5A3D] focus:ring-[#2D5A3D]"
                />
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Produit en vedette</p>
                  <p className="text-xs text-[#6B6B6B]">Affiché dans la homepage</p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-[#2D5A3D] text-white font-semibold rounded-xl hover:bg-[#234a31] transition-colors disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}
