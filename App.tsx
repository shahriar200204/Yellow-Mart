import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { AdminDashboard } from './pages/AdminDashboard';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { CustomerAuth } from './pages/CustomerAuth';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { StoreProvider } from './context/StoreContext';
import { Chatbot } from './components/Chatbot';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customer-auth" element={<CustomerAuth />} />
            <Route path="/my-account" element={<CustomerDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Chatbot />
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;