// 🔧 DNS FIX for Windows
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
    price: 2400,
    description: "Warm cognac infused with cinnamon, clove, and oak wood. For the bold.",
    image: "/images/signature1.jpg",
    image2: "/images/signature2.jpg",
    topNotes: "Bergamot, Ambroxan, Orris Root",
    heartNotes: "Ambergris, Amber, Jasmine",
    baseNotes: "Musk, Patchouli, Cashmeran",
    longevity: "09+ Hours",
    size: "50ml",
    inStock: true,
    rating: 4.7,
    numReviews: 87,
  },
  {
    name: "First Impression",
    brand: "Scentify",
    price: 1800,
    description: "Fresh gardenia blossoms with hints of jasmine and white tea.",
    image: "/images/firstimpression1.jpg",
    image2: "/images/firstimpression2.jpg",
    topNotes: "Lime, Gin, Galbanum",
    heartNotes: "Mint, Nutmeg, Cypress",
    baseNotes: "Amber, Vetiver, Texas Cedar",
    longevity: "07+ Hours",
    size: "50ml",
    inStock: false,
    rating: 4.5,
    numReviews: 67,
  },
  {
    name: "Abeeha",
    brand: "Scentify",
    price: 1800,
    description: "Smoky cedar with a touch of leather and pepper. Rugged and sophisticated.",
    image: "/images/abeeha1.jpg",
    image2: "/images/abeeha2.jpg",
    topNotes: "Pear Blossom, Italian Mandarin, Red Berries",
    heartNotes: "White Gardenia, Jasmine Absolute, Frangipani",
    baseNotes: "Patchouli, Brown Sugar Accord",
    longevity: "07+ Hours",
    size: "50ml",
    inStock: true,
    rating: 4.4,
    numReviews: 112,
  },
  {
    name: "Velvet Bloom",
    brand: "Scentify",
    price: 1800,
    description: "Zesty citrus with grapefruit, lemon, and bergamot. A burst of energy.",
    image: "/images/velvetbloom1.jpg",
    image2: "/images/velvetbloom2.jpg",
    topNotes: "Purple Passion Fruit, Grapefruit, Pineapple",
    heartNotes: "Shangri-La Peony, Vanilla Orchid, Red Berries",
    baseNotes: "Musk, Woody Notes, Oakmoss, Italian Pine",
    longevity: "08+ Hours",
    size: "50ml",
    inStock: true,
    rating: 4.3,
    numReviews: 203,
  },
  {
    name: "Midnight",
    brand: "Scentify",
    price: 1800,
    description: "Exotic blend of rose, oud, and incense. Transport yourself to the Middle East.",
    image: "/images/midnight1.jpg",
    image2: "/images/midnight2.jpg",
    topNotes: "Bergamot",
    heartNotes: "Sichuan Pepper, Lavender, Star Anise, Nutmeg",
    baseNotes: "Ambroxan, Vanilla",
    longevity: "07+ Hours",
    size: "50ml",
    inStock: true,
    rating: 4.9,
    numReviews: 189,
  },
  {
    name: "Dream",
    brand: "Scentify",
    price: 1800,
    description: "Inspired by Yara Pink by Lattafa, this fragrance is a sweet and fruity gourmand delight.",
    image: "/images/dream1.jpg",
    image2: "/images/dream2.jpg",
    topNotes: "Strawberry, Peach, Bergamot",
    heartNotes: "Candy Floss, Orchid, Lily",
    baseNotes: "Vanilla, Musk, Sandalwood",
    longevity: "08-10 Hours",
    size: "50ml",
    inStock: true,
    rating: 4.5,
    numReviews: 45,
  },
  {
    name: "9pm",
    brand: "Scentify",
    price: 1800,
    description: "A bold and warm amber-vanilla fragrance with strong projection.",
    image: "/images/9pm1.jpg",
    image2: "/images/9pm2.jpg",
    topNotes: "Apple, Cinnamon, Wild Bergamot",
    heartNotes: "Orange Blossom, Lily of the Valley",
    baseNotes: "Vanilla, Tonka Bean, Amber, Patchouli",
    longevity: "12+ Hours",
    size: "100ml",
    inStock: true,
    rating: 4.8,
    numReviews: 156,
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
    console.log('💰 Prices:', products.map(p => `${p.name}: Rs.${p.price}`).join(', '));
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();