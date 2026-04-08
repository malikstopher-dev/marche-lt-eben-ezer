"use client";

import { useState } from "react";
import Image from "next/image";

export default function DeliveryClient() {
  const [activeTab, setActiveTab] = useState<"delivery" | "pickup">("delivery");

  const isDelivery = activeTab === "delivery";
  const isPickup = activeTab === "pickup";

  return (
    <div className="min-h-screen bg-white py-24">
      {/* Hero */}
      <section className="relative py-16 mb-12">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=400&fit=crop"
            alt="Livraison"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Livraison & <span className="text-[#c41e3a]">Retrait en Magasin</span>
          </h1>
          <p className="text-[#6c7a89] text-lg">
            Commandez facilement et recevez vos produits où vous voulez
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#f5f7fa] p-2 rounded-2xl inline-flex border border-gray-200">
            <button
              onClick={() => setActiveTab("delivery")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "delivery"
                  ? "bg-[#c41e3a] text-white"
                  : "text-[#6c7a89] hover:text-white"
              }`}
            >
              🚚 Livraison
            </button>
            <button
              onClick={() => setActiveTab("pickup")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "pickup"
                  ? "bg-[#c41e3a] text-white"
                  : "text-[#6c7a89] hover:text-white"
              }`}
            >
              🏪 Retrait en Magasin
            </button>
          </div>
        </div>

        {/* Delivery Content */}
        {isDelivery && (
          <div className="space-y-8">
            <div className="bg-[#f5f7fa] rounded-3xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#c41e3a]/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Livraison Gratuite au Québec</h2>
                  <p className="text-[#6c7a89]">Pour toute commande de 299$ et plus</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="text-3xl mb-3">🛒</div>
                  <h3 className="font-bold text-white mb-2">299$+</h3>
                  <p className="text-[#6c7a89] text-sm">Livraison gratuite</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="text-3xl mb-3">📦</div>
                  <h3 className="font-bold text-white mb-2">150$ - 298$</h3>
                  <p className="text-[#6c7a89] text-sm">Livraison 15$</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="text-3xl mb-3">🚚</div>
                  <h3 className="font-bold text-white mb-2">Moins de 150$</h3>
                  <p className="text-[#6c7a89] text-sm">Livraison 25$</p>
                </div>
              </div>
            </div>

            <div className="bg-[#f5f7fa] rounded-3xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-white mb-6">Zones de Livraison</h3>
              <div className="space-y-4">
                  {[
                    { zone: "Grand Montréal", time: "1-3 jours ouvrables", price: "Inclus dès 299$" },
                    { zone: "Laval & Rive-Nord", time: "2-4 jours ouvrables", price: "Inclus dès 299$" },
                    { zone: "Rive-Sud", time: "2-4 jours ouvrables", price: "Inclus dès 299$" },
                    { zone: "Québec et environs", time: "3-5 jours ouvrables", price: "Frais supplémentaires" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">📍</span>
                        <div>
                          <h4 className="font-semibold text-white">{item.zone}</h4>
                          <p className="text-[#6c7a89] text-sm">{item.time}</p>
                        </div>
                      </div>
                      <span className="text-[#c41e3a] font-semibold">{item.price}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-[#f5f7fa] rounded-3xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-white mb-6">Informations Importantes</h3>
              <div className="space-y-4">
                {[
                  "Les commandes passées avant 14h sont traitées le jour même",
                  "Livraison du lundi au samedi (hors jours fériés)",
                  "Un créneau horaire vous sera communiqué par SMS/WhatsApp",
                  "Veuillez être présent pour réceptionner la livraison",
                  "Pour les produits surgelés, nous utilisons des glacières isolées",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#25D366] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[#6c7a89]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pickup Content */}
        {isPickup && (
          <div className="space-y-8">
            <div className="bg-[#f5f7fa] rounded-3xl p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#c41e3a]/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Retrait en Magasin</h2>
                  <p className="text-[#6c7a89]">Venez récupérer votre commande à notre magasin</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                <h4 className="font-semibold text-white mb-4">Adresse du Magasin</h4>
                <p className="text-[#6c7a89]">
                  4821 Boul Henri-Bourassa Est<br />
                  Montréal, QC H1H 1M5<br />
                  Québec, Canada
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="text-3xl mb-3">⏰</div>
                  <h3 className="font-bold text-white mb-2">Heures de Retrait</h3>
                  <p className="text-[#6c7a89] text-sm">
                    Mon-Fri: 9 AM - 9 PM<br />
                    Sat: 9 AM - 10 PM<br />
                    Sun: 9 AM - 10 PM
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="text-3xl mb-3">✓</div>
                  <h3 className="font-bold text-white mb-2">Délai de Préparation</h3>
                  <p className="text-[#6c7a89] text-sm">
                    Commandes готовes en 2-4 heures<br />
                    Notification par WhatsApp
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f5f7fa] rounded-3xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-white mb-6">Comment Ça Marche</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Passez votre commande", desc: "Via WhatsApp ou sur notre boutique en ligne" },
                  { step: "2", title: "Attendez la confirmation", desc: "Nous vous informons dès que votre commande est prête" },
                  { step: "3", title: "Venez récupérer", desc: "Présentez-vous au magasin avec votre preuve de commande" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl">
                    <div className="w-10 h-10 bg-[#c41e3a] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-[#6c7a89] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
