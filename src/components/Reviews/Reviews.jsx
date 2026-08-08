import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStar, FaRegStar, FaStarHalfAlt, FaUser, FaCheckCircle, 
  FaChevronDown, FaTimes, FaPen 
} from 'react-icons/fa';
import API_URL from '../../api/config'; // ← ADD THIS
import './Reviews.css';

const Reviews = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [formData, setFormData] = useState({
    userName: '',
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // ===== FETCH REVIEWS =====
  const fetchReviews = async () => {
    try {
      setLoading(true);
      // ===== CHANGED: Use API_URL =====
      const response = await fetch(`${API_URL}/reviews/product/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== SUBMIT REVIEW =====
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    if (!formData.userName.trim()) {
      setSubmitError('Please enter your name');
      setSubmitting(false);
      return;
    }

    if (formData.rating === 0) {
      setSubmitError('Please select a rating');
      setSubmitting(false);
      return;
    }

    if (!formData.comment.trim()) {
      setSubmitError('Please write a review');
      setSubmitting(false);
      return;
    }

    try {
      // ===== CHANGED: Use API_URL =====
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userName: formData.userName.trim(),
          rating: formData.rating,
          comment: formData.comment.trim(),
          productName: productName || '',
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setSubmitSuccess(true);
        setFormData({ userName: '', rating: 0, comment: '' });
        setTimeout(() => {
          setShowReviewForm(false);
          setSubmitSuccess(false);
        }, 2000);
      } else {
        const data = await response.json();
        setSubmitError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { rating, count, percentage };
  });

  const renderStars = (rating, size = 16) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" style={{ fontSize: size }} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star half" style={{ fontSize: size }} />);
      } else {
        stars.push(<FaRegStar key={i} className="star empty" style={{ fontSize: size }} />);
      }
    }
    return stars;
  };

  const renderStarsInput = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FaStar 
        key={star}
        className={`star-input ${star <= (formData.rating || formData.hoverRating || 0) ? 'active' : ''}`}
        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
        onMouseEnter={() => setFormData(prev => ({ ...prev, hoverRating: star }))}
        onMouseLeave={() => setFormData(prev => ({ ...prev, hoverRating: 0 }))}
      />
    ));
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return (
      <div className="reviews-section">
        <div className="reviews-loading">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="reviews-section">
      <div className="reviews-container">
        {/* Header */}
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          {totalReviews > 0 && (
            <div className="reviews-header-stats">
              <div className="header-stars">{renderStars(parseFloat(averageRating), 18)}</div>
              <span className="header-rating">{averageRating}</span>
              <span className="header-total">({totalReviews} reviews)</span>
            </div>
          )}
        </div>

        {totalReviews === 0 ? (
          /* Empty State */
          <div className="reviews-empty">
            <div className="empty-icon">📝</div>
            <h3>No reviews yet</h3>
            <p>Be the first to review this product</p>
            <button 
              className="reviews-empty-btn"
              onClick={() => setShowReviewForm(true)}
            >
              <FaPen /> Write a Review
            </button>
          </div>
        ) : (
          /* Summary */
          <div className="reviews-summary">
            <div className="summary-rating">
              <div className="summary-stars">{renderStars(parseFloat(averageRating), 24)}</div>
              <div className="summary-numbers">
                <span className="summary-average">{averageRating}</span>
                <span className="summary-total">out of 5</span>
              </div>
            </div>
            <div className="summary-breakdown">
              {ratingBreakdown.map((item) => (
                <div key={item.rating} className="breakdown-row">
                  <span className="breakdown-label">{item.rating}★</span>
                  <div className="breakdown-track">
                    <div className="breakdown-fill" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="breakdown-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Write Review Button */}
        {!showReviewForm && totalReviews > 0 && (
          <button 
            className="write-review-btn"
            onClick={() => setShowReviewForm(true)}
          >
            <FaPen /> Write a Review
          </button>
        )}

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="review-form-wrapper"
            >
              <div className="review-form-header">
                <h3>Write Your Review</h3>
                <button 
                  className="review-form-close"
                  onClick={() => setShowReviewForm(false)}
                >
                  <FaTimes />
                </button>
              </div>

              {submitSuccess && (
                <div className="review-success">✅ Review submitted successfully!</div>
              )}
              {submitError && (
                <div className="review-error">{submitError}</div>
              )}

              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <div className="star-rating-input">
                    {renderStarsInput(formData.rating)}
                    <span className="rating-text">
                      {formData.rating > 0 ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Tap a star'}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share your experience with this product..."
                    rows="4"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        {totalReviews > 0 && (
          <>
            {/* Sort */}
            <div className="reviews-sort">
              <span>Sort by</span>
              <div className="sort-dropdown">
                <button 
                  className="sort-toggle"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  {sortBy === 'newest' ? 'Newest' : 
                   sortBy === 'highest' ? 'Highest Rating' : 'Lowest Rating'}
                  <FaChevronDown className={`sort-icon ${showSortDropdown ? 'open' : ''}`} />
                </button>
                {showSortDropdown && (
                  <div className="sort-dropdown-menu">
                    <button onClick={() => { setSortBy('newest'); setShowSortDropdown(false); }}>
                      Newest
                    </button>
                    <button onClick={() => { setSortBy('highest'); setShowSortDropdown(false); }}>
                      Highest Rating
                    </button>
                    <button onClick={() => { setSortBy('lowest'); setShowSortDropdown(false); }}>
                      Lowest Rating
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="reviews-list">
              {sortedReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="review-card"
                >
                  <div className="review-card-top">
                    <div className="review-avatar">
                      {getInitials(review.userName)}
                    </div>
                    <div className="review-card-info">
                      <div className="review-card-name-row">
                        <span className="review-card-name">{review.userName}</span>
                        {review.verified && (
                          <span className="review-verified-badge">
                            <FaCheckCircle /> Verified
                          </span>
                        )}
                      </div>
                      <div className="review-card-stars">
                        {renderStars(review.rating, 15)}
                      </div>
                      {review.productName && (
                        <span className="review-card-product">{review.productName}</span>
                      )}
                    </div>
                  </div>
                  <p className="review-card-text">{review.comment}</p>
                  <span className="review-card-date">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reviews;