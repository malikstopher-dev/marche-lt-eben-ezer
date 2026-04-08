import { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ | Marché LT Eben-Ezer",
  description: "Questions fréquentes sur les produits, commandes, livraison et paiement chez Marché LT Eben-Ezer.",
};

export default function FAQ() {
  return <FAQClient />;
}
