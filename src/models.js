const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Product Schema
const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  old: { type: Number },
  tag: { type: String, default: 'Trending' },
  fabric: { type: String, required: true },
  sizes: [{ type: String }],
  image: { type: String, required: true },
  desc: { type: String, required: true },
  color: { type: String },
  includes: [{ type: String }],
  customization: { type: String }
});

// Order Schema
const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: String },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery (COD)' },
  items: [
    {
      id: Number,
      name: String,
      size: String,
      qty: Number,
      price: Number
    }
  ],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: { type: Date, default: Date.now }
});

// Review Schema
const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: Number, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Site Settings Schema
const SettingsSchema = new mongoose.Schema({
  announcementText1: { type: String, default: 'Express Shipping Across Pakistan on Orders Over Rs. 3000' },
  announcementText2: { type: String, default: 'Shop with Confidence' },
  heroHeadingLine1: { type: String, default: 'Elegance in' },
  heroHeadingLine2: { type: String, default: 'Every Detail' },
  heroSubtext: { type: String, default: 'Modest Fashion • Timeless Style • Premium Quality' },
  freeShippingThreshold: { type: Number, default: 5000 },
  deliveryCharge: { type: Number, default: 400 },
  whatsappNumber: { type: String, default: '923001234567' },
  brandName: { type: String, default: 'YS COLLECTION' },
  brandTagline: { type: String, default: 'LUXURY MODEST COUTURE' },
  pillar1Title: { type: String, default: '100% KOREAN NIDA' },
  pillar1Desc: { type: String, default: 'Authentic imported fabrics' },
  pillar2Title: { type: String, default: 'CASH ON DELIVERY' },
  pillar2Desc: { type: String, default: 'Pay safely at your doorstep' },
  pillar3Title: { type: String, default: 'FREE DELIVERY' },
  pillar3Desc: { type: String, default: 'On all orders over Rs. 5,000' },
  pillar4Title: { type: String, default: 'COMPLIMENTARY SHAYLA' },
  pillar4Desc: { type: String, default: 'Free matching hijab included' }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

module.exports = { User, Product, Order, Review, Settings };
