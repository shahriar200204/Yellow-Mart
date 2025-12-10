const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Product, Order, User } = require('./models');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Replace 'mongodb://localhost:27017/yellow-mart' with your MongoDB Atlas URL if using cloud
mongoose.connect('mongodb://localhost:27017/yellow-mart')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- ROUTES ---

// 1. GET All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. SEED Products (To load initial data)
app.post('/api/products/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(req.body);
    res.json(createdProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. CREATE Order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    
    // Update product stock
    for (const item of savedOrder.items) {
        const product = await Product.findOne({ id: item.id });
        if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            await product.save();
        }
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. GET All Orders (For Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. GET User Orders
app.get('/api/orders/user/:email', async (req, res) => {
  try {
    const orders = await Order.find({ customerEmail: req.params.email }).sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});