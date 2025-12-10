import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Mail, Lock, User, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export const CustomerAuth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginCustomer } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    if (email && password) {
      const displayName = name || email.split('@')[0];
      loginCustomer(displayName, email);
      navigate('/my-account');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="flex">
            <button 
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${isLogin ? 'bg-yellow-400 text-slate-900' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                onClick={() => setIsLogin(true)}
            >
                Login
            </button>
            <button 
                className={`flex-1 py-4 text-center font-bold text-sm transition-colors ${!isLogin ? 'bg-yellow-400 text-slate-900' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                onClick={() => setIsLogin(false)}
            >
                Create Account
            </button>
        </div>
        
        <div className="p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                    {isLogin ? 'Welcome Back!' : 'Join Yellow Mart'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    {isLogin ? 'Sign in to track your orders.' : 'Create an account for faster checkout.'}
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                            placeholder="Full Name"
                        />
                    </div>
                )}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                        placeholder="Email Address"
                    />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none rounded-xl relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm"
                        placeholder="Password"
                    />
                </div>

                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-slate-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all shadow-lg hover:shadow-xl"
                >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        {isLogin ? <LogIn className="h-5 w-5 text-slate-800" /> : <UserPlus className="h-5 w-5 text-slate-800" />}
                    </span>
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};