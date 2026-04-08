"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { adminService, Product } from "./lib/adminService";

interface Stats {
  totalProducts: number;
  missingPrices: number;
  missingImages: number;
  missingDescriptions: number;
  featuredProducts: number;
  hiddenProducts: number;
  categoriesCount: number;
  ordersCount: number;
  promotionsCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    missingPrices: 0,
    missingImages: 0,
    missingDescriptions: 0,
    featuredProducts: 0,
    hiddenProducts: 0,
    categoriesCount: 0,
    ordersCount: 0,
    promotionsCount: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [products, categories, orders, promotions] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories(),
        adminService.getOrders(),
        adminService.getPromotions(),
      ]);

      const missingPrices = products.filter(p => !p.price || p.price === 0).length;
      const missingImages = products.filter(p => !p.image || p.image === "").length;
      const missingDescriptions = products.filter(p => !p.description || p.description === "").length;
      const featuredProducts = products.filter(p => p.featured).length;
      const hiddenProducts = products.filter(p => p.visible === false).length;

      setStats({
        totalProducts: products.length,
        missingPrices,
        missingImages,
        missingDescriptions,
        featuredProducts,
        hiddenProducts,
        categoriesCount: categories.length,
        ordersCount: orders.length,
        promotionsCount: promotions.length,
      });

      setRecentProducts(products.slice(0, 5));
      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8E4DD] animate-pulse">
              <div className="h-4 bg-[#E8E4DD] rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-[#E8E4DD] rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Produits", value: stats.totalProducts, color: "#2D5A3D", href: "/admin/products" },
    { label: "Prix Manquants", value: stats.missingPrices, color: "#C41E3A", href: "/admin/products?filter=missing-price" },
    { label: "Produits Vedettes", value: stats.featuredProducts, color: "#B8962E", href: "/admin/products?filter=featured" },
    { label: "Catégories", value: stats.categoriesCount, color: "#2D5A3D", href: "/admin/categories" },
    { label: "Commandes", value: stats.ordersCount, color: "#2D5A3D", href: "/admin/orders" },
    { label: "Promotions", value: stats.promotionsCount, color: "#B8962E", href: "/admin/promotions" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
        <p className="text-[#6B6B6B]">Aperçu de votre boutique</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white rounded-2xl p-6 border border-[#E8E4DD] hover:shadow-lg transition-all hover:-translate-y-1"
          >
            <p className="text-sm text-[#6B6B6B] mb-2">{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
          <div className="p-6 border-b border-[#E8E4DD] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Produits Récents</h2>
            <Link href="/admin/products" className="text-sm text-[#2D5A3D] hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-[#E8E4DD]">
            {recentProducts.length === 0 ? (
              <div className="p-6 text-center text-[#6B6B6B]">Aucun produit</div>
            ) : (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[#F5F2ED] transition-colors"
                >
                  <div className="w-12 h-12 bg-[#F5F2ED] rounded-lg overflow-hidden flex-shrink-0">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate">{product.name}</p>
                    <p className="text-xs text-[#6B6B6B]">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {product.price ? `${product.price.toFixed(2)} $` : "Prix en magasin"}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">#{product.id}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
          <div className="p-6 border-b border-[#E8E4DD]">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Santé des Données</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C41E3A]/10 flex items-center justify-center">
                  <span className="text-[#C41E3A] text-sm font-bold">{stats.missingPrices}</span>
                </div>
                <span className="text-sm text-[#6B6B6B]">Prix manquants</span>
              </div>
              {stats.missingPrices > 0 && (
                <Link href="/admin/products?filter=missing-price" className="text-xs text-[#C41E3A] hover:underline">
                  Voir
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B8962E]/10 flex items-center justify-center">
                  <span className="text-[#B8962E] text-sm font-bold">{stats.missingImages}</span>
                </div>
                <span className="text-sm text-[#6B6B6B]">Images manquantes</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2D5A3D]/10 flex items-center justify-center">
                  <span className="text-[#2D5A3D] text-sm font-bold">{stats.missingDescriptions}</span>
                </div>
                <span className="text-sm text-[#6B6B6B]">Descriptions manquantes</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6B6B6B]/10 flex items-center justify-center">
                  <span className="text-[#6B6B6B] text-sm font-bold">{stats.hiddenProducts}</span>
                </div>
                <span className="text-sm text-[#6B6B6B]">Produits masqués</span>
              </div>
              {stats.hiddenProducts > 0 && (
                <Link href="/admin/products?filter=hidden" className="text-xs text-[#6B6B6B] hover:underline">
                  Voir
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
        <div className="p-6 border-b border-[#E8E4DD]">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Actions Rapides</h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E8E4DD] hover:border-[#2D5A3D] hover:bg-[#F5F2ED] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#2D5A3D]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2D5A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#1A1A1A]">Nouveau Produit</span>
          </Link>
          <Link
            href="/admin/products?filter=missing-price"
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E8E4DD] hover:border-[#C41E3A] hover:bg-[#F5F2ED] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#C41E3A]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#C41E3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#1A1A1A]">Prix Manquants</span>
          </Link>
          <Link
            href="/admin/promotions"
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E8E4DD] hover:border-[#B8962E] hover:bg-[#F5F2ED] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#B8962E]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#B8962E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#1A1A1A]">Promotions</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#E8E4DD] hover:border-[#2D5A3D] hover:bg-[#F5F2ED] transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-[#2D5A3D]/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#2D5A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-[#1A1A1A]">Paramètres</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
