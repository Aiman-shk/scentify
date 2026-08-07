import express from 'express';
import {
  getProductReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/product/:productId').get(getProductReviews);
router.route('/').post(createReview);
router.route('/:id').delete(deleteReview);

export default router;