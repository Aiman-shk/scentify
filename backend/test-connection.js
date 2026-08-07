import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing connection...');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });