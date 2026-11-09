import React from 'react';
import { Coffee, Layers, Package, BarChart3, History, Settings, AlertTriangle, ShieldCheck, User, TrendingUp } from 'lucide-react';
import { Product, Order } from '../types';

interface HeaderProps {
  activeTab: 'pos' | 'tables' | 'inventory' | 'stats' | 'history';
  setActiveTab: (tab: 'pos' | 'tables' | 'inventory' | 'stats' | 'history') => void;
  products: Product[];
  orders: Order[];
  onOpenManager: () => void;
  user: any;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  products,
  orders,
  onOpenManager,
  user,
  onLogin,
  onLogout,
}) => {
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const totalDailyRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-amber-100 dark:border-slate-800 px-4 lg:px-8 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Logo + Live Earnings Notification */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Coffee className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                CaféNova <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">POS</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Caisse & Stock en Temps Réel</p>
            </div>
          </div>

          {/* Live Earnings Notification Pill */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 rounded-2xl shadow-xs">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <div>
              <p className="text-[10px] uppercase font-semibold text-emerald-700 dark:text-emerald-400 leading-tight">CA du Jour</p>
              <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">{totalDailyRevenue.toLocaleString()} DZD</p>
            </div>
          </div>

          {/* Mobile manager & alerts */}
          <div className="flex items-center gap-2 sm:hidden">
            {lowStockCount > 0 && (
              <button
                onClick={() => setActiveTab('inventory')}
                className="relative p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/55"
              >
                <AlertTriangle className="w-5 h-5 animate-bounce" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {lowStockCount}
                </span>
              </button>
            )}
            <button
              onClick={onOpenManager}
              className="p-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-slate-800 dark:text-amber-300"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-amber-50/80 dark:bg-slate-800/80 p-1.5 rounded-2xl w-full sm:w-auto justify-center overflow-x-auto">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'pos'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Caisse POS</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'tables'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mode Tables</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all relative ${
              activeTab === 'inventory'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Stocks</span>
            {lowStockCount > 0 && (
              <span className="ml-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {lowStockCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistiques</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historique</span>
          </button>
        </nav>

        {/* Right Actions: Manager & User Session */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenManager}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-100/60 dark:bg-slate-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-semibold transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Gérer Produits</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
              <span className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                {user.displayName?.[0] || 'C'}
              </span>
              <div className="text-left">
                <p className="text-xs font-bold truncate max-w-[100px]">{user.displayName || 'Caissier'}</p>
                <button onClick={onLogout} className="text-[10px] text-rose-500 hover:underline">Déconnexion</button>
              </div>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Connexion Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
