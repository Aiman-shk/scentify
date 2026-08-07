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
  gender: {
    type: String,
    default: 'Unisex',
  },
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

const Product = mongoose.model('Product', productSchema);
export default Product;