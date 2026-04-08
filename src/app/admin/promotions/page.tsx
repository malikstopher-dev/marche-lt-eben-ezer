"use client";

import { useState, useEffect } from "react";
import { adminService, Promotion } from "../lib/adminService";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await adminService.getPromotions();
      setPromotions(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!editingPromotion) return;
    
    let updated: Promotion[];
    if (isAdding) {
      updated = [...promotions, { ...editingPromotion, id: `promo-${Date.now()}` }];
    } else {
      updated = promotions.map(p => p.id === editingPromotion.id ? editingPromotion : p);
    }
    
    await adminService.savePromotions(updated);
    setPromotions(updated);
    setEditingPromotion(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette promotion?")) return;
    const updated = promotions.filter(p => p.id !== id);
    await adminService.savePromotions(updated);
    setPromotions(updated);
  };

  const handleToggle = async (promo: Promotion) => {
    const updated = await adminService.updatePromotion(promo.id, { active: !promo.active });
    if (updated) {
      setPromotions(promotions.map(p => p.id === promo.id ? updated : p));
    }
  };

  const emptyPromotion: Promotion = { id: "", title: "", subtitle: "", active: true, discount_percent: 0 };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E8E4DD] p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[#E8E4DD] rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Promotions</h1>
          <p className="text-[#6B6B6B]">{promotions.length} promotions</p>
        </div>
        <button
          onClick={() => { setEditingPromotion(emptyPromotion); setIsAdding(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B8962E] text-white font-medium rounded-xl hover:bg-[#9A7F26]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div key={promo.id} className={`bg-white rounded-2xl border-2 overflow-hidden ${promo.active ? 'border-[#B8962E]' : 'border-[#E8E4DD]'}`}>
            <div className={`p-6 ${promo.active ? 'bg-[#B8962E]' : 'bg-[#F5F2ED]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-semibold ${promo.active ? 'text-white' : 'text-[#1A1A1A]'}`}>{promo.title}</h3>
                  {promo.subtitle && <p className={`text-sm ${promo.active ? 'text-white/80' : 'text-[#6B6B6B]'}`}>{promo.subtitle}</p>}
                </div>
                <button
                  onClick={() => handleToggle(promo)}
                  className={`px-3 py-1 text-sm rounded-full ${promo.active ? 'bg-white text-[#B8962E]' : 'bg-[#6B6B6B]/10 text-[#6B6B6B]'}`}
                >
                  {promo.active ? "Active" : "Inactive"}
                </button>
              </div>
            </div>
            <div className="p-6">
              {promo.discount_percent && (
                <div className="text-3xl font-bold text-[#B8962E] mb-4">{promo.discount_percent}%</div>
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => { setEditingPromotion(promo); setIsAdding(false); }}
                  className="p-2 text-[#2D5A3D] hover:bg-[#2D5A3D]/10 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="p-2 text-[#C41E3A] hover:bg-[#C41E3A]/10 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPromotion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              {isAdding ? "Nouvelle Promotion" : "Modifier la Promotion"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Titre</label>
                <input
                  type="text"
                  value={editingPromotion.title}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Sous-titre</label>
                <input
                  type="text"
                  value={editingPromotion.subtitle}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Pourcentage de réduction</label>
                <input
                  type="number"
                  value={editingPromotion.discount_percent}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, discount_percent: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingPromotion.active}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, active: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm font-medium text-[#1A1A1A]">Promotion active</span>
              </label>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleSave} className="flex-1 py-3 bg-[#B8962E] text-white font-medium rounded-xl hover:bg-[#9A7F26]">
                Enregistrer
              </button>
              <button onClick={() => { setEditingPromotion(null); setIsAdding(false); }} className="flex-1 py-3 bg-[#F5F2ED] text-[#1A1A1A] font-medium rounded-xl">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
