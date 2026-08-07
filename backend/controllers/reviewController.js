import Review from '../models/Review.js';

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req, res) => {
  try {
    const { productId, userName, rating, comment, productName } = req.body;

    // Validation
    if (!productId || !userName || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = new Review({
      productId,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      productName: productName || '',
      userId: 'guest',
      verified: false,
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Public
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: error.message });
  }
};