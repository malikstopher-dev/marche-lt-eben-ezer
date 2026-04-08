import type { Metadata } from "next";
import { Providers } from "./Providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://marche-lt-eben-ezer-c5fd.vercel.app"),
  title: {
    default: "Marché LT Eben-Ezer | Épicerie Africaine à Montréal",
    template: "%s | Marché LT Eben-Ezer",
  },
  description: "Votre épicière africaine de confiance à Montréal. Produits congolais, africains et internationaux de qualité. Farine de manioc, épices, surgelés, boissons et plus. Commandez via WhatsApp.",
  keywords: ["épicerie africaine Montréal", "produits congolais", "marché africain Québec", "farine de manioc", "épices africaines", "surgelés africains", "boissons africaines", "cosmétiques africains"],
  authors: [{ name: "Marché LT Eben-Ezer" }],
  creator: "Stopher Malik",
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "https://marche-lt-eben-ezer-c5fd.vercel.app",
    siteName: "Marché LT Eben-Ezer",
    title: "Marché LT Eben-Ezer | Épicerie Africaine à Montréal",
    description: "Votre épicière africaine de confiance à Montréal. Produits congolais, africains et internationaux de qualité.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marché LT Eben-Ezer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marché LT Eben-Ezer | Épicerie Africaine à Montréal",
    description: "Votre épicière africaine de confiance à Montréal. Commandez via WhatsApp.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
