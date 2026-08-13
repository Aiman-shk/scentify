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

  // LOG: Check if cart is working
  console.log('Cart items:', cartItems);

  return (
    <div className="cart-page-wrapper">
      {/* SPACER - FIXED WITH INLINE STYLE AS BACKUP */}
      <div 
        className="cart-spacer" 
        style={{ 
          height: '150px', 
          width: '100%', 
          background: 'transparent',
          display: 'block',
          flexShrink: 0
        }}
      ></div>
      
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <h2>Your cart is empty</h2>
                <p>Browse our collection of luxurious fragrances.</p>
                <Link to="/products" className="btn-shop-now">Shop Now</Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <img 
                      src={item.image || '/images/placeholder.jpg'} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="item-brand">{item.brand || '50 ML'}</p>
                    <p className="item-price">Rs. {item.price}</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >-</button>
                    <span className="qty-number">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                  <div className="cart-item-total">
                    <p>Rs. {item.price * item.quantity}</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="cart-summary">
              <h2>Cart Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {cartTotal}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {cartTotal}</span>
              </div>
              <button className="btn-checkout">Proceed to Checkout →</button>
              <button 
                className="btn-clear-cart"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
              <Link to="/products" className="continue-shopping">Continue Shopping</Link>
              <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', marginTop: '1rem' }}>
                Taxes included. Shipping and discounts calculated at checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;