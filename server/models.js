const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  features: [String]
});

// Order Schema
const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Placed', 'Processing', 'Shipped', 'Out_for_Delivery', 'Delivered'],
    default: 'Placed'
  },
  date: { type: String, required: true } // Storing as string for simplicity in demo
});

// User Schema (Basic)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, hash this!
  role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' }
});

const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Product, Order, User };