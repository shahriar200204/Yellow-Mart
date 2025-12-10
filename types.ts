export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
  stock: number;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  date: string;
  total: number;
  status: 'Placed' | 'Processing' | 'Shipped' | 'Out_for_Delivery' | 'Delivered';
}

export interface SalesData {
  name: string;
  sales: number;
  visitors: number;
}

export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}