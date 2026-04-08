"use client";

import { useState } from "react";
import Image from "next/image";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqCategories: { category: string; items: FAQItem[] }[] = [
    {
      category: "Commandes & Paiement",
      items: [
        {
          question: "Comment passer une commande?",
          answer: "Vous pouvez passer commande de deux façons: (1) Via WhatsApp au +1 (514) 467-0229 en nous envoyant la liste des produits souhaités, ou (2) Directement sur notre boutique en ligne. Dans les deux cas, nous vous confirmerons la disponibilité et les détails de paiement."
        },
        {
          question: "Quels modes de paiement acceptez-vous?",
          answer: "Nous acceptons plusieurs modes de paiement: paiement en espèces à la livraison ou au retrait en magasin, virement bancaire (EFT), et paiement par carte de crédit/débit sur place. Pour les commandes en ligne, le virement bancaire est privilégié."
        },
        {
          question: "Puis-je commander sans créer de compte?",
          answer: "Oui! Vous pouvez commander via WhatsApp sans créer de compte. Pour les commandes en ligne, vous pouvez commander en tant qu'invité ou créer un compte pour suivre vos commandes plus facilement."
        },
        {
          question: "Comment savoir si ma commande est confirmée?",
          answer: "Après avoir passé votre commande, nous vous enverrons une confirmation par WhatsApp avec les détails de votre commande, le total, et les informations de livraison ou de retrait. Veuillez vérifier votre dossier spam si vous ne recevez pas de réponse dans les 2 heures."
        }
      ]
    },
    {
      category: "Livraison",
      items: [
        {
          question: "Quelles sont les zones de livraison?",
          answer: "Nous livrons dans tout le Québec. Les principales zones sont: Grand Montréal (1-3 jours), Laval et Rive-Nord (2-4 jours), Rive-Sud (2-4 jours), et Québec et environs (3-5 jours). Contactez-nous pour les zones plus éloignées."
        },
        {
          question: "Quels sont les frais de livraison?",
          answer: "La livraison est gratuite pour toute commande de 299$ et plus au Québec. Pour les commandes entre 150$ et 298$, les frais sont de 15$. Pour les commandes de moins de 150$, les frais de livraison sont de 25$."
        },
        {
          question: "Combien de temps prend la livraison?",
          answer: "Les délais de livraison varient selon votre localisation: 1-3 jours ouvrables pour le Grand Montréal, 2-4 jours pour Laval/Rive-Nord/Rive-Sud, et 3-5 jours pour Québec. Les commandes passées avant 14h sont traitées le jour même."
        },
        {
          question: "Que se passe-t-il si je ne suis pas disponible lors de la livraison?",
          answer: "Nous vous contacterons beforehand pour convenir d'un créneau horaire. Si vous n'êtes pas disponible, notre livreur vous contactera pour reprogrammer la livraison. Veuillez vous assurer que quelqu'un sera présent pour réceptionner la commande."
        }
      ]
    },
    {
      category: "Retrait en Magasin",
      items: [
        {
          question: "Où se trouve le magasin?",
          answer: "Notre magasin est situé au 4821 Boul Henri-Bourassa Est, Montréal, QC H1H 1M5. Nous sommes ouverts du lundi au dimanche. Consultez nos heures d'ouverture sur la page Contact."
        },
        {
          question: "Quel est le délai pour le retrait en magasin?",
          answer: "Votre commande sera généralement prête dans les 2-4 heures suivant la confirmation. Nous vous enverrons un message WhatsApp dès que votre commande sera prête à être récupérée."
        },
        {
          question: "Puis-je modifier ou annuler ma commande?",
          answer: "Oui, vous pouvez modifier ou annuler votre commande tant qu'elle n'a pas été préparée. Veuillez nous contacter rapidement via WhatsApp au +1 (514) 467-0229 pour toute modification."
        }
      ]
    },
    {
      category: "Produits",
      items: [
        {
          question: "D'où proviennent vos produits?",
          answer: "Nous importons nos produits directement d'Afrique de l'Ouest (Nigeria, Ghana, Côte d'Ivoire, Congo), d'Afrique Centrale et des Caraïbes. Nous travaillons avec des fournisseurs fiables pour garantir l'authenticité et la qualité."
        },
        {
          question: "Vos produits sont-ils frais?",
          answer: "Nous veillons à ce que tous nos produits soient frais et de qualité. Les produits surgelés sont conservés à des températures optimales. La date de péremption est clairement indiquée sur chaque produit."
        },
        {
          question: "Proposez-vous des produits biologiques?",
          answer: "Nous avons une sélection de produits biologiques, notamment les huiles de coco et certains produits secs. N'hésitez pas à nous demander des informations spécifiques sur un produit."
        },
        {
          question: "Que faire si un produit est endommagé ou manquant?",
          answer: "Si vous constatez un problème avec votre commande (produit endommagé, manquant, etc.), veuillez nous contacter immédiatement via WhatsApp au +1 (514) 467-0229 dans les 24 heures suivant la réception. Nous ferons le nécessaire pour résoudre le problème."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-24">
      {/* Hero */}
      <section className="relative py-16 mb-12">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1531379410522-a5c83c2e012c?w=1920&h=400&fit=crop"
            alt="FAQ"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Questions <span className="text-[#c41e3a]">Fréquentes</span>
          </h1>
          <p className="text-[#a3a3a3] text-lg">
            Trouvez les réponses à vos questions sur nos produits et services
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {faqCategories.map((category, catIndex) => (
          <div key={catIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="text-[#c41e3a]">{category.category}</span>
            </h2>
            <div className="space-y-4">
              {category.items.map((item, itemIndex) => {
                const globalIndex = catIndex * 100 + itemIndex;
                const isOpen = openIndex === globalIndex;
                return (
                  <div
                    key={itemIndex}
                    className="bg-[#141414] rounded-2xl border border-[#262626] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      className="w-full px-6 py-4 flex items-center justify-between text-left"
                    >
                      <span className="font-semibold text-white pr-4">{item.question}</span>
                      <svg
                        className={`w-5 h-5 text-[#c41e3a] flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-[#a3a3a3] leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still Have Questions */}
        <div className="bg-[#141414] rounded-3xl p-8 border border-[#262626] mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Vous avez encore des questions?</h3>
            <p className="text-[#a3a3a3] mb-6">
              N'hésitez pas à nous contacter directement via WhatsApp
            </p>
            <a
              href="https://wa.me/15144670229"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-full transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Nous contacter sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
