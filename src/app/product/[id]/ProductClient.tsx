"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { getProductById, getProductImage } from "@/lib/productService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Product {
  id: number;
  sku?: string;
  slug?: string;
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

interface Props {
  id: string;
}

export default function ProductClient({ id }: Props) {
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-32">
          <div className="text-teal-700 font-medium">Chargement...</div>
        </div>
      </div>
    );
  }

  const { addToCart } = useApp();

  useEffect(() => {
    async function loadProduct() {
      try {
        const found = await getProductById(Number(id || params.id));
        if (found) setProduct(found);
      } catch {
        fetch("/products.json")
          .then((res) => res.json())
          .then((data) => {
            const found = data.find((p: Product) => String(p.id) === String(id || params.id));
            if (found) setProduct(found);
          })
          .catch(() => {});
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id, params.id]);

  const isPromoActive = () => {
    if (!product?.onPromo) return false;
    const now = new Date();
    const start = product.promoStartDate ? new Date(product.promoStartDate) : null;
    const end = product.promoEndDate ? new Date(product.promoEndDate) : null;
    if (start && now < start) return false;
    if (end && now > end) return false;
    return true;
  };

  const handleOrderWhatsApp = () => {
    if (!product) return;
    const promoActive = isPromoActive();
    const displayPrice = promoActive && product.promoPrice ? product.promoPrice : product.price;
    const message = encodeURIComponent(`Bonjour, je souhaite commander:\n\n📦 ${product.name}\n💰 Prix: ${displayPrice.toFixed(2)} $ CAD\n📂 Catégorie: ${product.category}\n${product.brand ? `🏷️ Marque: ${product.brand}` : ''}\n${product.size_pack ? `📏 Format: ${product.size_pack}` : ''}\n${promoActive ? '\n🎁 Prix promo actif!' : ''}\n\nMerci de confirmer la disponibilité!`);
    window.open(`https://wa.me/15144670229?text=${message}`, "_blank");
  };

  const handleAddToCart = () => {
    if (!product || product.outOfStock) return;
    const promoActive = isPromoActive();
    const displayPrice = promoActive && product.promoPrice ? product.promoPrice : product.price;
    addToCart({ id: String(product.id), name: product.name, price: displayPrice, quantity: 1, image: productImage });
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Header /><div className="flex items-center justify-center pt-32"><div className="text-teal-700 font-medium">Chargement...</div></div></div>;

  if (!product) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-col items-center justify-center pt-32">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
        <Link href="/shop" className="text-teal-700 hover:underline">Retour à la boutique</Link>
      </div>
    </div>
  );

  const promoActive = isPromoActive();
  const isOutOfStock = product.outOfStock;
  const productImage = getProductImage(product);
  const discount = promoActive && product.promoPrice && product.price > 0
    ? Math.round((1 - product.promoPrice / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-700 mb-8 transition-colors text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Retour à la boutique
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Product Image */}
            <div className="relative aspect-square lg:aspect-auto bg-gray-100">
              <Image 
                src={productImage} 
                alt={product.name} 
                fill 
                className="object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start gap-3">
                <div className="flex flex-col gap-2">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-lg shadow-sm">
                    {product.category}
                  </span>
                  {promoActive && product.promoLabel && (
                    <span className="px-3 py-1.5 bg-red-600 text-white text-sm font-semibold uppercase tracking-wide rounded-lg shadow-md">
                      {product.promoLabel}
                    </span>
                  )}
                </div>
              </div>

              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
                  <div className="px-6 py-3 bg-gray-800 text-white text-lg font-semibold rounded-xl shadow-lg">
                    Rupture de stock
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-500 mb-2 font-medium">{product.brand}</p>
              )}
              
              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Meta Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.subcategory && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                    {product.subcategory}
                  </span>
                )}
                {product.size_pack && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                    {product.size_pack}
                  </span>
                )}
                {product.sku && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-lg">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">{product.description}</p>
              )}
              
              {/* Pricing */}
              <div className="mb-8">
                {promoActive && product.promoPrice ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-bold text-red-600">
                        ${product.promoPrice.toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      {discount > 0 && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-lg">
                          Save {discount}%
                        </span>
                      )}
                    </div>
                    {product.promoEndDate && (
                      <p className="text-sm text-gray-500">
                        Limited time offer • Ends {new Date(product.promoEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-4xl font-bold text-gray-900">
                    {product.price !== null && product.price > 0 
                      ? `$${product.price.toFixed(2)}` 
                      : <span className="text-xl text-gray-500 font-medium">Prix en magasin</span>
                    }
                  </p>
                )}
              </div>

              {/* Stock Status */}
              {isOutOfStock && (
                <div className="mb-6 p-4 bg-gray-100 rounded-xl">
                  <p className="text-gray-600 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Actuellement indisponible
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart} 
                  disabled={isOutOfStock}
                  className={`flex-1 px-8 py-4 font-semibold rounded-xl transition-all duration-200 ${
                    isOutOfStock 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-teal-700 text-white hover:bg-teal-800 active:scale-[0.98]'
                  }`}
                >
                  {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
                </button>
                
                {!isOutOfStock && (
                  <button 
                    onClick={handleOrderWhatsApp} 
                    className="flex-1 px-8 py-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Commander sur WhatsApp
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
