import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const products = [
  {
    name: "Signature",
    brand: "Scentify",
    // ===== CATEGORY REMOVED =====
    gender: "Men",
    price: 2400,
    description: "Warm cognac infused with cinnamon, clove, and oak wood. For the bold.",
    image: "/images/signature1.jpg",
    inStock: true,
    rating: 4.7,
    numReviews: 87,
  },
  {
    name: "First Impression",
    brand: "Scentify",
    // ===== CATEGORY REMOVED =====
    gender: "Men",
    price: 1800,
    description: "Fresh gardenia blossoms with hints of jasmine and white tea.",
    image: "/images/firstimpression1.jpg",
    inStock: false,
    rating: 4.5,
    numReviews: 67,
  },
  {
    name: "Abeeha",
    brand: "Scentify",
    // ===== CATEGORY REMOVED =====
    gender: "Women",
    price: 1800,
    description: "Smoky cedar with a touch of leather and pepper. Rugged and sophisticated.",
    image: "/images/abeeha1.jpg",
    inStock: true,
    rating: 4.4,
    numReviews: 112,
  },
  {
    name: "Velvet Bloom",
    brand: "Scentify",
    // ===== CATEGORY REMOVED =====
    gender: "Women",
    price: 1800,
    description: "Zesty citrus with grapefruit, lemon, and bergamot. A burst of energy.",
    image: "/images/velvetbloom1.jpg",
    inStock: true,
    rating: 4.3,
    numReviews: 203,
  },
  {
    name: "Midnight",
    brand: "Scentify",
    // ===== CATEGORY REMOVED =====
    gender: "Unisex",
    price: 1800,
    description: "Exotic blend of rose, oud, and incense. Transport yourself to the Middle East.",
    image: "/images/midnight1.jpg",
    inStock: true,
    rating: 4.9,
    numReviews: 189,
  },
 
];

const importData = async () => {
  try {
    // Delete all existing products
    await Product.deleteMany();
    console.log('🗑️  Deleted existing products');
    
    // Insert all products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products imported successfully!`);
    console.log('📦 Products:', products.map(p => p.name).join(', '));
    console.log('👤 Genders:', products.map(p => `${p.name}: ${p.gender}`).join(', '));
    console.log('💰 Prices:', products.map(p => `${p.name}: Rs.${p.price}`).join(', '));
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();