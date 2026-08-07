import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();

  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalPrice,
    getTotalItems 
  } = useCart();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };

  // Helper function to get product ID
  const getProductId = (item) => item._id || item.id;

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any perfumes to your cart yet.</p>
        <Link to="/products" className="btn-shop-now">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => {
            const productId = getProductId(item);
            return (
              <div key={productId} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="item-brand">{item.brand}</p>
                  <p className="item-price">${item.price}</p>
                </div>
                
                <div className="cart-item-quantity">
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
                
                <div className="cart-item-total">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(productId)}
                    className="remove-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({totalItems})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{totalPrice > 50 ? 'Free' : '$5.99'}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${(totalPrice + (totalPrice > 50 ? 0 : 5.99)).toFixed(2)}</span>
          </div>
          
          <button 
            className="btn-checkout"
            onClick={handleCheckout}
          >
            Proceed to Checkout →
          </button>
          
          <button onClick={clearCart} className="btn-clear-cart">
            Clear Cart
          </button>
          
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;