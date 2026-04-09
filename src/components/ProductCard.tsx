"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { getProductImage } from "@/lib/productService";

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  size_pack?: string;
  image: string;
  price: number;
  onPromo?: boolean;
  promoPrice?: number | null;
  promoLabel?: string | null;
  promoStartDate?: string | null;
  promoEndDate?: string | null;
  outOfStock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="aspect-square bg-gray-100 animate-pulse"></div>
        <div className="p-4 space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const { addToCart } = useApp();

  const isPromoActive = () => {
    if (!product.onPromo) return false;
    const now = new Date();
    const start = product.promoStartDate ? new Date(product.promoStartDate) : null;
    const end = product.promoEndDate ? new Date(product.promoEndDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  };

  const promoActive = isPromoActive();
  const discount = promoActive && product.promoPrice && product.price > 0
    ? Math.round((1 - product.promoPrice / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.outOfStock) return;
    
    const displayPrice = promoActive && product.promoPrice ? product.promoPrice : product.price;
    addToCart({
      id: String(product.id),
      name: product.name,
      price: displayPrice,
      quantity: 1,
      image: getProductImage(product),
    });
  };

  const handleOrderWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const displayPrice = promoActive && product.promoPrice ? product.promoPrice : product.price;
    const message = encodeURIComponent(
      `Bonjour, je souhaite commander:\n\n📦 ${product.name}\n💰 Prix: ${displayPrice.toFixed(2)} $ CAD\n📂 Catégorie: ${product.category}\n\nMerci de confirmer la disponibilité!`
    );
    window.open(`https://wa.me/15144670229?text=${message}`, "_blank");
  };

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={imageError ? "/product_images/placeholder.svg" : getProductImage(product)}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          
          {promoActive && product.promoLabel && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold uppercase rounded">
                {product.promoLabel}
              </span>
            </div>
          )}
          
          {discount > 0 && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-white text-red-600 text-xs font-bold rounded shadow">
                -{discount}%
              </span>
            </div>
          )}
          
          {product.outOfStock && (
            <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
              <span className="px-3 py-1.5 bg-gray-800 text-white text-sm font-medium rounded">
                Rupture de stock
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <p className="text-xs text-gray-500 mb-1 font-medium">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            {promoActive && product.promoPrice ? (
              <>
                <span className="text-base font-bold text-red-600">
                  ${product.promoPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-900">
                {product.price > 0 ? `$${product.price.toFixed(2)}` : <span className="text-sm text-gray-500">Prix en magasin</span>}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.outOfStock}
            className={`w-full py-2 text-sm font-semibold rounded-lg transition-colors ${
              product.outOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-emerald-700 text-white hover:bg-emerald-800"
            }`}
          >
            {product.outOfStock ? "Indisponible" : "Ajouter au panier"}
          </button>
        </div>
      </div>
    </Link>
  );
}
