import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, getWishlistCount } = useWishlist();
  const { addToCart } = useCart();

  // ===== SCROLL TO TOP ON MOUNT =====
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // ===================================

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-empty">
        <div className="wishlist-empty-icon">❤️</div>
        <h2>Your Wishlist is Empty</h2>
        <p>Start saving your favorite fragrances!</p>
        <Link to="/products" className="wishlist-empty-btn">
          <FaArrowLeft /> Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="wishlist-page"
    >
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{getWishlistCount()} items saved</p>
        <button onClick={clearWishlist} className="wishlist-clear-btn">
          <FaTrash /> Clear All
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((product, index) => (
          <motion.div
            key={product._id || product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="wishlist-item"
          >
            <div className="wishlist-item-image">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="wishlist-item-info">
              <div className="wishlist-item-category">
                {product.gender || 'Unisex'}
              </div>
              <h3 className="wishlist-item-name">{product.name}</h3>
              <p className="wishlist-item-brand">{product.brand}</p>
              <div className="wishlist-item-price">
                ${product.price.toFixed(2)}
              </div>

              <div className="wishlist-item-actions">
                <button
                  className="wishlist-add-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(product._id || product.id)}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Wishlist;