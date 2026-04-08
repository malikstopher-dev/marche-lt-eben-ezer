"use client";

import { useState, useEffect } from "react";
import { adminService, Category } from "../lib/adminService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await adminService.getCategories();
      setCategories(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!editingCategory) return;
    
    let updated: Category[];
    if (isAdding) {
      updated = [...categories, { ...editingCategory, id: `cat-${Date.now()}` }];
    } else {
      updated = categories.map(c => c.id === editingCategory.id ? editingCategory : c);
    }
    
    await adminService.saveCategories(updated);
    setCategories(updated);
    setEditingCategory(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie?")) return;
    const updated = categories.filter(c => c.id !== id);
    await adminService.saveCategories(updated);
    setCategories(updated);
  };

  const emptyCategory: Category = { id: "", name: "", slug: "", description: "", featured: false };

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
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Catégories</h1>
          <p className="text-[#6B6B6B]">{categories.length} catégories</p>
        </div>
        <button
          onClick={() => { setEditingCategory(emptyCategory); setIsAdding(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D5A3D] text-white font-medium rounded-xl hover:bg-[#234a31]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle Catégorie
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E4DD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F2ED]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Slug</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#1A1A1A]">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DD]">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-[#F5F2ED]">
                  <td className="px-4 py-3 font-medium text-[#1A1A1A]">{category.name}</td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{category.slug}</td>
                  <td className="px-4 py-3 text-[#6B6B6B]">{category.description}</td>
                  <td className="px-4 py-3">
                    {category.featured && (
                      <span className="px-2 py-1 bg-[#B8962E]/10 text-[#B8962E] text-xs rounded-full">Vedette</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingCategory(category); setIsAdding(false); }}
                        className="p-2 text-[#2D5A3D] hover:bg-[#2D5A3D]/10 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-[#C41E3A] hover:bg-[#C41E3A]/10 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              {isAdding ? "Nouvelle Catégorie" : "Modifier la Catégorie"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Nom</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Description</label>
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[#E8E4DD] rounded-xl"
                />
              </div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editingCategory.featured}
                  onChange={(e) => setEditingCategory({ ...editingCategory, featured: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <span className="text-sm font-medium text-[#1A1A1A]">Catégorie en vedette</span>
              </label>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleSave} className="flex-1 py-3 bg-[#2D5A3D] text-white font-medium rounded-xl hover:bg-[#234a31]">
                Enregistrer
              </button>
              <button onClick={() => { setEditingCategory(null); setIsAdding(false); }} className="flex-1 py-3 bg-[#F5F2ED] text-[#1A1A1A] font-medium rounded-xl">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
