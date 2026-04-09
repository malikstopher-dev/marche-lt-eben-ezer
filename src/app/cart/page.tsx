"use client";

import { useApp } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-[#1a1a1a] rounded w-48 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[#1a1a1a] rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { t, cart, removeFromCart, updateQuantity, cartTotal } = useApp();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const productList = cart.map((item) => `- ${item.name} x${item.quantity} (${item.price !== null ? item.price.toFixed(2) : 'Prix en magasin'} $)`).join("\n");
    const message = encodeURIComponent(`Bonjour, je souhaite commander auprès de Marché LT Eben-Ezer:\n\n${productList}\n\n📦 Total: ${cartTotal.toFixed(2)} $ CAD\n🚚 Livraison: ${cartTotal >= 299 ? 'GRATUITE (299$+)' : 'Calculée via WhatsApp'}\n\nMerci de confirmer la disponibilité et les détails de livraison!`);
    window.open(`https://wa.me/15144670229?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Votre Panier</h1>

        {cart.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-20 h-20 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 8a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <p className="text-gray-400 text-lg mb-6">Votre panier est vide</p>
              <Link href="/shop" className="inline-block px-6 py-3 bg-[#c41e3a] text-white font-semibold rounded-full hover:bg-[#a01830] transition-colors">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-800">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex gap-4 items-center">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/product_images/placeholder.svg"} alt={item.name} fill className="object-cover" onError={(e) => { const target = e.target as HTMLImageElement; target.src = "/product_images/placeholder.svg"; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-[#c41e3a] font-bold mt-1">{item.price !== null && item.price > 0 ? `${item.price.toFixed(2)} $ CAD` : "Prix en magasin"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#303030] text-white transition-colors">-</button>
                      <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center hover:bg-[#303030] text-white transition-colors">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-white">Total</span>
                <span className="text-2xl font-bold text-[#c41e3a]">{cartTotal.toFixed(2)} CAD</span>
              </div>

              <div className={`p-4 rounded-lg mb-6 ${cartTotal >= 299 ? "bg-[#25D366]/10 border border-[#25D366]/30" : "bg-[#252525]"}`}>
                {cartTotal >= 299 ? (
                  <div className="flex items-center gap-2 text-[#25D366]"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>LIVRAISON GRATUITE AU QUÉBEC</div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Livraison gratuite à partir de 299$</div>
                )}
              </div>

              <button onClick={handleCheckout} className="w-full px-6 py-4 bg-[#25D366] text-white font-semibold rounded-full hover:bg-[#20BD5A] transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Commander sur WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
