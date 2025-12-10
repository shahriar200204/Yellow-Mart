import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LayoutDashboard, User, CheckCircle, LogIn } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { cart, userRole, currentUser } = useStore();
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNewsletterJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000); // Reset after 3 seconds
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header */}
      <nav className="bg-yellow-400 shadow-md sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-xl">Y</span>
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">Yellow Mart</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`text-slate-900 hover:text-white transition font-medium ${location.pathname === '/' ? 'border-b-2 border-slate-900' : ''}`}>Home</Link>
              <Link to="/shop" className={`text-slate-900 hover:text-white transition font-medium ${location.pathname === '/shop' ? 'border-b-2 border-slate-900' : ''}`}>Shop</Link>
              
              {userRole === UserRole.ADMIN && (
                 <Link to="/admin" className="flex items-center gap-1 text-slate-900 hover:text-white transition font-medium bg-yellow-500 px-3 py-1 rounded-full">
                   <LayoutDashboard size={18} /> Admin
                 </Link>
              )}

              <div className="flex items-center gap-4">
                <Link to="/cart" className="relative p-2 text-slate-900 hover:bg-yellow-500 rounded-full transition">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {/* User Link Logic: 
                    - If Admin: go to Admin Dashboard
                    - If Customer Logged In: go to Customer Dashboard
                    - If Guest: go to Customer Login 
                */}
                <Link 
                  to={userRole === UserRole.ADMIN ? "/admin" : (currentUser ? "/my-account" : "/customer-auth")} 
                  className="p-2 text-slate-900 hover:bg-yellow-500 rounded-full transition relative group"
                >
                    <User size={24} />
                    {currentUser && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-yellow-400 rounded-full"></span>
                    )}
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <Link to="/cart" className="relative p-2 text-slate-900">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-900 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-yellow-300 pb-4 shadow-inner">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-yellow-500">Home</Link>
              <Link to="/shop" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-yellow-500">Shop</Link>
               {userRole === UserRole.ADMIN ? (
                 <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-yellow-500">Admin Dashboard</Link>
              ) : currentUser ? (
                 <Link to="/my-account" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-yellow-500">My Account</Link>
              ) : (
                <Link to="/customer-auth" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-yellow-500">Login / Sign Up</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-slate-900 text-white py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
             <h3 className="text-yellow-400 text-lg font-bold mb-4">Yellow Mart</h3>
             <p className="text-gray-400 text-sm">Next-generation e-commerce experience providing quality products with AI-driven support.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
              <li><Link to="/shop" className="hover:text-yellow-400">Shop All</Link></li>
              <li><Link to="/customer-auth" className="hover:text-yellow-400">My Account</Link></li>
              <li><Link to="/login" className="hover:text-yellow-400">Merchant Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Shipping Info</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Newsletter</h4>
            <form onSubmit={handleNewsletterJoin} className="flex flex-col gap-2">
              <div className="flex">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email" 
                  required
                  className="bg-slate-800 text-white px-4 py-2 rounded-l-md focus:outline-none w-full border border-transparent focus:border-yellow-400 transition" 
                />
                <button type="submit" className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-r-md font-bold hover:bg-yellow-500 transition">Join</button>
              </div>
              {isSubscribed && (
                <div className="text-green-400 text-xs flex items-center gap-1 animate-fade-in">
                  <CheckCircle size={12} /> Successfully subscribed!
                </div>
              )}
            </form>
          </div>
        </div>
        <div className="text-center text-gray-600 text-xs mt-8 border-t border-slate-800 pt-8">
          © 2024 Yellow Mart Advanced. All rights reserved.
        </div>
      </footer>
    </div>
  );
};