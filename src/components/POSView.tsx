import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingBag, Coffee, Layers, User, AlertTriangle, Check, X } from 'lucide-react';
import { Product, OrderItem, OrderType, TableTab } from '../types';

interface POSViewProps {
  products: Product[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  activeTableNumber: string;
  setActiveTableNumber: (tbl: string) => void;
  currentCart: OrderItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  onOpenCheckout: () => void;
  onQuickCheckout: () => void;
  tableTabs: TableTab[];
  saveTableTab: () => void;
}

export const POSView: React.FC<POSViewProps> = ({
  products,
  orderType,
  setOrderType,
  activeTableNumber,
  setActiveTableNumber,
  currentCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  onOpenCheckout,
  onQuickCheckout,
  tableTabs,
  saveTableTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [animatingProductId, setAnimatingProductId] = useState<string | null>(null);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const categories = ['Tous', 'Boissons Chaudes', 'Boissons Fraîches', 'Pâtisserie'];

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // AudioContext policy fallback
    }
  };

  const handleProductClick = (product: Product) => {
    if (product.stock <= 0) return;
    playBeep();
    setAnimatingProductId(product.id);
    setTimeout(() => setAnimatingProductId(null), 300);
    addToCart(product);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'Tous' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const popularProducts = products.filter((p) => p.popular);
  const totalAmount = currentCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const tablesList = ['1', '2', '3', '4', '5', '6', 'Terrasse 1', 'Terrasse 2', 'Comptoir'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 py-6">
      {/* Left / Center: Catalog & Popular Products (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Mode Selector & Table selector bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-amber-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto bg-amber-50 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setOrderType('individual')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                orderType === 'individual'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Vente Individuelle</span>
            </button>

            <button
              onClick={() => setOrderType('table')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                orderType === 'table'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Mode Table (Cumul)</span>
            </button>
          </div>

          {orderType === 'table' && (
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Table :</span>
              <select
                value={activeTableNumber}
                onChange={(e) => setActiveTableNumber(e.target.value)}
                className="bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {tablesList.map((tbl) => (
                  <option key={tbl} value={tbl}>
                    Table {tbl}
                  </option>
                ))}
              </select>
              <button
                onClick={saveTableTab}
                className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-slate-800 dark:text-amber-300 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              >
                Garder en attente
              </button>
            </div>
          )}
        </div>

        {/* Popular Products Highlight Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>🔥 Produits Populaires (Accès Rapide)</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularProducts.map((product) => {
              const cartItem = currentCart.find((i) => i.productId === product.id);
              const count = cartItem ? cartItem.quantity : 0;
              const isAnimating = animatingProductId === product.id;
              const liveStock = product.stock - count;

              return (
                <button
                  key={`pop-${product.id}`}
                  onClick={() => handleProductClick(product)}
                  disabled={product.stock <= 0}
                  className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all active:scale-95 ${
                    isAnimating ? 'scale-105 bg-amber-100 dark:bg-amber-950/60 ring-2 ring-amber-500' : ''
                  } ${
                    product.stock <= 0
                      ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                      : 'bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-900 dark:to-slate-900/50 border-amber-200/60 dark:border-slate-800 hover:border-amber-400 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Counter Badge in Corner */}
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-bounce">
                      {count}
                    </span>
                  )}

                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl p-2 bg-amber-100/60 dark:bg-slate-800 rounded-xl">{product.image}</span>
                      {liveStock <= product.minStock && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Stock Faible" />
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
                    <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">
                      {product.price} DZD
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono">
                    <span className="font-bold text-amber-700 dark:text-amber-400">[V: {count}]</span>
                    <span className={liveStock <= 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>[S: {liveStock}]</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Full Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const cartItem = currentCart.find((i) => i.productId === product.id);
              const count = cartItem ? cartItem.quantity : 0;
              const isAnimating = animatingProductId === product.id;
              const liveStock = product.stock - count;

              return (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  disabled={product.stock <= 0}
                  className={`relative flex flex-col justify-between p-4 rounded-3xl border text-left transition-all active:scale-95 group ${
                    isAnimating ? 'scale-105 bg-amber-100 dark:bg-amber-950/60 ring-2 ring-amber-500' : ''
                  } ${
                    product.stock <= 0
                      ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-amber-500 shadow-sm hover:shadow-lg'
                  }`}
                >
                  {/* Counter Badge in Corner */}
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-extrabold w-7 h-7 rounded-full flex items-center justify-center shadow-md animate-bounce">
                      {count}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2.5 bg-amber-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
                        {product.image}
                      </span>
                      {liveStock <= product.minStock && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-rose-50 text-rose-600 dark:bg-rose-950/50 rounded-xl">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Rupture imminente</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">{product.category}</p>
                  </div>

                  <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono">
                    <span className="text-sm font-extrabold text-amber-700 dark:text-amber-400 font-sans">
                      {product.price} DZD
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      [V: {count}]/[S: {liveStock}]
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Order Cart / Tablet Ticket Panel (4 cols on desktop, drawer on mobile) */}
      <div className={`lg:col-span-4 ${isMobileCartOpen ? 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4' : 'hidden lg:flex'}`}>
        <div className={`bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-amber-100 dark:border-slate-800 flex flex-col w-full max-w-md ${isMobileCartOpen ? 'max-h-[85vh]' : 'h-[calc(100vh-8rem)] sticky top-20'}`}>
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {orderType === 'table' ? `Table ${activeTableNumber} (Tab)` : 'Ticket Courant'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {currentCart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vider</span>
                </button>
              )}
              {isMobileCartOpen && (
                <button
                  onClick={() => setIsMobileCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400">
                <Coffee className="w-12 h-12 stroke-1 mb-3 text-amber-300" />
                <p className="text-xs font-semibold">Aucun article sur ce ticket</p>
                <p className="text-[11px] text-slate-400 mt-1">Touchez les produits pour commencer la commande</p>
              </div>
            ) : (
              currentCart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl flex items-center justify-between gap-3 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                      {item.price * item.quantity} DZD <span className="text-[10px] text-slate-400">({item.price} DZD / u)</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="w-7 h-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="w-7 h-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Checkout Action */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-amber-50/40 dark:bg-slate-900/80 rounded-b-3xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Articles totaux :</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {currentCart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Total à Payer :</span>
              <span className="text-xl font-extrabold text-amber-900 dark:text-amber-300">
                {totalAmount.toLocaleString()} DZD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onQuickCheckout}
                disabled={currentCart.length === 0}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all ${
                  currentCart.length === 0
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-[0.98]'
                }`}
              >
                <span>⚡ Vente 1-Clic</span>
              </button>

              <button
                onClick={onOpenCheckout}
                disabled={currentCart.length === 0}
                className={`py-3 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg transition-all ${
                  currentCart.length === 0
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30 active:scale-[0.98]'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Encaisser</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Cart Bar */}
      {currentCart.length > 0 && !isMobileCartOpen && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40 bg-amber-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
              {currentCart.reduce((s, i) => s + i.quantity, 0)}
            </span>
            <span className="text-xs font-bold">Articles au panier</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold">{totalAmount.toLocaleString()} DZD</span>
            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="px-3 py-1.5 bg-white text-amber-900 rounded-xl text-xs font-bold shadow-sm"
            >
              Voir le Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
