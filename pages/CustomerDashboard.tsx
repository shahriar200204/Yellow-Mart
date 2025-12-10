import React from 'react';
import { useStore } from '../context/StoreContext';
import { Navigate, Link } from 'react-router-dom';
import { Package, MapPin, LogOut, Check, ShoppingBag } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, logoutCustomer, orders } = useStore();

  if (!currentUser) {
    return <Navigate to="/customer-auth" replace />;
  }

  // Get orders for the current user
  const userOrders = orders.filter(o => o.customerEmail === currentUser.email);
  const activeOrder = userOrders.length > 0 ? userOrders[0] : null;

  const steps = [
    { label: 'Order Placed', status: 'Placed' },
    { label: 'Processing', status: 'Processing' },
    { label: 'Shipped', status: 'Shipped' },
    { label: 'Out for Delivery', status: 'Out_for_Delivery' },
    { label: 'Delivered', status: 'Delivered' }
  ];

  // Helper to determine step status
  const getStepIndex = (status: string) => {
    return steps.findIndex(s => s.status === status);
  };

  const currentStepIndex = activeOrder ? getStepIndex(activeOrder.status) : -1;

  // Calculate progress bar width
  const progressWidth = activeOrder 
    ? Math.min(100, (currentStepIndex / (steps.length - 1)) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
          <p className="text-gray-500">Welcome back, {currentUser.name}</p>
        </div>
        <button 
          onClick={logoutCustomer}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition border border-red-100"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{currentUser.name}</h3>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Shipping Address</p>
                  <p className="text-sm">House 12, Road 5, Dhanmondi</p>
                  <p className="text-sm">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Tracking */}
        <div className="lg:col-span-2">
            {!activeOrder ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No active orders</h3>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                    <Link to="/" className="inline-block bg-yellow-400 text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-500 transition">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Package className="text-yellow-500" /> Live Order Tracking
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">Order ID: #{activeOrder.id}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full animate-pulse uppercase tracking-wide">
                            {activeOrder.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                    
                    <div className="p-8">
                        {/* Stepper */}
                        <div className="relative mb-12">
                            {/* Background Line */}
                            <div className="absolute left-0 top-4 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                            
                            {/* Active Progress Line */}
                            <div 
                                className="absolute left-0 top-4 transform -translate-y-1/2 h-1 bg-yellow-400 -z-10 transition-all duration-1000 ease-in-out" 
                                style={{ width: `${progressWidth}%` }} 
                            ></div>
                            
                            <div className="flex justify-between w-full">
                                {steps.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    
                                    return (
                                        <div key={index} className="flex flex-col items-center flex-1">
                                            <div 
                                                className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                                                    isCompleted 
                                                    ? 'bg-yellow-400 border-yellow-400 text-slate-900' 
                                                    : 'bg-white border-gray-200 text-gray-300'
                                                } ${isCurrent ? 'ring-4 ring-yellow-200 scale-110' : ''}`}
                                            >
                                                {isCompleted ? <Check size={14} strokeWidth={4} /> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>}
                                            </div>
                                            <div className="text-center mt-4 hidden sm:block">
                                                <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-gray-400'}`}>{step.label}</p>
                                                {isCurrent && <p className="text-[10px] text-yellow-600 font-medium mt-1">In Progress</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Mobile Labels for current step only */}
                            <div className="sm:hidden text-center mt-6">
                                <p className="text-sm font-bold text-slate-900">{steps[currentStepIndex]?.label}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h4 className="text-sm font-bold text-gray-700 mb-4 flex justify-between">
                                <span>Items in this shipment</span>
                                <span className="text-slate-900">Total: ৳{activeOrder.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </h4>
                            <div className="space-y-4">
                                {activeOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-50" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">৳{item.price.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};