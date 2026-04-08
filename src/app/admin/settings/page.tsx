"use client";

import { useState, useEffect } from "react";
import { adminService, StoreSettings } from "../lib/adminService";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const data = await adminService.getSettings();
      setSettings(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    
    try {
      await adminService.saveSettings(settings);
      setMessage("Paramètres enregistrés avec succès!");
    } catch (error) {
      setMessage("Erreur lors de l'enregistrement");
    }
    
    setSaving(false);
  };

  if (loading || !settings) {
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
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Paramètres</h1>
        <p className="text-[#6B6B6B]">Configurez les informations de votre boutique</p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl ${message.includes("Erreur") ? "bg-[#C41E3A]/10 text-[#C41E3A]" : "bg-[#2D5A3D]/10 text-[#2D5A3D]"}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Informations de la Boutique</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Nom de la boutique</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Téléphone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">WhatsApp</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Adresse</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Adresse</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Ville</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Province</label>
                <input
                  type="text"
                  value={settings.province}
                  onChange={(e) => setSettings({ ...settings, province: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Code Postal</label>
              <input
                type="text"
                value={settings.postal_code}
                onChange={(e) => setSettings({ ...settings, postal_code: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Heures d'ouverture</h2>
          <div className="space-y-3">
            {Object.entries(settings.hours).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1A1A1A] capitalize w-24">{day}</span>
                <input
                  type="text"
                  value={hours}
                  onChange={(e) => setSettings({ ...settings, hours: { ...settings.hours, [day]: e.target.value } })}
                  className="flex-1 px-3 py-2 border border-[#E8E4DD] rounded-xl text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Livraison</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Seuil de livraison gratuite ($)</label>
              <input
                type="number"
                value={settings.delivery_threshold}
                onChange={(e) => setSettings({ ...settings, delivery_threshold: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Message livraison gratuite</label>
              <input
                type="text"
                value={settings.free_delivery_message}
                onChange={(e) => setSettings({ ...settings, free_delivery_message: e.target.value })}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Texte de cueillette</label>
              <textarea
                value={settings.pickup_text}
                onChange={(e) => setSettings({ ...settings, pickup_text: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Informations de paiement</label>
              <textarea
                value={settings.payment_info}
                onChange={(e) => setSettings({ ...settings, payment_info: e.target.value })}
                rows={2}
                className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Réseaux Sociaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Facebook</label>
            <input
              type="text"
              value={settings.social?.facebook || ""}
              onChange={(e) => setSettings({ ...settings, social: { ...settings.social, facebook: e.target.value } })}
              className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Instagram</label>
            <input
              type="text"
              value={settings.social?.instagram || ""}
              onChange={(e) => setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })}
              className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-[#2D5A3D] text-white font-semibold rounded-xl hover:bg-[#234a31] transition-colors disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
      </button>
    </div>
  );
}
