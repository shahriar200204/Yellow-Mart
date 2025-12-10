import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Star, ShoppingCart } from 'lucide-react';

export const Home: React.FC = () => {
  const { products, addToCart } = useStore();
  const navigate = useNavigate();
  
  // Show only first 4 items as "Trending"
  const trendingProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/1920/1080?grayscale')] bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-block bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide">
              New Season Arrival
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Future of <span className="text-yellow-400">Shopping</span> is Here
            </h1>
            <p className="text-lg text-gray-300 max-w-md">
              Experience ultra-fast delivery, AI-powered recommendations, and premium quality products at Yellow Mart.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/shop" className="bg-yellow-400 text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-500 transition shadow-lg shadow-yellow-400/20 flex items-center gap-2">
                Shop Now <ArrowRight size={18} />
              </Link>
              <button className="border border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-full font-semibold transition backdrop-blur-sm">
                Learn More
              </button>
            </div>
          </div>
          {/* Decorative Float */}
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
             <div className="relative">
                <div className="absolute -inset-4 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
                <img 
                    src={products[0]?.image} 
                    alt="Hero Product" 
                    className="relative w-72 h-72 md:w-96 md:h-96 object-cover rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition duration-700 ease-out cursor-pointer"
                    onClick={() => navigate(`/product/${products[0]?.id}`)}
                />
             </div>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-yellow-50 py-12 border-b border-yellow-100">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">🚀 Next-Day Delivery</h3>
                  <p className="text-gray-600">Free shipping on orders over ৳5000 with real-time tracking.</p>
              </div>
              <div className="p-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">🛡️ Secure Payment</h3>
                  <p className="text-gray-600">100% secure payment with Stripe and SSLCommerz integration.</p>
              </div>
              <div className="p-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">🤖 AI Support 24/7</h3>
                  <p className="text-gray-600">Our advanced Gemini AI helps you find exactly what you need.</p>
              </div>
          </div>
      </div>

      {/* Featured Products Preview */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
                Trending Now
            </h2>
            <Link to="/shop" className="text-slate-900 font-bold hover:text-yellow-600 flex items-center gap-1">
                View All <ArrowRight size={16} />
            </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col overflow-hidden">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
                <button 
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-yellow-400 text-slate-900 p-3 rounded-full shadow-lg translate-y-20 group-hover:translate-y-0 transition duration-300 hover:bg-yellow-500"
                >
                    <ShoppingCart size={20} />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                <Link to={`/product/${product.id}`} className="text-lg font-bold text-slate-900 mb-1 hover:text-yellow-600 transition truncate">
                  {product.name}
                </Link>
                <div className="flex items-center mb-2">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900">৳{product.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};