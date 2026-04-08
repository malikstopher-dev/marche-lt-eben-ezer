"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts, getProductImage } from "@/lib/productService";

interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  brand?: string;
  size_pack?: string;
  image: string;
  price: number;
  featured?: boolean;
  onPromo?: boolean;
  promoPrice?: number | null;
  promoLabel?: string | null;
  promoStartDate?: string | null;
  promoEndDate?: string | null;
  outOfStock?: boolean;
}

const heroBanners = [
  { src: "/hero_banners/hero1.jpg", alt: "Marché LT Eben-Ezer" },
  { src: "/hero_banners/store-in1.jpg", alt: "Notre store" },
  { src: "/hero_banners/store-in2.jpg", alt: "Produits africains" },
  { src: "/hero_banners/store-in3.jpg", alt: "Épicerie" },
  { src: "/hero_banners/store.jpg", alt: "Grand choix" },
  { src: "/hero_banners/store1.jpg", alt: "Promotions" },
  { src: "/hero_banners/store3.jpg", alt: "Produits frais" },
  { src: "/hero_banners/store4.jpg", alt: "Épices" },
  { src: "/hero_banners/store5.jpg", alt: "Boissons" },
];

const departments = [
  { id: "Pantry Staples", name: "Épicerie", icon: "🫘", slug: "epicerie", image: "/product_images/food/001-farine-de-manioc-kinazi-1kg.jpg" },
  { id: "Frozen Foods", name: "Surgelés", icon: "🐟", slug: "surgeles", image: "/product_images/frozen-fish/090-raw-shrimp-16-20.jpg" },
  { id: "Beverages", name: "Boissons", icon: "🥤", slug: "boissons", image: "/product_images/drinks/001-jus-de-bissap-hibiscus-1l.jpg" },
  { id: "Produce & Greens", name: "Légumes", icon: "🥬", slug: "legumes", image: "/product_images/fresh-vegetables/217-pondu.jpg" },
  { id: "Snacks", name: "Snacks", icon: "🍿", slug: "snacks", image: "/product_images/snacks/205-v-c-dig-thins-wild-fruits.jpg" },
  { id: "Cosmetics", name: "Cosmétiques", icon: "🧴", slug: "cosmetiques", image: "/product_images/cosmetics/222-ever-sheen-cocoa-butter-hand-and-body-lotion.jpg" },
  { id: "Condiments", name: "Condiments", icon: "🌶️", slug: "condiments", image: "/product_images/spices/120-hot-paprika.jpg" },
  { id: "Maison", name: "Maison", icon: "🧹", slug: "maison", image: "/product_images/household/211-old-dutch-bleach.jpg" },
];

const trustFeatures = [
  { icon: "🛒", title: "Produits Authentiques", description: "Importés d'Afrique de l'Ouest" },
  { icon: "📱", title: "Commande Facile", description: "Via WhatsApp" },
  { icon: "🚚", title: "Livraison Gratuite", description: "Dès 299$ au Québec" },
  { icon: "📍", title: "Cueillette en Magasin", description: "4831 Henri-Bourassa Est" },
];

