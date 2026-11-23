const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Product, Order, Review, Settings } = require('./src/models');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ys_collection_jwt_secret_key_2026';
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => console.log('🍃 MongoDB Atlas Connected Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Helper to generate JWT Token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// -------------------------------------------------------------
// Root Health Check
// -------------------------------------------------------------
app.get('/', async (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'online',
    database: isDbConnected ? 'MongoDB Atlas (Connected)' : 'Disconnected',
    cluster: 'atlas-rqsyry-shard-0',
    message: 'YS Collection Luxury Couture API Server',
    version: '2.0.0',
    endpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/orders',
      '/api/products',
      '/api/reviews',
      '/api/settings'
    ]
  });
});

// -------------------------------------------------------------
// AUTH ROUTES
// -------------------------------------------------------------

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email: email.trim().toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'user'
    });

    const token = generateToken(newUser);
    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// -------------------------------------------------------------
// ORDERS ROUTES
// -------------------------------------------------------------

// GET /api/orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
  try {
    const body = req.body;
    const count = await Order.countDocuments();

    const newOrder = await Order.create({
      id: Date.now().toString(),
      orderNumber: `YS-${1000 + count + 1}`,
      userId: body.userId || undefined,
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      city: body.city,
      paymentMethod: body.paymentMethod || 'Cash on Delivery (COD)',
      items: body.items,
      subtotal: body.subtotal,
      shipping: body.shipping,
      total: body.total,
      status: 'Pending'
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PATCH /api/orders
app.patch('/api/orders', async (req, res) => {
  try {
    const { id, status } = req.body;
    const order = await Order.findOneAndUpdate(
      { id },
      { status },
      { returnDocument: 'after' }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// -------------------------------------------------------------
// PRODUCTS ROUTES
// -------------------------------------------------------------

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    const lastProduct = await Product.findOne().sort({ id: -1 });
    const newId = lastProduct ? lastProduct.id + 1 : 1;

    const newProduct = await Product.create({
      ...product,
      id: newId
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products
app.put('/api/products', async (req, res) => {
  try {
    const updated = req.body;
    const product = await Product.findOneAndUpdate(
      { id: updated.id },
      updated,
      { returnDocument: 'after' }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await Product.findOneAndDelete({ id });
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// -------------------------------------------------------------
// REVIEWS ROUTES
// -------------------------------------------------------------

// GET /api/reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const { productId } = req.query;
    const filter = productId ? { productId: Number(productId) } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews
app.post('/api/reviews', async (req, res) => {
  try {
    const { productId, userName, rating, comment } = req.body;
    if (!productId || !userName || !rating || !comment) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const newReview = await Review.create({
      id: Date.now().toString(),
      productId: Number(productId),
      userName: userName.trim(),
      rating: Number(rating),
      comment: comment.trim()
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// -------------------------------------------------------------
// SETTINGS ROUTES
// -------------------------------------------------------------

// GET /api/settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings
app.put('/api/settings', async (req, res) => {
  try {
    const updated = req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      updated,
      { returnDocument: 'after', upsert: true }
    );
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✨ YS Collection MongoDB Backend running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
});
