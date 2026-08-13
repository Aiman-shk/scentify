import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCart } from '../context/CartContext'; // Import cart context
import './BestSellerCarousel.css';

const BestSellerCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef(null);
  const { addToCart } = useCart(); // Get addToCart function from context

  // Use the full product list — don't cut the catalog down to 8 "top rated" items.
  // If you specifically want a curated Best Seller list, filter by a `bestSeller: true`
  // flag on the product instead of rating, so you don't accidentally hide most of your catalog.
  const displayProducts = products || [];

  // Calculate items per view based on screen size, and measure the
  // viewport's actual pixel width so item movement is exact (no
  // rounding drift from nested percentages, which was causing the
  // "half perfume" slide you saw).
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerView(1);
      } else if (width < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
      if (viewportRef.current) {
        setViewportWidth(viewportRef.current.getBoundingClientRect().width);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  const total = displayProducts.length;
  // Max index = last position where a full view is still visible, then we clamp for the tail
  const maxIndex = Math.max(0, total - itemsPerView);

  // Reset index if it becomes invalid (e.g. after resize or product list change)
  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // ===== ADD TO CART HANDLER =====
  const handleAddToCart = (product, e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    
    // Create cart item with required fields
    const cartItem = {
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      brand: product.brand || 'Scentify',
      inStock: product.inStock !== undefined ? product.inStock : true,
    };
    
    addToCart(cartItem);
    
    // Optional: Show a quick feedback (you can replace with a toast notification)
    console.log(`✅ Added "${product.name}" to cart!`);
    
    // Optional: Add a visual feedback
    const btn = e.currentTarget;
    const originalText = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = '#28a745';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '#1a1a1a';
    }, 1500);
  };

  if (total === 0) {
    return null;
  }

  // Exact pixel width per item — guarantees each click moves precisely
  // one full card, never a partial one.
  const itemWidth = itemsPerView > 0 ? viewportWidth / itemsPerView : 0;
  const translatePx = currentIndex * itemWidth;

  return (
    <section className="best-seller-section">
      <div className="best-seller-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="best-seller-header"
        >
          <h2 className="best-seller-title">BEST SELLER</h2>
          <p className="best-seller-subtitle">Our most loved fragrances</p>
        </motion.div>

        <div className="carousel-wrapper">
          {/* Left Arrow */}
          <button
            className={`carousel-arrow carousel-arrow-left ${total <= itemsPerView ? 'disabled' : ''}`}
            onClick={prevSlide}
            aria-label="Previous products"
            disabled={total <= itemsPerView}
          >
            <FaChevronLeft />
          </button>

          {/* Sliding track viewport */}
          <div className="carousel-viewport" ref={viewportRef}>
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${translatePx}px)`,
              }}
            >
              {displayProducts.map((product) => (
                <div
                  key={product._id}
                  className="carousel-item"
                  style={{ width: itemWidth ? `${itemWidth}px` : `${100 / itemsPerView}%` }}
                >
                  <div className="carousel-item-inner">
                    <motion.div
                      className="product-card"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Link to={`/product/${product._id}`} className="product-link">
                        <div className="product-image-wrapper">
                          <img
                            src={product.image || '/images/placeholder.jpg'}
                            alt={product.name}
                            className="product-image"
                            loading="lazy"
                          />
                          {product.rating >= 4.8 && (
                            <span className="best-seller-badge">⭐ Best Seller</span>
                          )}
                        </div>
                        <div className="product-info">
                          <h3 className="product-name">{product.name}</h3>
                          <p className="product-brand">{product.brand || 'Scentify'}</p>
                          <p className="product-price">Rs. {product.price.toLocaleString()}</p>
                        </div>
                      </Link>
                      {/* ===== FIXED: Add to Cart Button ===== */}
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        Add to Cart
                      </button>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            className={`carousel-arrow carousel-arrow-right ${total <= itemsPerView ? 'disabled' : ''}`}
            onClick={nextSlide}
            aria-label="Next products"
            disabled={total <= itemsPerView}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Pagination Dots — one dot per possible starting position */}
        {total > itemsPerView && (
          <div className="carousel-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="view-all-wrapper"
        >
          <Link to="/products" className="view-all-btn">
            View All Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BestSellerCarousel;