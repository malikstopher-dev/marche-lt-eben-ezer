"use client";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  "name": "Marché LT Eben-Ezer",
  "description": "Épicerie africaine et internationale à Montréal. Produits congolais, africains, surgelés, boissons, épices, cosmétiques. Livraison au Québec.",
  "url": "https://marchelt.com",
  "telephone": "+1 (514) 467-0229",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "4821 Boul Henri-Bourassa Est",
    "addressLocality": "Montréal",
    "addressRegion": "QC",
    "postalCode": "H1H 1M5",
    "addressCountry": "Canada"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 45.5639,
    "longitude": -73.6217
  },
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Monday", "opens": "09:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "09:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "09:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "09:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "09:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "18:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "11:00", "closes": "17:00" }
  ],
  "image": "/logo.jpg",
  "sameAs": [
    "https://www.facebook.com/marchelt",
    "https://www.instagram.com/marchelt"
  ],
  "areaServed": {
    "@type": "State",
    "name": "Québec"
  },
  "potentialAction": {
    "@type": "OrderAction",
    "target": "https://marchelt.com/shop"
  }
};

export default function SeoScript() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
