import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const getProductId = (item) => item._id || item.id;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <h2>Shopping Cart</h2>
              <button className="cart-drawer-close" onClick={onClose}>
                <FaTimes />
              </button>
            </div>

            {/* Cart Items */}
            <div className="cart-drawer-body">
              {cartItems.length === 0 ? (
                <div className="cart-drawer-empty">
                  <p>Your cart is currently empty.</p>
                </div>
              ) : (
                <>
                  <div className="cart-drawer-items">
                    {cartItems.map((item) => {
                      const productId = getProductId(item);
                      return (
                        <div key={productId} className="cart-drawer-item">
                          <div className="cart-drawer-item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="cart-drawer-item-info">
                            <div className="cart-drawer-item-details">
                              <h4>{item.name}</h4>
                              <p className="cart-drawer-item-meta">
                                {item.size || '50 ML'}
                              </p>
                              <span className="cart-drawer-item-price">
                                Rs. {(item.price * item.quantity).toFixed(0)}
                              </span>
                            </div>
                            <div className="cart-drawer-item-actions">
                              <div className="cart-drawer-quantity">
                                <button
                                  onClick={() => updateQuantity(productId, item.quantity - 1)}
                                  className="qty-btn"
                                >
                                  <FaMinus />
                                </button>
                                <span className="qty-number">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(productId, item.quantity + 1)}
                                  className="qty-btn"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                              <button
                                className="cart-drawer-item-remove"
                                onClick={() => removeFromCart(productId)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="cart-drawer-divider" />

                  {/* Subtotal */}
                  <div className="cart-drawer-subtotal">
                    <span>Subtotal</span>
                    <span>Rs. {totalPrice.toFixed(0)}</span>
                  </div>

                  {/* ===== REMOVED: Installments Text ===== */}
                  {/* <div className="cart-drawer-installments">
                    Pay in 3 Installments of Rs. {(totalPrice / 3).toFixed(0)}
                  </div> */}

                  {/* ===== REMOVED: Checkout with Rewards Button ===== */}
                  {/* <button className="cart-drawer-rewards-btn">
                    Checkout with Rewards
                  </button> */}

                  {/* Checkout Buttons */}
                  <div className="cart-drawer-buttons">
                    <button className="cart-drawer-checkout-btn" onClick={handleCheckout}>
                      Proceed to Checkout →
                    </button>
                    <button className="cart-drawer-continue-btn" onClick={() => { onClose(); navigate('/products'); }}>
                      Continue Shopping
                    </button>
                    <p className="cart-drawer-footer-note">
                      Taxes included. Shipping and discounts calculated at checkoujjhjhjhjt.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;