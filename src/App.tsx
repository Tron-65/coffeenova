import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { POSView } from './components/POSView';
import { TablesView } from './components/TablesView';
import { InventoryView } from './components/InventoryView';
import { StatsView } from './components/StatsView';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductManagerModal } from './components/ProductManagerModal';
import { HistoryView } from './components/HistoryView';
import { INITIAL_PRODUCTS } from './mockData';
import { Product, OrderItem, OrderType, Order, TableTab } from './types';
import { auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pos' | 'tables' | 'inventory' | 'stats' | 'history'>('pos');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('cafenova_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cafenova_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [tableTabs, setTableTabs] = useState<TableTab[]>(() => {
    const saved = localStorage.getItem('cafenova_table_tabs');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderType, setOrderType] = useState<OrderType>('individual');
  const [activeTableNumber, setActiveTableNumber] = useState<string>('1');
  const [currentCart, setCurrentCart] = useState<OrderItem[]>([]);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('cafenova_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cafenova_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cafenova_table_tabs', JSON.stringify(tableTabs));
  }, [tableTabs]);

  // Auth listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    if (!auth) {
      alert("Mode hors-ligne / stock local actif (Firebase non configuré).");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCurrentCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Cannot exceed stock
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCurrentCart((prev) => {
      return prev
        .map((item) => {
          if (item.productId === productId) {
            const product = products.find((p) => p.id === productId);
            const maxStock = product ? product.stock : 999;
            const newQty = item.quantity + delta;
            if (newQty > maxStock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const removeItem = (productId: string) => {
    setCurrentCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCurrentCart([]);
  };

  // Save current cart as table tab (Mode Table)
  const saveTableTab = () => {
    if (currentCart.length === 0) return;
    const totalAmount = currentCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setTableTabs((prev) => {
      const existingIndex = prev.findIndex((t) => t.tableNumber === activeTableNumber);
      if (existingIndex >= 0) {
        // Merge items
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          items: currentCart,
          totalAmount,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `tab_${Date.now()}`,
          tableNumber: activeTableNumber,
          items: currentCart,
          totalAmount,
          openedAt: nowStr,
        },
      ];
    });

    setCurrentCart([]);
    setActiveTab('tables');
  };

  // Checkout confirmation
  const handleConfirmCheckout = (paymentMethod: 'cash' | 'card' | 'mobile', cashGiven: number) => {
    const totalAmount = currentCart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      items: currentCart,
      totalAmount,
      paymentMethod,
      type: orderType,
      tableNumber: orderType === 'table' ? activeTableNumber : undefined,
      cashierId: user?.uid || 'cashier_local',
      cashierName: user?.displayName || 'Caissier Principal',
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    // Deduct stock in real-time
    setProducts((prevProducts) => {
      let updated = [...prevProducts];
      currentCart.forEach((cartItem) => {
        updated = updated.map((p) => {
          if (p.id === cartItem.productId) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
          }
          return p;
        });
      });
      return updated;
    });

    setOrders((prev) => [newOrder, ...prev]);

    // If orderType was table, remove from table tabs
    if (orderType === 'table') {
      setTableTabs((prev) => prev.filter((t) => t.tableNumber !== activeTableNumber));
    }

    setCurrentCart([]);
  };

  // Table management actions
  const handleSelectTableTab = (tableNum: string) => {
    setActiveTableNumber(tableNum);
    setOrderType('table');
    const existing = tableTabs.find((t) => t.tableNumber === tableNum);
    if (existing) {
      setCurrentCart(existing.items);
    } else {
      setCurrentCart([]);
    }
    setActiveTab('pos');
  };

  const handleCheckoutTableTab = (tabId: string) => {
    const tab = tableTabs.find((t) => t.id === tabId);
    if (!tab) return;
    setActiveTableNumber(tab.tableNumber);
    setOrderType('table');
    setCurrentCart(tab.items);
    setIsCheckoutOpen(true);
  };

  const handleDeleteTableTab = (tabId: string) => {
    setTableTabs((prev) => prev.filter((t) => t.id !== tabId));
  };

  // Stock update from inventory view
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p)));
  };

  // Product manager actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const totalCartAmount = currentCart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-amber-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        products={products}
        orders={orders}
        onOpenManager={() => setIsManagerOpen(true)}
        user={user}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
      />

      <main className="flex-1 pb-12">
        {activeTab === 'pos' && (
          <POSView
            products={products}
            orderType={orderType}
            setOrderType={setOrderType}
            activeTableNumber={activeTableNumber}
            setActiveTableNumber={setActiveTableNumber}
            currentCart={currentCart}
            addToCart={addToCart}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            clearCart={clearCart}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onQuickCheckout={() => {
              if (currentCart.length === 0) return;
              handleConfirmCheckout('cash', totalCartAmount);
            }}
            tableTabs={tableTabs}
            saveTableTab={saveTableTab}
          />
        )}

        {activeTab === 'tables' && (
          <TablesView
            tableTabs={tableTabs}
            onSelectTableTab={handleSelectTableTab}
            onCheckoutTableTab={handleCheckoutTableTab}
            onDeleteTableTab={handleDeleteTableTab}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            products={products}
            onUpdateStock={handleUpdateStock}
            onOpenManager={() => setIsManagerOpen(true)}
          />
        )}

        {activeTab === 'stats' && <StatsView orders={orders} products={products} />}
        {activeTab === 'history' && <HistoryView orders={orders} />}
      </main>

      {/* Mobile Native Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-amber-100 dark:border-slate-800 grid grid-cols-5 items-center h-16 px-2 shadow-lg">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'pos' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <span className="text-xl">☕</span>
          <span className="text-[10px] mt-0.5">Caisse</span>
        </button>
        <button
          onClick={() => setActiveTab('tables')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'tables' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <span className="text-xl">🪑</span>
          <span className="text-[10px] mt-0.5">Tables</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${activeTab === 'inventory' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <span className="text-xl">📦</span>
          <span className="text-[10px] mt-0.5">Stocks</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'stats' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <span className="text-xl">📊</span>
          <span className="text-[10px] mt-0.5">Stats</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${activeTab === 'history' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <span className="text-xl">📜</span>
          <span className="text-[10px] mt-0.5">Historique</span>
        </button>
      </nav>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={currentCart}
        totalAmount={totalCartAmount}
        orderType={orderType}
        tableNumber={activeTableNumber}
        onConfirmCheckout={handleConfirmCheckout}
      />

      {/* Product & Price Manager Modal */}
      <ProductManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}
