import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, Zap } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useStore();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="p-20 text-center">Product not found</div>;
  }

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-slate-900 mb-6 transition">
        <ArrowLeft size={18} className="mr-1" /> Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-lg group relative cursor-zoom-in">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-150 origin-center"
                />
                 <div className="absolute inset-0 pointer-events-none border-4 border-transparent group-hover:border-yellow-400/20 transition-all rounded-3xl"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-gray-100 overflow-hidden cursor-pointer hover:ring-2 ring-yellow-400">
                        <img src={`https://picsum.photos/200/200?random=${parseInt(product.id) * 10 + i}`} className="w-full h-full object-cover" alt="Variant" />
                    </div>
                ))}
            </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                     <span className="text-yellow-600 font-bold text-sm tracking-wider uppercase">{product.category}</span>
                     <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-2">{product.name}</h1>
                     <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
                        </div>
                        <span>({product.stock} in stock)</span>
                     </div>
                </div>
                <div className="text-3xl font-bold text-slate-900">৳{product.price.toLocaleString()}</div>
            </div>
          
            <p className="text-gray-600 leading-relaxed mb-8">
                {product.description}
            </p>

            <div className="space-y-6 flex-grow">
                {/* Variant Selector (Mock) */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Size</h3>
                    <div className="flex gap-3">
                        {['S', 'M', 'L', 'XL'].map(size => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold transition ${selectedSize === size ? 'border-yellow-400 bg-yellow-50 text-slate-900' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span> {feature}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
                >
                    <ShoppingCart size={20} /> Add to Cart
                </button>
                 <button 
                    onClick={handleBuyNow}
                    className="px-6 py-4 border-2 border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-yellow-50 hover:border-yellow-400 transition flex items-center gap-2"
                >
                    <Zap size={20} className="text-yellow-500" /> Buy Now
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Truck size={16} /> Free Delivery & Returns
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={16} /> 2 Year Warranty
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};