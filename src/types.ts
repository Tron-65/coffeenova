export interface Product {
  id: string;
  name: string;
  category: 'Boissons Chaudes' | 'Boissons Fraîches' | 'Pâtisserie';
  price: number;
  stock: number;
  minStock: number;
  image: string;
  icon: string;
  popular: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderType = 'individual' | 'table';

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'mobile';
  type: OrderType;
  tableNumber?: string;
  cashierId: string;
  cashierName: string;
  createdAt: string;
  status: 'completed' | 'pending';
}

export interface TableTab {
  id: string;
  tableNumber: string;
  items: OrderItem[];
  totalAmount: number;
  openedAt: string;
  notes?: string;
}
