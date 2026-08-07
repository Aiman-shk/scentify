import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaClock, FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="contact-page"
    >
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p className="contact-info-description">
              Have a question about our fragrances? Want to place a bulk order?
              We're here to help!
            </p>

            <div className="contact-info-items">
              {/* ===== VISIT US REMOVED ===== */}

              <div className="contact-info-item">
                <div className="contact-info-icon"><FaPhone /></div>
                <div>
                  <h4>Call Us</h4>
                  <p>+92 300 1234567</p>
                  <p>Mon-Fri 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon"><FaEnvelope /></div>
                <div>
                  <h4>Email Us</h4>
                  <p>info@scentify.com</p>
                  <p>support@scentify.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon"><FaClock /></div>
                <div>
                  <h4>Working Hours</h4>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <h4>Follow Us</h4>
              <div className="contact-social-icons">
                <a href="#" className="social-icon"><FaFacebook /></a>
                <a href="#" className="social-icon"><FaInstagram /></a>
                <a href="#" className="social-icon"><FaTwitter /></a>
              </div>
            </div>
          </div>

          {/* ===== SEND MESSAGE FORM REMOVED ===== */}
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;