import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, Star, Filter, Search } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, addToCart } = useStore();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Shop Our Collection</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover the latest trends in electronics, fashion, and lifestyle. Quality guaranteed.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            {/* Search */}
            <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-2 ${
                    activeCategory === cat
                      ? "bg-slate-900 text-yellow-400 shadow-md"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat === "All" && <Filter size={14} />}
                  {cat}
                </button>
              ))}
            </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
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
                {product.stock < 10 && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Low Stock
                    </span>
                )}
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
                  <Link to={`/product/${product.id}`} className="text-sm text-indigo-600 hover:underline font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
            <div className="text-center py-20">
                <div className="inline-block p-4 rounded-full bg-yellow-100 mb-4">
                    <Search size={40} className="text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                <button onClick={() => {setSearchQuery(""); setActiveCategory("All")}} className="mt-4 text-indigo-600 font-bold hover:underline">Clear Filters</button>
            </div>
        )}
      </div>
    </div>
  );
};