export default function HomepageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPromoPopup, setShowPromoPopup] = useState(false);
  const [promoCount, setPromoCount] = useState(0);

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
        const withPrices = data.filter((p: Product) => p.price !== null && p.price > 0);
        setProducts(withPrices.slice(0, 8));
        const activePromos = withPrices.filter((p: Product) => isPromoActive(p));
        setPromoProducts(activePromos.slice(0, 4));
        setPromoCount(activePromos.length);
        const popupShown = localStorage.getItem("promo_popup_shown");
        if (activePromos.length > 0 && !popupShown) {
          setTimeout(() => setShowPromoPopup(true), 2000);
        }
      } catch {
        fetch("/products.json")
          .then((res) => res.json())
          .then((data) => {
            const withPrices = data.filter((p: Product) => p.price !== null && p.price > 0);
            setProducts(withPrices.slice(0, 8));
            const activePromos = withPrices.filter((p: Product) => isPromoActive(p));
            setPromoProducts(activePromos.slice(0, 4));
            setPromoCount(activePromos.length);
            const popupShown = localStorage.getItem("promo_popup_shown");
            if (activePromos.length > 0 && !popupShown) {
              setTimeout(() => setShowPromoPopup(true), 2000);
            }
          })
          .catch(() => {});
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Bonjour, je souhaite commander des produits auprès de Marché LT Eben-Ezer");
    window.open(`https://wa.me/15144670229?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* PROMOTION POPUP */}
      {showPromoPopup && promoProducts.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowPromoPopup(false); localStorage.setItem("promo_popup_shown", "true"); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <button 
              onClick={() => { setShowPromoPopup(false); localStorage.setItem("promo_popup_shown", "true"); }}
              className="absolute top-4 right-4 w-8 h-8 bg-[#f5f7fa] hover:bg-[#e0e6ed] rounded-full flex items-center justify-center transition-colors z-10"
            >
              <svg className="w-5 h-5 text-[#19212b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-gradient-to-r from-[#19212b] to-[#ec7205] p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔥</span>
                <div>
                  <h2 className="text-2xl font-bold">Offres Spéciales!</h2>
                  <p className="text-white/80 text-sm">{promoCount} produit{promoCount > 1 ? 's' : ''} en promotion</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {promoProducts.slice(0, 4).map((product) => {
                  const discount = product.promoPrice ? Math.round((1 - product.promoPrice / product.price) * 100) : 0;
                  return (
                    <Link 
                      key={product.id} 
                      href={`/product/${product.id}`}
                      onClick={() => { setShowPromoPopup(false); localStorage.setItem("promo_popup_shown", "true"); }}
                      className="block bg-[#f5f7fa] rounded-xl p-3 hover:shadow-md transition-all"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-white">
                        <img 
                          src={getProductImage(product)} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium text-[#19212b] line-clamp-2 mb-1">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#ec7205]">{product.promoPrice?.toFixed(2)}$</span>
                        <span className="text-xs text-gray-400 line-through">{product.price.toFixed(2)}$</span>
                        {discount > 0 && (
                          <span className="text-xs font-bold text-[#47b6b1]">-{discount}%</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link 
                href="/promotions"
                onClick={() => { setShowPromoPopup(false); localStorage.setItem("promo_popup_shown", "true"); }}
                className="block w-full py-3 bg-[#ec7205] hover:bg-[#d66a05] text-white font-semibold rounded-xl text-center transition-colors"
              >
                Voir toutes les promotions
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* PREMIUM HERO SLIDER */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden bg-[#19212b]">
        <div className="absolute inset-0">
          {heroBanners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                index === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
            >
              <img src={banner.src} alt={banner.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#19212b] via-[#19212b]/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#19212b]/80 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {heroBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentSlide ? "bg-white w-12" : "bg-white/30 w-8 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + heroBanners.length) % heroBanners.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % heroBanners.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-2xl pt-24">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-5 py-2 bg-[#ec7205] text-white text-sm font-semibold rounded-full shadow-lg backdrop-blur-sm">
                🛒 Votre Épicerie Africaine à Montréal
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
              Les saveurs d'<span className="text-[#ec7205]">Afrique</span><br />
              chez vous
            </h1>

            <p className="mt-6 text-xl text-white/80 max-w-lg">
              Produits africains authentiques, épices, surgelés et boissons. 
              Commandez facilement via WhatsApp.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="px-10 py-4 bg-[#47b6b1] text-white font-bold rounded-full hover:bg-[#39918d] transition-all hover:shadow-lg hover:scale-105 text-center"
              >
                Commander maintenant
              </Link>
              <Link
                href="/promotions"
                className="px-10 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>🔥</span> Promotions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST FEATURES BAR - Matching site design */}
      <section className="bg-[#19212b] py-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustFeatures.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ec7205]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  <p className="text-white/50 text-xs">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMOTIONS SECTION - Using same container/padding as inner pages */}
      <section className="py-12 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[#ec7205] font-bold text-sm">🔥 OFFRES SPÉCIALES</span>
              <h2 className="text-3xl font-bold text-[#19212b] mt-1">Promotions en cours</h2>
            </div>
            <Link href="/promotions" className="text-[#47b6b1] font-semibold hover:underline text-sm">
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : promoProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {promoProducts.map((product) => {
                const discount = product.promoPrice ? Math.round((1 - product.promoPrice / product.price) * 100) : 0;
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="relative aspect-square bg-gray-100">
                      {product.promoLabel && (
                        <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-[#ec7205] text-white text-xs font-bold rounded-full">
                          {product.promoLabel}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="absolute top-2 right-2 z-10 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          -{discount}%
                        </span>
                      )}
                      <img
                        src={getProductImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[#19212b] line-clamp-2 text-sm">{product.name}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-bold text-[#ec7205]">{product.promoPrice?.toFixed(2)}$</span>
                        <span className="text-sm text-gray-400 line-through">{product.price.toFixed(2)}$</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Aucune promotion active</p>
          )}
        </div>
      </section>

      {/* CATEGORIES SECTION - Using same styling as inner pages */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#19212b]">Nos Départements</h2>
              <p className="text-gray-500 mt-1">Parcourez toutes nos catégories</p>
            </div>
            <Link href="/shop" className="text-[#47b6b1] font-semibold hover:underline text-sm">
              Voir tout →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                href={`/shop/${dept.slug}`}
                className="group relative aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-3xl block mb-1">{dept.icon}</span>
                  <h3 className="text-white font-bold">{dept.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-12 bg-[#47b6b1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-white/70 font-semibold text-sm">À Propos</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                Votre épicererie africaine<br />de confiance à Montréal
              </h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Marché LT Eben-Ezer propose des produits africains et internationaux authentiques.
                Commandez via WhatsApp et venez chercher ou faites-vous livrer.
              </p>
              <div className="flex gap-4">
                <Link href="/about" className="px-6 py-2.5 bg-white text-[#47b6b1] font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm">
                  En savoir plus
                </Link>
                <Link href="/contact" className="px-6 py-2.5 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-colors text-sm">
                  Nous contacter
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img
                  src="/hero_banners/store-in1.jpg"
                  alt="Notre magasin"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white px-6 py-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-[#47b6b1]">5+</div>
                <div className="text-gray-600 text-sm">années d'expérience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#19212b]">Produits Populaires</h2>
              <p className="text-gray-500 mt-1">Les pluscommandés par nos clients</p>
            </div>
            <Link href="/shop" className="text-[#47b6b1] font-semibold hover:underline text-sm">
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {product.onPromo && product.promoLabel && (
                      <span className="absolute top-2 left-2 z-10 px-2 py-1 bg-[#ec7205] text-white text-xs font-bold rounded-full">
                        {product.promoLabel}
                      </span>
                    )}
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#19212b] line-clamp-2 text-sm">{product.name}</h3>
                    {product.size_pack && <p className="text-xs text-gray-500 mt-1">{product.size_pack}</p>}
                    <div className="mt-2">
                      {product.onPromo && product.promoPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#ec7205]">{product.promoPrice.toFixed(2)}$</span>
                          <span className="text-sm text-gray-400 line-through">{product.price.toFixed(2)}$</span>
                        </div>
                      ) : (
                        <span className="font-bold text-[#47b6b1]">{product.price.toFixed(2)}$</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section className="py-12 bg-[#19212b]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Prêt à commander ?
          </h2>
          <p className="text-white/70 mb-8">
            Commandez via WhatsApp - simple, rapide et pratique !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleWhatsAppClick}
              className="px-8 py-3 bg-[#25D366] text-white font-semibold rounded-full hover:bg-[#20BD5A] transition-colors"
            >
              Commander sur WhatsApp
            </button>
            <Link
              href="/shop"
              className="px-8 py-3 bg-white text-[#19212b] font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              Parcourir la boutique
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}