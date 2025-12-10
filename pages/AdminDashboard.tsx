import React from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { Navigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { Package, Users, DollarSign, TrendingUp, Bell, ShoppingBag } from 'lucide-react';

// Keep chart data static for visual demonstration as single order history doesn't make good charts
const MOCK_CHART_DATA = [
  { name: 'Jan', sales: 400000, visitors: 2400 },
  { name: 'Feb', sales: 300000, visitors: 1398 },
  { name: 'Mar', sales: 200000, visitors: 9800 },
  { name: 'Apr', sales: 278000, visitors: 3908 },
  { name: 'May', sales: 189000, visitors: 4800 },
  { name: 'Jun', sales: 239000, visitors: 3800 },
  { name: 'Jul', sales: 349000, visitors: 4300 },
];

export const AdminDashboard: React.FC = () => {
  const { userRole, orders } = useStore();

  if (userRole !== UserRole.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-red-50 p-6 rounded-full mb-4">
             <Bell className="text-red-500 w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-gray-600 mt-2 max-w-md">You do not have permission to view the Admin Dashboard. Please switch to Admin Mode in the navbar.</p>
        <Navigate to="/" replace={false} /> 
      </div>
    );
  }

  // Calculate Real-time Stats
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersCount = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customerEmail)).size;
  const pendingOrdersCount = orders.filter(o => o.status === 'Placed' || o.status === 'Processing').length;

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Placed': return 'bg-yellow-100 text-yellow-800';
        case 'Processing': return 'bg-blue-100 text-blue-800';
        case 'Shipped': return 'bg-purple-100 text-purple-800';
        case 'Out_for_Delivery': return 'bg-orange-100 text-orange-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
            <button className="bg-white border border-gray-200 text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">Export Report</button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800">Add Product</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Sales</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">৳{totalSales.toLocaleString()}</h3>
                    <span className="text-xs text-green-500 flex items-center mt-1"><TrendingUp size={12} className="mr-1"/> Live</span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                    <DollarSign size={24} />
                </div>
            </div>
        </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Orders</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalOrdersCount}</h3>
                    <span className="text-xs text-green-500 flex items-center mt-1"><TrendingUp size={12} className="mr-1"/> Live</span>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <Package size={24} />
                </div>
            </div>
        </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Customers</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{uniqueCustomers}</h3>
                    <span className="text-xs text-gray-500 flex items-center mt-1">Active</span>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <Users size={24} />
                </div>
            </div>
        </div>
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pending</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingOrdersCount}</h3>
                    <span className="text-xs text-gray-400 mt-1">Requires Action</span>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                    <Bell size={24} />
                </div>
            </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Analytics (BDT)</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `৳${val/1000}k`} />
                        <Tooltip 
                            formatter={(value: any) => `৳${value.toLocaleString()}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                        />
                        <Bar dataKey="sales" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Visitor Traffic</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend />
                        <Line type="monotone" dataKey="visitors" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Recent Orders Table (Dynamic) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                    <ShoppingBag size={32} className="opacity-20" />
                                    No orders found.
                                </div>
                            </td>
                        </tr>
                    ) : (
                        orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-slate-900">{order.customerName}</div>
                                        <div className="text-xs text-gray-400">{order.customerEmail}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{order.date}</td>
                                <td className="px-6 py-4 text-right font-bold text-slate-900">৳{order.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};