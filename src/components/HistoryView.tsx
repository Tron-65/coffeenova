import React, { useState } from 'react';
import { History, Search, Calendar, ChevronLeft, ChevronRight, CheckCircle, Banknote, CreditCard, Smartphone, User } from 'lucide-react';
import { Order } from '../types';

interface HistoryViewProps {
  orders: Order[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.createdAt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.tableNumber && order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.cashierName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-purple-500" />;
      default:
        return <Banknote className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-amber-600" />
            <span>Historique des Transactions</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Traçabilité complète de toutes les ventes passées avec recherche par ID, date ou table.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par ID, date, table..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 overflow-hidden">
        {paginatedOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center">
            <History className="w-12 h-12 stroke-1 mb-3 text-amber-300" />
            <p className="text-xs font-semibold">Aucune transaction trouvée</p>
            <p className="text-[11px] text-slate-400 mt-1">Modifiez vos critères de recherche ou effectuez une vente.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedOrders.map((order) => (
              <div key={order.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-amber-50/20 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 rounded-2xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Commande #{order.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        {order.type === 'table' ? `Table ${order.tableNumber}` : 'Individuel'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleString('fr-FR')}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {order.cashierName}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        {getPaymentIcon(order.paymentMethod)}
                        <span className="capitalize">{order.paymentMethod}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {order.items.map((item, idx) => (
                        <span key={idx} className="text-[11px] bg-amber-50 dark:bg-slate-800 text-amber-900 dark:text-amber-300 px-2.5 py-1 rounded-xl font-medium">
                          {item.quantity}x {item.name} ({item.price * item.quantity} DZD)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 flex md:flex-col items-center md:items-end justify-between">
                  <span className="text-xs text-slate-400">Total payé</span>
                  <span className="text-xl font-extrabold text-amber-800 dark:text-amber-300">
                    {order.totalAmount.toLocaleString()} DZD
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/40 dark:bg-slate-900/80">
            <span className="text-xs text-slate-500">
              Page {currentPage} sur {totalPages} ({filteredOrders.length} transactions)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
