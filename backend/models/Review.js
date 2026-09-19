import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
    default: null,
  },
  userId: {
    type: String,
    default: 'guest',
  },
  userName: {
    type: String,
    required: false,
    default: 'Guest User',
    trim: true,
  },
  rating: {
    type: Number,
    required: false,
    min: 1,
    max: 5,
    default: 5,
  },
  comment: {
    type: String,
    required: false,
    trim: true,
    default: '',
  },
  productName: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ===== SAFE MODEL REGISTRATION =====
// This prevents OverwriteModelError by reusing the model if it already exists
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;