import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Check, Save } from 'lucide-react';
import { Product } from '../types';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Boissons Chaudes' | 'Boissons Fraîches' | 'Pâtisserie'>('Boissons Chaudes');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('10');
  const [image, setImage] = useState('☕');
  const [popular, setPopular] = useState(false);

  if (!isOpen) return null;

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price.toString());
    setStock(p.stock.toString());
    setMinStock(p.minStock.toString());
    setImage(p.image);
    setPopular(p.popular);
  };

  const handleResetForm = () => {
    setEditingId(null);
    setName('');
    setCategory('Boissons Chaudes');
    setPrice('');
    setStock('');
    setMinStock('10');
    setImage('☕');
    setPopular(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    const productData: Product = {
      id: editingId || `p_${Date.now()}`,
      name,
      category,
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      minStock: parseInt(minStock, 10) || 10,
      image,
      icon: 'Coffee',
      popular,
    };

    if (editingId) {
      onUpdateProduct(productData);
    } else {
      onAddProduct(productData);
    }

    handleResetForm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-amber-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Gestion du Catalogue & Tarifs</h3>
            <p className="text-xs text-slate-500">Modifiez les prix, les stocks et ajoutez de nouveaux produits en temps réel.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Column */}
          <form onSubmit={handleSave} className="lg:col-span-5 space-y-4 bg-amber-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-amber-100 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              {editingId ? 'Modifier le Produit' : 'Ajouter un Produit'}
            </h4>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Nom du produit</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Café Noir"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="Boissons Chaudes">Boissons Chaudes</option>
                <option value="Boissons Fraîches">Boissons Fraîches</option>
                <option value="Pâtisserie">Pâtisserie</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Prix (DZD)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="100"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Stock Initial</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Emoji / Icône</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="☕"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">Seuil Alerte</label>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  placeholder="10"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="popularCheck"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <label htmlFor="popularCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Mettre en vedette (Populaire)
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="py-2.5 px-4 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Mettre à jour' : 'Ajouter au Catalogue'}</span>
              </button>
            </div>
          </form>

          {/* Products List Column */}
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Produits Existants ({products.length})</h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl flex items-center justify-between gap-3 border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs">{p.image}</span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</h5>
                      <p className="text-[10px] text-slate-400">
                        {p.category} · <span className="text-amber-700 dark:text-amber-400 font-bold">{p.price} DZD</span> · Stock: {p.stock}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="p-2 rounded-xl bg-amber-100 text-amber-800 dark:bg-slate-800 dark:text-amber-300 hover:bg-amber-200"
                      title="Modifier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
