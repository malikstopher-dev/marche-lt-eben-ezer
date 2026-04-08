import { Metadata } from "next";
import { Providers } from "./Providers";
import HomepageContent from "./HomepageContent";

export const metadata: Metadata = {
  title: "Marché LT Eben-Ezer - Épicerie Africaine à Montréal",
  description: "Votre épicerer africaine de confiance à Montréal. Produits congolais, africain et internationaux de qualité. Commandez via WhatsApp ou venez nous voir.",
};

export default function Home() {
  return (
    <Providers>
      <HomepageContent />
    </Providers>
  );
}
