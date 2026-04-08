"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteContent, SiteContent } from "./admin/lib/adminService";

export default function AboutClient() {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        const data = await getSiteContent();
        setSiteContent(data);
      } catch {}
    }
    loadContent();
  }, []);

  const heroTitle = siteContent?.about.heroTitle || "À Propos de Marché LT Eben-Ezer";
  const heroSubtitle = siteContent?.about.heroSubtitle || "Votre épicererie africaine de confiance depuis plus de 5 ans";
  const heroImage = siteContent?.about.heroImage || "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1920&h=600&fit=crop";
  const introText = siteContent?.about.introText || "Marché LT Eben-Ezer propose des produits africains et internationaux authentiques à Montréal.";
  const fullDescription = siteContent?.about.fullDescription || "Fondé avec la passion de partager les saveurs d'Afrique, Marché LT Eben-Ezer offre une vaste sélection de produits traditionnels importés directement d'Afrique de l'Ouest et Centrale.";
  const missionText = siteContent?.about.missionText || "Notre mission est de faire découvrir les produits africains authentiques à la communauté Africaine du Québec tout en préservant nos traditions culinaires.";
  const valuesText = siteContent?.about.valuesText || "Nous privilégions les produits de qualité, le service client exceptionnel et la préservation des traditions africaines à travers l'alimentation.";

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Bonjour, je souhaite en savoir plus sur Marché LT Eben-Ezer");
    window.open(`https://wa.me/15144670229?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Notre magasin"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl text-[#6c7a89] max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
              <Image
                src={heroImage}
                alt="Marché LT Eben-Ezer"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-[#ec7205] text-white px-6 py-3 rounded-xl inline-block">
                  <span className="font-bold text-lg">5+ ans</span> au service de la communauté
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Notre <span className="text-[#ec7205]">Histoire</span>
              </h2>
              <div className="space-y-6 text-[#6c7a89] text-lg leading-relaxed">
                <p>
                  {introText}
                </p>
                <p>
                  {fullDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Notre <span className="text-[#ec7205]">Mission</span> & Nos <span className="text-[#ec7205]">Valeurs</span>
            </h2>
            <p className="text-[#6c7a89] max-w-2xl mx-auto">
              Nous nous engageons à préserver les traditions culinaires africaines tout en offrant un service moderne et accessible
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#ec7205]/50 transition-colors">
              <div className="w-16 h-16 bg-[#ec7205]/20 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#ec7205]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Notre Mission</h3>
              <p className="text-[#6c7a89] leading-relaxed">
                {missionText}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#ec7205]/50 transition-colors">
              <div className="w-16 h-16 bg-[#ec7205]/20 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#ec7205]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Service Communautaire</h3>
              <p className="text-[#6c7a89] leading-relaxed">
                {valuesText}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#ec7205]/50 transition-colors">
              <div className="w-16 h-16 bg-[#ec7205]/20 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#ec7205]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Accessibilité</h3>
              <p className="text-[#6c7a89] leading-relaxed">
                Commandez facilement via WhatsApp, venez récupérer vos produits en magasin ou faites-vous livrer. Nous rendons les produits africains accessibles à tous au Québec.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pourquoi Nous <span className="text-[#ec7205]">Choisir</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🛒", title: "Large Catalogue", desc: "Plus de 1000 produits africains et internationaux" },
              { icon: "🚚", title: "Livraison Québec", desc: "Livraison gratuite au Québec dès 299$" },
              { icon: "💬", title: "Commande WhatsApp", desc: "Service rapide et personnalisé via WhatsApp" },
              { icon: "⭐", title: "Qualité Garantie", desc: "Produits frais et authentiques" },
            ].map((item, index) => (
              <div key={index} className="bg-[#f5f7fa] rounded-2xl p-6 border border-gray-200 text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#6c7a89] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-[#19212b] to-[#ec7205]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/80">Produits</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">5000+</div>
              <div className="text-white/80">Clients Fidèles</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">15+</div>
              <div className="text-white/80">Pays Desservis</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
           Venez nous <span className="text-[#ec7205]">rendre visite</span>
          </h2>
          <p className="text-[#6c7a89] text-lg mb-8 max-w-2xl mx-auto">
            Nous serions ravis de vous accueillir dans notre magasin. Venez découvrir notre sélection de produits et rencontrer notre équipe chaleureuse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#ec7205] text-white font-semibold rounded-full hover:bg-[#a01830] transition-all hover:scale-105"
            >
              Découvrir nos produits
            </Link>
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Nous contacter
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
