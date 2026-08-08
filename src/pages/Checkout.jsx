import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { pakistanCities } from '../data/cities';
import { FaCopy, FaCheckCircle, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa';
import API_URL from '../api/config';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState(null); // ← ADD THIS

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'Cash on Delivery',
  });

  const filteredCities = pakistanCities.filter(city =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCitySearch = (e) => {
    const value = e.target.value;
    setSearchCity(value);
    setFormData(prev => ({ ...prev, city: value }));
    setShowDropdown(true);
  };

  const selectCity = (city) => {
    setSearchCity(city);
    setFormData(prev => ({ ...prev, city: city }));
    setShowDropdown(false);
  };

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // ===== VALIDATE PHONE NUMBER (11 digits) =====
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 11;
  };

  // ===== FORMAT PHONE NUMBER AS USER TYPES =====
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length <= 11) {
      let formatted = cleanValue;
      if (cleanValue.length >= 5) {
        formatted = `${cleanValue.slice(0, 4)}-${cleanValue.slice(4)}`;
      }
      setFormData(prev => ({ ...prev, phone: formatted }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔵 Form submitted!');
    console.log('📦 Cart items:', cartItems);

    setLoading(true);
    setError('');

    // ===== VALIDATE ALL FIELDS =====
    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.phone) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // ===== VALIDATE PHONE NUMBER (11 digits) =====
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 11) {
      setError('Phone number must be exactly 11 digits (e.g., 03XX-XXXXXXX)');
      setLoading(false);
      return;
    }

    if (!pakistanCities.includes(formData.city)) {
      setError('Please select a valid city in Pakistan');
      setLoading(false);
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      setLoading(false);
      return;
    }

    const orderItems = cartItems.map(item => {
      const productId = item._id || item.id;
      return {
        product: productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      };
    });

    const hasMissingId = orderItems.some(item => !item.product);
    if (hasMissingId) {
      setError('Some products are missing an ID. Please re-add them to cart.');
      setLoading(false);
      return;
    }

    const totalPrice = getTotalPrice();
    const shippingPrice = totalPrice > 50 ? 0 : 5.99;
    const itemsPrice = totalPrice;

    const orderData = {
      orderItems,
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        phone: cleanPhone,
      },
      paymentMethod: formData.paymentMethod,
      itemsPrice: parseFloat(itemsPrice.toFixed(2)),
      shippingPrice: parseFloat(shippingPrice.toFixed(2)),
      totalPrice: parseFloat((itemsPrice + shippingPrice).toFixed(2)),
    };

    console.log('📤 Sending order data:', orderData);

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        console.log('✅ Order placed:', order._id);
        
        // ===== SAVE ORDER ID =====
        setOrderId(order._id);
        setSuccess(true);
        
        // ===== CLEAR CART AFTER NAVIGATING =====
        // Don't clear cart here - wait for navigation
        setTimeout(() => {
          clearCart(); // ← Clear cart after navigation
          navigate(`/order-success/${order._id}`);
        }, 2000);
      } else {
        const data = await response.json();
        console.log('❌ Error response:', data);
        setError(data.message || 'Failed to place order');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  // ===== FIX: Show cart items even during loading =====
  if (cartItems.length === 0 && !success && !loading) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products before checking out</p>
        <button onClick={() => navigate('/products')} className="shop-btn">
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="checkout-page"
    >
      <div className="checkout-container">
        <h1>Checkout</h1>

        {success && (
          <div className="success-message">
            ✅ Order placed successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* ===== TWO COLUMN LAYOUT ===== */}
        <div className="checkout-grid">
          {/* LEFT: Order Summary */}
          <div className="order-summary-wrapper">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item._id || item.id} className="summary-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>Rs. {(item.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Items Total</span>
                  <span>Rs. {getTotalPrice().toFixed(0)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{getTotalPrice() > 50 ? 'FREE' : 'Rs. 5.99'}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>Rs. {(getTotalPrice() + (getTotalPrice() > 50 ? 0 : 5.99)).toFixed(0)}</span>
                </div>
              </div>
              <p className="shipping-note">
                * Free shipping on orders over $50
              </p>
            </div>
          </div>

          {/* RIGHT: Checkout Form */}
          <div className="checkout-form-wrapper">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <div className="city-search-container">
                    <input
                      type="text"
                      value={searchCity}
                      onChange={handleCitySearch}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Search for your city..."
                      required
                      className="city-input"
                      autoComplete="off"
                    />
                    {showDropdown && searchCity && filteredCities.length > 0 && (
                      <div className="city-dropdown">
                        {filteredCities.slice(0, 15).map((city) => (
                          <div
                            key={city}
                            className="city-option"
                            onMouseDown={() => selectCity(city)}
                          >
                            {city}
                          </div>
                        ))}
                        {filteredCities.length > 15 && (
                          <div className="city-more">
                            + {filteredCities.length - 15} more cities...
                          </div>
                        )}
                      </div>
                    )}
                    {showDropdown && searchCity && filteredCities.length === 0 && (
                      <div className="city-dropdown no-results">
                        <span>No cities found. Please enter a valid city.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone (11 digits) *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="03XX-XXXXXXX"
                    required
                    maxLength="12"
                  />
                  <small style={{ color: '#888', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    Format: 03XX-XXXXXXX (11 digits)
                  </small>
                </div>
              </div>

              {/* ===== PAYMENT SECTION ===== */}
              <div className="payment-section">
                <label className="payment-label">Payment Method</label>
                <p className="payment-note">All transactions are secure and encrypted.</p>

                <div className="payment-options">
                  {/* Cash on Delivery */}
                  <label className={`payment-option ${formData.paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                    />
                    <div className="payment-option-content">
                      <FaMoneyBillWave className="payment-icon" />
                      <div>
                        <span className="payment-option-label">Cash on Delivery (COD)</span>
                        <span className="payment-option-desc">Pay when you receive your order</span>
                      </div>
                    </div>
                  </label>

                  {/* Online Payment */}
                  <label className={`payment-option ${formData.paymentMethod === 'Online Payment' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Payment"
                      checked={formData.paymentMethod === 'Online Payment'}
                      onChange={handleChange}
                    />
                    <div className="payment-option-content">
                      <FaCreditCard className="payment-icon" />
                      <div>
                        <span className="payment-option-label">Online Payment</span>
                        <span className="payment-option-desc">Pay via bank transfer</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Online Payment Details */}
                {formData.paymentMethod === 'Online Payment' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="online-payment-details"
                  >
                    <div className="payment-warning">
                      <strong>Note:</strong> For Online Payment, Please Share the Receipt/Screenshot at 
                      <span className="phone-number"> 0341-722-5000</span> with ORDER NUMBER within 30 Minutes 
                      after making payment. Otherwise, the order will be delivered as Cash on Delivery.
                    </div>

                    <div className="bank-details">
                      <h4>Online Payment Details</h4>
                      <div className="bank-info">
                        <div className="bank-row">
                          <span className="bank-label">Account:</span>
                          <span className="bank-value">Jazz Cash</span>
                        </div>
                        <div className="bank-row">
                          <span className="bank-label">Title:</span>
                          <span className="bank-value">Tarique ahmed</span>
                        </div>
                        <div className="bank-row">
                          <span className="bank-label">Account No:</span>
                          <span className="bank-value">03313936993</span>
                          <button 
                            className="copy-btn"
                            type="button"
                            onClick={() => copyToClipboard('03313936993')}
                          >
                            {copied ? <FaCheckCircle /> : <FaCopy />}
                          </button>
                        </div>
                        <div className="bank-row">
                          <span className="bank-label">IBAN:</span>
                          <span className="bank-value">PK26JCMA2108923313936993</span>
                          <button 
                            className="copy-btn"
                            type="button"
                            onClick={() => copyToClipboard('PK26JCMA2108923313936993')}
                          >
                            <FaCopy />
                          </button>
                        </div>
                        <div className="bank-row">
                          <span className="bank-label">RAAST ID:</span>
                          <span className="bank-value">03313936993</span>
                          <button 
                            className="copy-btn"
                            type="button"
                            onClick={() => copyToClipboard('03313936')}
                          >
                            <FaCopy />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading || success}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;