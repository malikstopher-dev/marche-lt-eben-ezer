import { Metadata } from "next";
import ProductClient from "./ProductClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const products = [
    { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" },
    { id: "6" }, { id: "7" }, { id: "8" }, { id: "9" }, { id: "10" },
    { id: "11" }, { id: "12" }, { id: "13" }, { id: "14" }, { id: "15" },
    { id: "16" }, { id: "17" }, { id: "18" }, { id: "19" }, { id: "20" },
    { id: "21" }, { id: "22" }, { id: "23" }, { id: "24" }, { id: "25" },
    { id: "26" }, { id: "27" }, { id: "28" }, { id: "29" }, { id: "30" },
    { id: "31" }, { id: "32" }, { id: "33" }, { id: "34" }, { id: "35" },
    { id: "36" }, { id: "37" }, { id: "38" }, { id: "39" }, { id: "40" },
    { id: "41" }, { id: "42" }, { id: "43" }, { id: "44" }, { id: "45" },
    { id: "46" }, { id: "47" }, { id: "48" }
  ];
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Produit #${id} | Marché LT Eben-Ezer - Épicerie Africaine`,
    description: "Acheter produits africains et internationaux. Livraison au Québec.",
    openGraph: {
      title: `Produit #${id} | Marché LT Eben-Ezer`,
      description: "Acheter produits africains et internationaux. Livraison au Québec.",
      url: `https://marchelt.com/product/${id}`,
      type: "website"
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  return <ProductClient id={id} />;
}
