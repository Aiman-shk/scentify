import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTruck, FaCheckCircle, FaClock, FaBox, FaTimesCircle } from 'react-icons/fa';
import './TrackOrder.css';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tracked, setTracked] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an Order ID');
      return;
    }

    setLoading(true);
    setError('');
    setTracked(false);

    try {
      const response = await fetch(`http://localhost:5000/api/orders/track/${orderId.trim()}`);
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setTracked(true);
        setError('');
      } else if (response.status === 404) {
        setError('Order not found. Please check your Order ID.');
        setOrder(null);
      } else {
        setError('Failed to track order. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <FaClock className="status-icon pending" />;
      case 'Processing': return <FaBox className="status-icon processing" />;
      case 'Shipped': return <FaTruck className="status-icon shipped" />;
      case 'Delivered': return <FaCheckCircle className="status-icon delivered" />;
      case 'Cancelled': return <FaTimesCircle className="status-icon cancelled" />;
      default: return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';
      case 'Processing': return '#3498db';
      case 'Shipped': return '#9b59b6';
      case 'Delivered': return '#27ae60';
      case 'Cancelled': return '#e74c3c';
      default: return '#f39c12';
    }
  };

  // ========== ADD: Status message helper ==========
  const getStatusMessage = (status) => {
    switch (status) {
      case 'Pending': return '⏳ Your order is being processed.';
      case 'Processing': return '📦 Your order is being prepared.';
      case 'Shipped': return '🚚 Your order is on the way!';
      case 'Delivered': return '✅ Your order has been delivered!';
      case 'Cancelled': return '❌ Your order has been cancelled.';
      default: return 'Status unknown.';
    }
  };
  // ===============================================

  const getStatusSteps = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(status);
    
    return steps.map((step, index) => ({
      step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="track-order-page"
    >
      <div className="track-order-container">
        <div className="track-header">
          <h1>📦 Track Your Order</h1>
          <p>Enter your Order ID to track your order status</p>
        </div>

        <form onSubmit={handleTrack} className="track-form">
          <div className="track-input-group">
            <input
              type="text"
              placeholder="Enter Order ID (e.g., 6a65c348624a6d520ee24325)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="track-input"
            />
            <button type="submit" className="track-btn" disabled={loading}>
              {loading ? 'Searching...' : <><FaSearch /> Track Order</>}
            </button>
          </div>
        </form>

        {error && (
          <div className="track-error">
            <FaTimesCircle /> {error}
          </div>
        )}

        {tracked && order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="track-result"
          >
            <div className="order-header">
              <div className="order-id-status">
                <h2>Order #{order._id}</h2>
                <span 
                  className="order-status-badge"
                  style={{ background: getStatusColor(order.status) }}
                >
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
              <p className="order-date">
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* ========== ADD: Status message ========== */}
            <div className="status-message">
              <p style={{ fontSize: '1.1rem', color: '#2d1b12', margin: '10px 0', textAlign: 'center' }}>
                {getStatusMessage(order.status)}
              </p>
            </div>
            {/* ========================================= */}

            {/* Status Timeline */}
            <div className="status-timeline">
              {getStatusSteps(order.status).map((step, index) => (
                <div key={step.step} className="timeline-step">
                  <div className={`timeline-dot ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                    {step.completed && <FaCheckCircle />}
                  </div>
                  <div className="timeline-line"></div>
                  <div className="timeline-content">
                    <span className="step-name">{step.step}</span>
                    <span className="step-status">
                      {step.completed ? '✅ Completed' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="order-summary-section">
              <h3>Order Summary</h3>
              <div className="order-items">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <div className="total-row">
                  <span>Items Total</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'FREE' : '$' + order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="shipping-section">
              <h3>📍 Shipping Address</h3>
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>

            {/* Payment Method */}
            <div className="payment-section">
              <h3>💳 Payment Method</h3>
              <p>{order.paymentMethod}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TrackOrder;