import React from 'react';
import { BarChart3, TrendingUp, ShoppingBag, Banknote, CreditCard, Smartphone, Calendar, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { Order, Product } from '../types';

interface StatsViewProps {
  orders: Order[];
  products: Product[];
}

export const StatsView: React.FC<StatsViewProps> = ({ orders, products }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;

  const cashTotal = orders.filter((o) => o.paymentMethod === 'cash').reduce((s, o) => s + o.totalAmount, 0);
  const cardTotal = orders.filter((o) => o.paymentMethod === 'card').reduce((s, o) => s + o.totalAmount, 0);
  const mobileTotal = orders.filter((o) => o.paymentMethod === 'mobile').reduce((s, o) => s + o.totalAmount, 0);

  // Compute product sales ranking
  const productSalesMap: { [name: string]: { qty: number; revenue: number } } = {};
  orders.forEach((ord) => {
    ord.items.forEach((item) => {
      if (!productSalesMap[item.name]) {
        productSalesMap[item.name] = { qty: 0, revenue: 0 };
      }
      productSalesMap[item.name].qty += item.quantity;
      productSalesMap[item.name].revenue += item.price * item.quantity;
    });
  });

  const rankedProducts = Object.entries(productSalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty);

  // Weekly trend data comparison
  const weeklyData = [
    { day: 'Lun', ventes: 18500, commandes: 42 },
    { day: 'Mar', ventes: 22000, commandes: 55 },
    { day: 'Mer', ventes: 19800, commandes: 48 },
    { day: 'Jeu', ventes: 25400, commandes: 62 },
    { day: 'Ven', ventes: 31200, commandes: 78 },
    { day: 'Sam', ventes: 38900, commandes: 95 },
    { day: 'Dim', ventes: totalRevenue > 0 ? totalRevenue : 14200, commandes: totalOrders > 0 ? totalOrders : 34 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-600" />
            <span>Statistiques & Tendances des Ventes</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Analyse comparative des performances journalières et hebdomadaires de la cafétéria.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 dark:bg-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold text-amber-800 dark:text-amber-300">
          <Calendar className="w-4 h-4" />
          <span>Aujourd'hui, {new Date().toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-3xl p-6 shadow-lg shadow-amber-500/20">
          <div className="flex items-center justify-between opacity-80 mb-4">
            <span className="text-xs uppercase font-bold tracking-wider">Chiffre d'Affaires</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold">{totalRevenue.toLocaleString()} DZD</div>
          <p className="text-xs opacity-90 mt-1">Total encaissé aujourd'hui</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-amber-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs uppercase font-bold tracking-wider">Total Commandes</span>
            <ShoppingBag className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalOrders}</div>
          <p className="text-xs text-slate-500 mt-1">Tickets de caisse validés</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-amber-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs uppercase font-bold tracking-wider">Panier Moyen</span>
            <BarChart3 className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString() : 0} DZD
          </div>
          <p className="text-xs text-slate-500 mt-1">Par commande en moyenne</p>
        </div>
      </div>

      {/* Recharts Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Tendance du Chiffre d'Affaires Hebdomadaire (DZD)</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="ventes" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorVentes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Orders Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>Volume de Commandes par Jour</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="commandes" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 rounded-2xl">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Paiement Espèces</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{cashTotal.toLocaleString()} DZD</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 dark:bg-blue-950/50 rounded-2xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">TPE Carte Bancaire</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{cardTotal.toLocaleString()} DZD</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 flex items-center gap-4">
          <div className="p-4 bg-purple-50 text-purple-600 dark:bg-purple-950/50 rounded-2xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Mobile Pay</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{mobileTotal.toLocaleString()} DZD</div>
          </div>
        </div>
      </div>

      {/* Best-Selling Products Ranking */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Classement des Ventes par Produit</span>
        </h3>
        {rankedProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-xs">Aucune vente enregistrée aujourd'hui pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rankedProducts.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">{item.qty} unités vendues</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">
                    {item.revenue.toLocaleString()} DZD
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
