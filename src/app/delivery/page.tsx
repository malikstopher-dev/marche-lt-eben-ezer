import { Metadata } from "next";
import DeliveryClient from "./DeliveryClient";

export const metadata: Metadata = {
  title: "Livraison & Retrait | Marché LT Eben-Ezer",
  description: "Informations sur la livraison gratuite, le retrait en magasin et les zones de service de Marché LT Eben-Ezer au Québec.",
};

export default function Delivery() {
  return <DeliveryClient />;
}
