import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShoppingBag } from 'react-icons/fa';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="order-success-loading">
        <div className="spinner"></div>
        <p>Loading your order...</p>
      </div>
    );
  }

  // Sample order items (fallback if no items)
  const orderItems = order?.orderItems || [
    { name: 'White neck shirt', brand: 'Dust Studios', size: 'M', quantity: 1, price: 120, image: 'https://via.placeholder.com/80/8b7355/ffffff?text=Shirt' },
    { name: 'Sunglasses for Men', brand: 'Black', size: 'M', quantity: 1, price: 120, image: 'https://via.placeholder.com/80/8b7355/ffffff?text=Sunglasses' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="order-success-page"
    >
      <div className="order-success-container">
        {/* Left Column */}
        <div className="order-success-left">
          <h1 className="order-success-title">Your Order is Confirmed!</h1>
          <p className="order-success-id">Order ID: #{order?._id || id || 'N/A'}</p>
          <p className="order-success-thankyou">Thank you {order?.shippingAddress?.fullName || 'Customer'}</p>

          {/* Order Updates Card */}
          <div className="order-card">
            <h3 className="order-card-title">Order Updates</h3>
            <p className="order-card-text">You will receive order and shipping updates via email.</p>
          </div>

          {/* Order Info Card */}
          <div className="order-card">
            <h3 className="order-card-title">Order Info</h3>
            <div className="order-info-grid">
              <div className="order-info-item">
                <span className="order-info-label">Order Date</span>
                <span className="order-info-value">{formatDate(order?.createdAt)}</span>
              </div>
              <div className="order-info-item">
                <span className="order-info-label">Payment Method</span>
                <span className="order-info-value">{order?.paymentMethod || 'Cash on Delivery'}</span>
              </div>
              <div className="order-info-item full-width">
                <span className="order-info-label">Address</span>
                <span className="order-info-value">
                  {order?.shippingAddress?.address || 'N/A'}
                  <br />
                  {order?.shippingAddress?.city || ''}
                </span>
              </div>
            </div>
          </div>

          {/* ===== LEFT COLUMN BUTTON - CONTINUE SHOPPING ONLY ===== */}
          <Link to="/products" className="btn-back-shopping">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>

        {/* Right Column */}
        <div className="order-success-right">
          <h2 className="order-right-title">Your Order</h2>

          {/* Order Items */}
          <div className="order-items-list">
            {orderItems.map((item, index) => (
              <div key={index} className="order-item">
                <div className="order-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="order-item-details">
                  <h4 className="order-item-name">{item.name}</h4>
                  <p className="order-item-brand">{item.brand || 'Scentify'}</p>
                  <p className="order-item-meta">
                    Size: {item.size || 'N/A'} &nbsp;|&nbsp; Qty: {item.quantity}
                  </p>
                </div>
                <div className="order-item-price">
                  Rs. {(item.price * item.quantity).toFixed(0)}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h3 className="order-summary-title">Order Summary</h3>
            <div className="order-summary-row">
              <span>Subtotal</span>
              <span>Rs. {order?.itemsPrice?.toFixed(0) || '0'}</span>
            </div>
            <div className="order-summary-row">
              <span>Delivery</span>
              <span>{order?.shippingPrice === 0 ? 'Free' : `Rs. ${order?.shippingPrice?.toFixed(0) || '0'}`}</span>
            </div>
            <div className="order-summary-row grand-total">
              <span>Total</span>
              <span>Rs. {order?.totalPrice?.toFixed(0) || '0'}</span>
            </div>
          </div>

          {/* Right Column Button */}
          <Link to="/track-order" className="btn-continue-shipping">
            <FaShoppingBag /> Track Order
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;