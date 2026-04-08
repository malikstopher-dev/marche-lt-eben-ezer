import { Metadata } from "next";
import AboutClient from "./abAboutClient";

export const metadata: Metadata = {
  title: "À Propos | Marché LT Eben-Ezer - Notre Histoire",
  description: "Découvrez l'histoire de Marché LT Eben-Ezer, votre épicière africaine de confiance à Montréal depuis des années. Products congolais, africains et internationaux de qualité.",
  keywords: [
    "à propos marché lt eben ezer",
    "histoire epicerie africaine montreal",
    "epicerie congolaise montreal",
    "produits africains montreal"
  ],
  openGraph: {
    title: "À Propos | Marché LT Eben-Ezer",
    description: "Découvrez l'histoire de Marché LT Eben-Ezer, votre épicière africaine de confiance à Montréal.",
    url: "https://marchelt.com/about",
    type: "website"
  }
};

export default function About() {
  return <AboutClient />;
}
