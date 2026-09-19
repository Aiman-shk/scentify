// 🔧 DNS FIX for Windows
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

// 🔧 Load .env HERE (before mongoose.connect)
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    console.log('🔍 Connecting to:', process.env.MONGO_URI.split('@')[1] || 'localhost');

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,   // ← Increased from 5000 to 15000
      socketTimeoutMS: 45000,
      family: 4,                         // Force IPv4 (avoids IPv6 DNS issues)
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(() => connectDB(), 5000);
  }
};

export default connectDB;