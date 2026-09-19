import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';   // db.js loads .env itself
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ❌ REMOVED: import dotenv from 'dotenv';
// ❌ REMOVED: dotenv.config();

// Connect to MongoDB (db.js handles .env loading)
connectDB();

const app = express();

// ===== Enable trust proxy for Render/Vercel =====
app.set('trust proxy', 1);

// ... rest of your file stays exactly the same