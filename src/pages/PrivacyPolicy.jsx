import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaEye, FaDatabase } from 'react-icons/fa';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="privacy-page"
    >
      <div className="privacy-hero">
        <div className="privacy-hero-content">
          <FaShieldAlt className="privacy-hero-icon" />
          <h1>Privacy Policy</h1>
          <p>Your privacy matters to us</p>
        </div>
      </div>

      <div className="privacy-container">
        <div className="privacy-content">
          <div className="privacy-section">
            <h2>Information We Collect</h2>
            <p>
              At Scentify, we collect information to provide better services to our customers. 
              We collect information you provide directly, such as when you create an account, 
              place an order, or contact us for support.
            </p>
            <ul>
              <li>Name and contact information</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information</li>
              <li>Order history and preferences</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send you promotional offers and updates (with your consent)</li>
              <li>Improve our products and services</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>Security</h2>
            <p>
              We take reasonable measures to help protect your personal information 
              from loss, theft, misuse, unauthorized access, disclosure, alteration, 
              and destruction. All transactions are processed through secure payment gateways.
            </p>
          </div>

          <div className="privacy-section">
            <h2>Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information 
              at any time. You can also opt-out of marketing communications by following 
              the unsubscribe instructions in our emails.
            </p>
          </div>

          <div className="privacy-section">
            <h2>Cookies</h2>
            <p>
              We use cookies to enhance your browsing experience, analyze site traffic, 
              and personalize content. You can choose to disable cookies in your browser 
              settings, though this may affect some site functionality.
            </p>
          </div>

          <div className="privacy-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> privacy@scentify.com
              <br />
              <strong>Phone:</strong> +92 300 1234567
            </p>
          </div>

          <div className="privacy-footer">
            <p>Last updated: January 2026</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;