"use client";

import { useState, useEffect, useRef } from "react";
import { adminService, SiteContent } from "../lib/adminService";

const IMAGE_STORAGE_KEY = "marche_uploaded_images";

interface UploadedImage {
  [key: string]: string;
}

type TabId = "homepage" | "about" | "contact" | "promotions" | "branding" | "seo";

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "homepage", label: "Accueil", icon: "🏠" },
  { id: "about", label: "À Propos", icon: "📖" },
  { id: "contact", label: "Contact", icon: "📞" },
  { id: "promotions", label: "Promotions", icon: "🏷️" },
  { id: "branding", label: "Marque", icon: "🎨" },
  { id: "seo", label: "SEO", icon: "🔍" },
];

export default function ContentManagerPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("homepage");
  const [uploadedImages, setUploadedImages] = useState<UploadedImage>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadField, setCurrentUploadField] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await adminService.getSiteContent();
      setContent(data);
      
      const stored = localStorage.getItem(IMAGE_STORAGE_KEY);
      if (stored) {
        setUploadedImages(JSON.parse(stored));
      }
      
      setLoading(false);
    }
    loadData();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
    const file = e.target.files?.[0];
    if (!file || !content) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        const newUploaded = { ...uploadedImages, [fieldKey]: result };
        setUploadedImages(newUploaded);
        localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(newUploaded));
        
        updateContentField(fieldKey, result);
      }
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCurrentUploadField(null);
  };

  const updateContentField = (fieldKey: string, value: string) => {
    if (!content) return;
    
    const parts = fieldKey.split(".");
    if (parts.length === 2) {
      const [section, field] = parts;
      setContent({
        ...content,
        [section]: {
          ...content[section as keyof typeof content],
          [field]: value,
        },
      });
    } else if (parts.length === 3) {
      const [section, field, index] = parts;
      if (field === "additionalImages" || field === "features") {
        const arr = [...(content[section as keyof typeof content] as any)[field]];
        arr[parseInt(index)] = value;
        setContent({
          ...content,
          [section]: {
            ...content[section as keyof typeof content],
            [field]: arr,
          },
        });
      }
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setMessage("");
    
    try {
      await adminService.saveSiteContent(content);
      setMessage("Contenu enregistré avec succès!");
    } catch (error) {
      setMessage("Erreur lors de l'enregistrement");
    }
    
    setSaving(false);
  };

  const ImageField = ({ label, value, fieldKey, aspect = "square" }: { label: string; value: string; fieldKey: string; aspect?: "square" | "video" }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1A1A1A]">{label}</label>
      <div className={`rounded-lg overflow-hidden bg-gray-100 border border-[#E8E4DD] ${aspect === "video" ? "aspect-video" : "aspect-square"}`}>
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Pas d'image</div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => updateContentField(fieldKey, e.target.value)}
          placeholder="/image.jpg"
          className="flex-1 px-3 py-2 border border-[#E8E4DD] rounded-xl text-sm"
        />
        <button
          type="button"
          onClick={() => setCurrentUploadField(fieldKey)}
          className="px-3 py-2 bg-[#F5F2ED] text-[#1A1A1A] rounded-xl text-sm hover:bg-[#E8E4DD]"
        >
          📁
        </button>
      </div>
    </div>
  );

  const TextField = ({ label, value, fieldKey, rows = 2 }: { label: string; value: string; fieldKey: string; rows?: number }) => (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">{label}</label>
      {rows > 1 ? (
        <textarea
          value={value}
          onChange={(e) => updateContentField(fieldKey, e.target.value)}
          rows={rows}
          className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => updateContentField(fieldKey, e.target.value)}
          className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
        />
      )}
    </div>
  );

  if (loading || !content) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#E8E4DD] rounded w-1/4"></div>
          <div className="h-64 bg-[#E8E4DD] rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Gestion du Contenu</h1>
        <p className="text-[#6B6B6B]">Modifiez le contenu de votre site web</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes("Erreur") ? "bg-[#C41E3A]/10 text-[#C41E3A]" : "bg-[#2D5A3D]/10 text-[#2D5A3D]"}`}>
          {message}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-[#2D5A3D] text-white"
                : "bg-white text-[#1A1A1A] border border-[#E8E4DD] hover:bg-[#F5F2ED]"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
        {activeTab === "homepage" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Page d'Accueil</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Titre Hero" value={content.homepage.heroTitle} fieldKey="homepage.heroTitle" />
              <TextField label="Sous-titre Hero" value={content.homepage.heroSubtitle} fieldKey="homepage.heroSubtitle" />
            </div>
            
            <ImageField label="Image Hero" value={content.homepage.heroImage} fieldKey="homepage.heroImage" />
            
            <TextField label="Message de Bienvenue" value={content.homepage.welcomeMessage} fieldKey="homepage.welcomeMessage" rows={3} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Texte du bouton CTA" value={content.homepage.ctaText} fieldKey="homepage.ctaText" />
              <TextField label="Lien du bouton CTA" value={content.homepage.ctaLink} fieldKey="homepage.ctaLink" />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-[#1A1A1A]">Fonctionnalités</h3>
              {content.homepage.features.map((feature, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#F5F2ED] rounded-xl">
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => {
                      const newFeatures = [...content.homepage.features];
                      newFeatures[index] = { ...feature, icon: e.target.value };
                      setContent({ ...content, homepage: { ...content.homepage, features: newFeatures } });
                    }}
                    placeholder="Emoji"
                    className="px-3 py-2 border border-[#E8E4DD] rounded-xl"
                  />
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...content.homepage.features];
                      newFeatures[index] = { ...feature, title: e.target.value };
                      setContent({ ...content, homepage: { ...content.homepage, features: newFeatures } });
                    }}
                    placeholder="Titre"
                    className="px-3 py-2 border border-[#E8E4DD] rounded-xl"
                  />
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...content.homepage.features];
                      newFeatures[index] = { ...feature, description: e.target.value };
                      setContent({ ...content, homepage: { ...content.homepage, features: newFeatures } });
                    }}
                    placeholder="Description"
                    className="px-3 py-2 border border-[#E8E4DD] rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">À Propos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Titre Hero" value={content.about.heroTitle} fieldKey="about.heroTitle" />
              <TextField label="Sous-titre Hero" value={content.about.heroSubtitle} fieldKey="about.heroSubtitle" />
            </div>
            
            <ImageField label="Image Hero" value={content.about.heroImage} fieldKey="about.heroImage" />
            
            <TextField label="Texte d'introduction" value={content.about.introText} fieldKey="about.introText" rows={3} />
            <TextField label="Description complète" value={content.about.fullDescription} fieldKey="about.fullDescription" rows={6} />
            <TextField label="Mission" value={content.about.missionText} fieldKey="about.missionText" rows={3} />
            <TextField label="Valeurs" value={content.about.valuesText} fieldKey="about.valuesText" rows={3} />
            
            <div className="space-y-4">
              <h3 className="font-medium text-[#1A1A1A]">Images supplémentaires</h3>
              <div className="grid grid-cols-2 gap-4">
                {content.about.additionalImages.map((img, index) => (
                  <ImageField
                    key={index}
                    label={`Image ${index + 1}`}
                    value={img}
                    fieldKey={`about.additionalImages.${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Contact</h2>
            
            <TextField label="Adresse" value={content.contact.address} fieldKey="contact.address" rows={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Téléphone principal" value={content.contact.phone} fieldKey="contact.phone" />
              <TextField label="WhatsApp" value={content.contact.whatsapp} fieldKey="contact.whatsapp" />
            </div>
            <TextField label="Email" value={content.contact.email} fieldKey="contact.email" />
            <TextField label="Autres téléphones (séparés par virgule)" value={content.contact.additionalPhones.join(", ")} fieldKey="contact.additionalPhones" />
            <TextField label="Heures d'ouverture" value={content.contact.openingHours} fieldKey="contact.openingHours" rows={2} />
            <TextField label="URL Google Maps Embed" value={content.contact.mapEmbedUrl} fieldKey="contact.mapEmbedUrl" rows={3} />
          </div>
        )}

        {activeTab === "promotions" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Promotions</h2>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={content.promotions.enabled}
                onChange={(e) => setContent({ ...content, promotions: { ...content.promotions, enabled: e.target.checked } })}
                className="w-5 h-5 rounded border-[#E8E4DD] text-[#2D5A3D] focus:ring-[#2D5A3D]"
              />
              <label className="text-sm font-medium text-[#1A1A1A]">Activer la barre de promotions</label>
            </div>
            
            <TextField label="Message de la promotion" value={content.promotions.message} fieldKey="promotions.message" rows={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Texte du bouton" value={content.promotions.buttonText} fieldKey="promotions.buttonText" />
              <TextField label="Lien du bouton" value={content.promotions.buttonLink} fieldKey="promotions.buttonLink" />
            </div>
          </div>
        )}

        {activeTab === "branding" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Identité Visuelle</h2>
            
            <ImageField label="Logo" value={content.branding.logo} fieldKey="branding.logo" aspect="video" />
            <ImageField label="Favicon" value={content.branding.favicon} fieldKey="branding.favicon" />
            <TextField label="Texte du pied de page" value={content.branding.footerText} fieldKey="branding.footerText" rows={2} />
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-8">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Référencement (SEO)</h2>
            
            <div className="space-y-4">
              <h3 className="font-medium text-[#1A1A1A]">Page d'Accueil</h3>
              <TextField label="Titre Meta" value={content.seo.homeTitle} fieldKey="seo.homeTitle" />
              <TextField label="Description Meta" value={content.seo.homeDescription} fieldKey="seo.homeDescription" rows={3} />
              <ImageField label="Image Open Graph" value={content.seo.homeOgImage} fieldKey="seo.homeOgImage" />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-[#1A1A1A]">À Propos</h3>
              <TextField label="Titre Meta" value={content.seo.aboutTitle} fieldKey="seo.aboutTitle" />
              <TextField label="Description Meta" value={content.seo.aboutDescription} fieldKey="seo.aboutDescription" rows={3} />
              <ImageField label="Image Open Graph" value={content.seo.aboutOgImage} fieldKey="seo.aboutOgImage" />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-[#1A1A1A]">Contact</h3>
              <TextField label="Titre Meta" value={content.seo.contactTitle} fieldKey="seo.contactTitle" />
              <TextField label="Description Meta" value={content.seo.contactDescription} fieldKey="seo.contactDescription" rows={3} />
              <ImageField label="Image Open Graph" value={content.seo.contactOgImage} fieldKey="seo.contactOgImage" />
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => currentUploadField && handleImageUpload(e, currentUploadField)}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-[#2D5A3D] text-white font-semibold rounded-xl hover:bg-[#234a31] transition-colors disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer le contenu"}
      </button>
    </div>
  );
}