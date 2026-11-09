import React, { useState } from 'react';
import { X, CreditCard, Banknote, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderItem, OrderType } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  totalAmount: number;
  orderType: OrderType;
  tableNumber?: string;
  onConfirmCheckout: (paymentMethod: 'cash' | 'card' | 'mobile', cashGiven: number) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  orderType,
  tableNumber,
  onConfirmCheckout,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');
  const [cashGiven, setCashGiven] = useState<string>(totalAmount.toString());
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const numericCash = parseFloat(cashGiven) || 0;
  const change = Math.max(0, numericCash - totalAmount);

  const handleComplete = () => {
    // Trigger confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setSuccess(true);
    setTimeout(() => {
      onConfirmCheckout(paymentMethod, numericCash);
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        {success ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Paiement Validé !</h3>
            <p className="text-sm text-slate-500 mt-1">Encaissement enregistré avec succès.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Encaissement Caisse</h3>
                <p className="text-xs text-slate-500">
                  {orderType === 'table' ? `Table ${tableNumber || '1'}` : 'Vente Individuelle'} · {items.length} article(s)
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-5">
              {/* Total Amount Display */}
              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-2xl text-center border border-amber-200/60 dark:border-amber-900/40">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">Total à Payer</span>
                <div className="text-4xl font-extrabold text-amber-900 dark:text-amber-200 mt-1">
                  {totalAmount.toLocaleString()} <span className="text-lg font-bold">DZD</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">
                  Mode de Paiement
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Banknote className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Espèces</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">TPE Carte</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      paymentMethod === 'mobile'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Mobile Pay</span>
                  </button>
                </div>
              </div>

              {/* Cash Given & Change Calculator */}
              {paymentMethod === 'cash' && (
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Montant reçu (DZD)
                    </label>
                    <input
                      type="number"
                      value={cashGiven}
                      onChange={(e) => setCashGiven(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-500">Monnaie à rendre :</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {change.toLocaleString()} DZD
                    </span>
                  </div>

                  {/* Quick Cash Buttons */}
                  <div className="flex gap-2 pt-1">
                    {[totalAmount, 500, 1000, 2000].map((amt) => {
                      if (amt < totalAmount) return null;
                      return (
                        <button
                          key={amt}
                          onClick={() => setCashGiven(amt.toString())}
                          className="flex-1 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-amber-50"
                        >
                          {amt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="flex-2 py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Confirmer Encaissement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
