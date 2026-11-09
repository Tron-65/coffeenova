import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, Search, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface InventoryViewProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onOpenManager: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onUpdateStock,
  onOpenManager,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Alert Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-600" />
            <span>Suivi des Stocks en Temps Réel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Surveillance automatique des niveaux d'inventaire et alertes de rupture de stock.
          </p>
        </div>

        <button
          onClick={onOpenManager}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Gérer le Catalogue</span>
        </button>
      </div>

      {/* Alert Warning Box if low stock items exist */}
      {lowStockProducts.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-5 flex items-start gap-4">
          <div className="p-3 bg-rose-500 text-white rounded-2xl animate-bounce">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Alerte Rupture de Stock Imminente ({lowStockProducts.length} article(s))
            </h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
              Les produits suivants ont atteint ou dépassé leur seuil critique d'inventaire :{' '}
              <span className="font-bold">{lowStockProducts.map((p) => p.name).join(', ')}</span>.
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filtrer l'inventaire..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
        />
      </div>

      {/* Inventory Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-amber-50/50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase">
                <th className="p-4">Produit</th>
                <th className="p-4">Catégorie</th>
                <th className="p-4">Prix Unitaire</th>
                <th className="p-4">Stock Actuel</th>
                <th className="p-4">Seuil Alerte</th>
                <th className="p-4">Statut</th>
                <th className="p-4 text-right">Actions Rapides (Réassort)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredProducts.map((product) => {
                const isLow = product.stock <= product.minStock;
                const isOutOfStock = product.stock <= 0;

                return (
                  <tr key={product.id} className="hover:bg-amber-50/20 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <span className="text-2xl p-2 bg-amber-50 dark:bg-slate-800 rounded-xl">{product.image}</span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{product.name}</p>
                        {product.popular && <span className="text-[10px] text-amber-600 font-semibold">Populaire</span>}
                      </div>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-400">{product.category}</td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">{product.price} DZD</td>

                    <td className="p-4 font-extrabold text-slate-900 dark:text-white">{product.stock} unités</td>

                    <td className="p-4 text-slate-500">{product.minStock} unités</td>

                    <td className="p-4">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          Rupture
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Stock Faible</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          Normal
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onUpdateStock(product.id, Math.max(0, product.stock - 5))}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold"
                          title="Retirer 5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => onUpdateStock(product.id, product.stock + 10)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1"
                          title="Réapprovisionner +10"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>+10</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
