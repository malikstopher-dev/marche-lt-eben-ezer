"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, getProductImage, Product } from "@/lib/productService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PromotionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isPromoActive = (product: Product) => {
    if (!product.onPromo) return false;
    const now = new Date();
    const start = product.promoStartDate ? new Date(product.promoStartDate) : null;
    const end = product.promoEndDate ? new Date(product.promoEndDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        const promoProducts = data.filter(
          (p: Product) => p.visible !== false && isPromoActive(p)
        );
        setProducts(promoProducts);
      } catch {
        fetch("/products.json")
          .then((res) => res.json())
          .then((data) => {
            const promoProducts = data.filter(
              (p: Product) => p.visible !== false && isPromoActive(p)
            );
            setProducts(promoProducts);
          })
          .catch(() => {});
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Header Banner */}
      <div className="bg-[#ec7205] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔥</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Promotions en cours</h1>
          </div>
          <p className="text-white/80 text-lg">
            Profitez de nos offres exceptionnelles sur une sélection de produits
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              {products.length} offre{products.length !== 1 ? "s" : ""} active{products.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-2xl p-4 hover:shadow-xl transition-shadow group border border-gray-100"
                >
                  <div className="aspect-square relative mb-4 bg-gray-100 rounded-xl overflow-hidden">
                    {product.promoLabel && (
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
                  <h3 className="font-semibold text-[#1A1A1A] line-clamp-2">{product.name}</h3>
                  {product.size_pack && (
                    <p className="text-sm text-gray-500 mt-1">{product.size_pack}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    {product.promoPrice ? (
                      <>
                        <span className="font-bold text-[#ec7205] text-lg">
                          {product.promoPrice.toFixed(2)}$
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          {product.price.toFixed(2)}$
                        </span>
                        <span className="text-xs text-[#ec7205] font-bold">
                          -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-[#47b6b1]">{product.price.toFixed(2)}$</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">😔</p>
            <p className="text-gray-500 text-lg">Aucune promotion active pour le moment</p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-6 py-3 bg-[#47b6b1] text-white font-bold rounded-xl hover:bg-[#39918d] transition-colors"
            >
              Voir tous les produits
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
