import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section brand-section">
          <h3 className="footer-logo"> Scentify</h3>
          <p className="footer-description">
            Luxury fragrances for every moment.
          </p>
          <div className="footer-social">
            {/* ===== FACEBOOK AND TWITTER REMOVED ===== */}
            
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/scentify_perfumee?igsh=MXh0NXZoOWJyYTl1aw==" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            
            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@scentify.perfumee?_r=1&_t=ZS-98PSza6A0Y8" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/returns">Returns</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact-section">
          <h4>Contact</h4>
          <ul className="contact-list">
            <li>
              <span className="contact-icon">📧</span>
              <a href="mailto:scentify25@gmail.com">scentify25@gmail.com</a>
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <a href="tel:+923203810701">0320 3810701</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2026 Scentify. All Rights Reserved.</p>
       
      </div>
    </footer>
  );
};

export default Footer;