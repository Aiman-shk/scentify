import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const cartTotal = getCartTotal();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      cartItems.forEach(item => removeFromCart(item.id));
    }
  };

  return (
    <div className="cart-page">
      {/* Page Header with proper spacing */}
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        {cartItems.length > 0 && (
          <span className="cart-item-count">{cartItems.length} items</span>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="cart-empty-state">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any fragrances yet.</p>
          <p className="empty-sub-text">Browse our collection and find your perfect scent.</p>
          <Link to="/products" className="btn-shop-now">Start Shopping</Link>
        </div>
      ) : (
        /* Cart with Items */
        <div className="cart-main">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  <img 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.name} 
                  />
                </div>
                
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-brand">{item.brand || 'Luxury Fragrance'}</p>
                  <p className="cart-item-price">Rs. {item.price.toLocaleString()}</p>
                </div>
                
                <div className="cart-item-quantity">
                  <button 
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-number">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                
                <div className="cart-item-total">
                  <p className="item-total-price">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Section */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>Included</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <button className="btn-checkout">
              Proceed to Checkout →
            </button>
            
            <button 
              className="btn-clear-cart"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
            
            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
            
            <p className="cart-footer-note">
              Taxes included. Shipping and discounts calculated at checkout.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;