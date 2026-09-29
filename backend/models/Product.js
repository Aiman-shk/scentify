import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  // ===== CATEGORY REMOVED =====
  // category: {
  //   type: String,
  //   required: true,
  // },
  // ===== GENDER REMOVED =====
  // gender: {
  //   type: String,
  //   default: 'Unisex',
  // },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  // ===== NEW FIELDS =====
  image2: {
    type: String,
    default: '',
  },
  topNotes: {
    type: String,
    default: '',
  },
  heartNotes: {
    type: String,
    default: '',
  },
  baseNotes: {
    type: String,
    default: '',
  },
  longevity: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '50ml',
  },
  // =====================
  inStock: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// ===== SAFE MODEL REGISTRATION =====
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;