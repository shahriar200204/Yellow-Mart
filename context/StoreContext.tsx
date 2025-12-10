import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, UserRole, Order } from '../types';

// Fallback Mock Data (Used if Backend is offline)
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Yellow Mart Pro Headphones',
    price: 12500,
    category: 'Electronics',
    description: 'High-fidelity noise cancelling headphones with 40h battery life.',
    image: 'https://picsum.photos/400/400?random=1',
    rating: 4.8,
    stock: 45,
    features: ['Noise Cancellation', 'Bluetooth 5.3', 'Fast Charging']
  },
  {
    id: '2',
    name: 'Urban Runner Sneakers',
    price: 4500,
    category: 'Fashion',
    description: 'Lightweight, breathable running shoes for the modern athlete.',
    image: 'https://picsum.photos/400/400?random=2',
    rating: 4.5,
    stock: 120,
    features: ['Memory Foam', 'Breathable Mesh', 'Non-slip Sole']
  },
  {
    id: '3',
    name: 'Smart Watch Series Y',
    price: 8500,
    category: 'Electronics',
    description: 'Track your fitness, sleep, and notifications on the go.',
    image: 'https://picsum.photos/400/400?random=3',
    rating: 4.9,
    stock: 15,
    features: ['ECG Monitor', 'Water Resistant', 'Always-on Display']
  },
  {
    id: '4',
    name: 'Vintage Denim Jacket',
    price: 3200,
    category: 'Fashion',
    description: 'Classic style meets modern comfort. 100% cotton.',
    image: 'https://picsum.photos/400/400?random=4',
    rating: 4.2,
    stock: 8,
    features: ['Premium Denim', 'Unisex Fit', 'Vintage Wash']
  },
   {
    id: '5',
    name: '4K Drone Camera',
    price: 45000,
    category: 'Electronics',
    description: 'Professional grade drone with 3-axis gimbal and 4K video.',
    image: 'https://picsum.photos/400/400?random=5',
    rating: 4.9,
    stock: 5,
    features: ['4K 60fps', '30min Flight Time', 'Obstacle Avoidance']
  },
  {
    id: '6',
    name: 'Ergonomic Office Chair',
    price: 15000,
    category: 'Furniture',
    description: 'Work in comfort with lumbar support and adjustable height.',
    image: 'https://picsum.photos/400/400?random=6',
    rating: 4.7,
    stock: 22,
    features: ['Lumbar Support', 'Mesh Back', '360 Swivel']
  }
];

interface CustomerUser {
  name: string;
  email: string;
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, customerEmail: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  cartTotal: number;
  currentUser: CustomerUser | null;
  loginCustomer: (name: string, email: string) => void;
  logoutCustomer: () => void;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Products from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        if (data.length === 0) {
            // If DB is empty, seed it with mock data (First run convenience)
            await seedDatabase();
        } else {
            setProducts(data);
        }
      } catch (error) {
        console.warn('Backend disconnected. Using Mock Data.', error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const seedDatabase = async () => {
      try {
        const response = await fetch(`${API_URL}/products/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(MOCK_PRODUCTS)
        });
        const data = await response.json();
        setProducts(data);
      } catch (e) {
          console.error("Seeding failed", e);
          setProducts(MOCK_PRODUCTS);
      }
  };

  // Fetch Orders when user changes or role changes
  useEffect(() => {
      const fetchOrders = async () => {
          try {
              let url = '';
              if (userRole === UserRole.ADMIN) {
                  url = `${API_URL}/orders`;
              } else if (currentUser) {
                  url = `${API_URL}/orders/user/${currentUser.email}`;
              } else {
                  return;
              }

              const response = await fetch(url);
              if (response.ok) {
                  const data = await response.json();
                  setOrders(data);
              }
          } catch (error) {
              console.warn("Could not fetch orders", error);
          }
      };

      if (!isLoading) {
        fetchOrders();
      }
  }, [userRole, currentUser, isLoading]);


  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (customerName: string, customerEmail: string) => {
    if (cart.length === 0) return;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.random() * 26)}`,
      customerName,
      customerEmail,
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.05,
      date: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, day: 'numeric', month: 'short' }),
      status: 'Placed'
    };

    // Optimistic Update
    setOrders(prev => [newOrder as Order, ...prev]);
    clearCart();

    // Send to Backend
    try {
        await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        });
    } catch (error) {
        console.error("Failed to save order to backend", error);
    }
  };

  const loginCustomer = (name: string, email: string) => {
    setCurrentUser({ name, email });
    setUserRole(UserRole.CUSTOMER);
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    setOrders([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      userRole,
      setUserRole,
      cartTotal,
      currentUser,
      loginCustomer,
      logoutCustomer,
      isLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};