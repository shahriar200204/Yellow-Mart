import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, currentUser, placeOrder } = useStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/customer-auth');
      return;
    }
    
    // Process Checkout
    placeOrder(currentUser.name, currentUser.email);
    navigate('/my-account');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything yet. Discover our latest products and start shopping!</p>
        <Link to="/" className="inline-block bg-yellow-400 text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-500 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>
                <div className="font-bold text-slate-900 mt-2">৳{item.price.toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100 text-gray-600 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 text-gray-600 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>৳{(cartTotal * 0.05).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-xl text-slate-900">
                <span>Total</span>
                <span>৳{(cartTotal * 1.05).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-yellow-400 text-slate-900 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition shadow-lg flex items-center justify-center gap-2"
            >
              {currentUser ? 'Place Order' : 'Login to Checkout'} <ArrowRight size={20} />
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
                Secure Encrypted Checkout via Stripe / SSLCommerz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};