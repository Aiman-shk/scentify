import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);

  // ===== FIXED: Use single image or fallback =====
  const productImages = [product.image || '/images/placeholder.jpg'];
  // ==============================================

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const isHotSeller = product.rating >= 4.7 && product.numReviews > 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${productId}`} className="product-card-link">
        <div className="product-image-wrapper">
          <div className="product-image-container">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={productImages[currentImage]}
                alt={product.name}
                className="product-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.src = '/images/placeholder.jpg';
                }}
              />
            </AnimatePresence>

            {productImages.length > 1 && (
              <>
                <button
                  className="product-nav-arrow prev"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  className="product-nav-arrow next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            {productImages.length > 1 && (
              <div className="product-image-counter">
                {currentImage + 1} / {productImages.length}
              </div>
            )}

            {isHotSeller && (
              <div className="product-badge hot-seller">
                HOT SELLER
              </div>
            )}

            <button
              className="product-wishlist-btn"
              onClick={toggleWishlist}
              aria-label="Add to wishlist"
            >
              {inWishlist ? (
                <FaHeart className="wishlist-icon filled" />
              ) : (
                <FaRegHeart className="wishlist-icon" />
              )}
            </button>
          </div>
        </div>

        <div className="product-info">
          {/* ===== GENDER/CATEGORY REMOVED ===== */}
          {/* <div className="product-category">{product.gender || 'Unisex'}</div> */}
          
          <h3 className="product-name">
            {product.name}
            <span className="product-size">({product.size || '50 ML'})</span>
          </h3>
          
          <div className="product-price-row">
            <span className="product-price regular">
              Rs. {product.price.toFixed(0)}
            </span>
          </div>
        </div>
      </Link>

      <button
        className={`product-add-btn ${isHovered ? 'visible' : ''}`}
        onClick={handleAddToCart}
        aria-label="Add to cart"
      >
        <FaShoppingCart />
        <span>Add</span>
      </button>
    </motion.div>
  );
};

export default ProductCard;