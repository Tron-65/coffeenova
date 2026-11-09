import React from 'react';
import { Layers, Plus, Trash2, CheckCircle, Clock } from 'lucide-react';
import { TableTab } from '../types';

interface TablesViewProps {
  tableTabs: TableTab[];
  onSelectTableTab: (tableNumber: string) => void;
  onCheckoutTableTab: (tabId: string) => void;
  onDeleteTableTab: (tabId: string) => void;
}

export const TablesView: React.FC<TablesViewProps> = ({
  tableTabs,
  onSelectTableTab,
  onCheckoutTableTab,
  onDeleteTableTab,
}) => {
  const tables = ['1', '2', '3', '4', '5', '6', 'Terrasse 1', 'Terrasse 2', 'Comptoir'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-amber-600" />
            <span>Gestion des Tables & Commandes en Cours</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cumulez les articles par table au fil de la consommation avant l'encaissement global.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((tableNum) => {
          const activeTab = tableTabs.find((t) => t.tableNumber === tableNum);

          return (
            <div
              key={tableNum}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                activeTab
                  ? 'bg-gradient-to-br from-amber-50/80 to-white dark:from-slate-900 dark:to-slate-900 border-amber-300 dark:border-amber-700 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${activeTab ? 'bg-amber-600 animate-pulse' : 'bg-slate-300'}`} />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Table {tableNum}</h3>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                      activeTab
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {activeTab ? 'Occupée' : 'Libre'}
                  </span>
                </div>

                {activeTab ? (
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Ouverte à {activeTab.openedAt}</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl space-y-2 border border-amber-100 dark:border-slate-700">
                      <p className="text-[11px] font-bold text-slate-400 uppercase">Articles commandés ({activeTab.items.reduce((s, i) => s + i.quantity, 0)})</p>
                      {activeTab.items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{item.price * item.quantity} DZD</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-slate-500">Total en cours :</span>
                      <span className="text-lg font-extrabold text-amber-800 dark:text-amber-300">
                        {activeTab.totalAmount.toLocaleString()} DZD
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400">
                    <p className="text-xs">Aucune commande en cours</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {activeTab ? (
                  <>
                    <button
                      onClick={() => onDeleteTableTab(activeTab.id)}
                      className="p-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40"
                      title="Annuler la table"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectTableTab(tableNum)}
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                    >
                      Ajouter articles
                    </button>
                    <button
                      onClick={() => onCheckoutTableTab(activeTab.id)}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Encaisser</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onSelectTableTab(tableNum)}
                    className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ouvrir Table {tableNum}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
