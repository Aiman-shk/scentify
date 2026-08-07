import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { FaShieldAlt, FaFileContract, FaTruck, FaUndo, FaArrowLeft } from 'react-icons/fa';
import './PolicyPages.css';

const PolicyPages = () => {
  const location = useLocation();
  
  // Get page name from the URL path
  const getPageFromPath = () => {
    const path = location.pathname;
    if (path.includes('privacy-policy')) return 'privacy-policy';
    if (path.includes('terms')) return 'terms';
    if (path.includes('shipping')) return 'shipping';
    if (path.includes('returns')) return 'returns';
    return null;
  };

  const page = getPageFromPath();

  const getContent = () => {
    switch (page) {
      case 'privacy-policy':
        return {
          title: 'Privacy Policy',
          icon: <FaShieldAlt className="policy-hero-icon" />,
          sections: [
            {
              title: 'Information We Collect',
              content: `At Scentify, we collect information to provide better services to our customers.`,
              list: [
                'Name and contact information',
                'Shipping and billing addresses',
                'Payment information',
                'Order history and preferences'
              ]
            },
            {
              title: 'How We Use Your Information',
              content: 'We use the information we collect to:',
              list: [
                'Process and fulfill your orders',
                'Communicate with you about your orders and account',
                'Send you promotional offers and updates (with your consent)',
                'Improve our products and services'
              ]
            },
            {
              title: 'Contact Us',
              content: 'If you have any questions about this Privacy Policy, please contact us at:',
              contact: {
                email: 'scentify25@gmil.com',
                phone: '+92 3143711412'
              }
            }
          ]
        };

      case 'terms':
        return {
          title: 'Terms of Service',
          icon: <FaFileContract className="policy-hero-icon" />,
          sections: [
            {
              title: 'Acceptance of Terms',
              content: 'By using the Scentify website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
            },
            {
              title: 'Products and Pricing',
              content: 'We strive to display accurate product information and pricing. However, we reserve the right to correct any errors, inaccuracies, or omissions. Prices are subject to change without notice.'
            },
            {
              title: 'Shipping and Delivery',
              content: 'Delivery times are estimates and not guaranteed. We are not responsible for delays caused by carriers, customs, or other factors beyond our control.',
              list: [
                'Standard delivery: 3-5 business days'
              ]
            }
          ]
        };

      case 'shipping':
        return {
          title: 'Shipping Information',
          icon: <FaTruck className="policy-hero-icon" />,
          sections: [
            {
              title: 'Shipping Methods',
              content: 'We offer multiple shipping options to ensure your order arrives safely and on time.',
              list: [
                'Standard Shipping: 3-5 business days'
              ]
            },
            {
              title: 'Shipping Costs',
             
              list: [
                'Free shipping on all orders',
                            ]
            },
            {
              title: 'Order Processing',
              content: 'Orders are processed within 24 hours of placement. You will receive a confirmation email with tracking information once your order ships.'
            }
          ]
        };

      case 'returns':
        return {
          title: 'Returns & Exchange Policy',
          icon: <FaUndo className="policy-hero-icon" />,
          sections: [
            {
              title: 'Exchange Policy',
              content: 'We want you to love your Scentify purchase. If you are not completely satisfied, we offer exchanges for defective or damaged items.',
              list: [
                'You must contact us within 3 days of receiving your order',
                'Item must be unused and in original condition',
                'Item must be in the original packaging',
                'Accompanied by proof of purchase'
              ]
            },
            {
              title: 'Exchange Process',
              content: 'To initiate an exchange, please contact our support team at scentify25@gmail.com.com with your order number and reason for exchange. We will provide you with a return authorization and shipping instructions.'
            }
          ]
        };

      default:
        return null;
    }
  };

  const content = getContent();

  if (!content) {
    return (
      <div className="policy-page">
        <div className="policy-error">
          <h2>Page Not Found</h2>
          <p>The page you are looking for does not exist.</p>
          <Link to="/" className="policy-back-btn">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="policy-page"
    >
      <div className="policy-hero">
        <div className="policy-hero-content">
          {content.icon}
          <h1>{content.title}</h1>
          <p>Learn about our policies and how we serve you</p>
        </div>
      </div>

      <div className="policy-container">
        <div className="policy-nav">
          <Link to="/privacy-policy" className={`policy-nav-link ${page === 'privacy-policy' ? 'active' : ''}`}>
            <FaShieldAlt /> Privacy Policy
          </Link>
          <Link to="/terms" className={`policy-nav-link ${page === 'terms' ? 'active' : ''}`}>
            <FaFileContract /> Terms of Service
          </Link>
          <Link to="/shipping" className={`policy-nav-link ${page === 'shipping' ? 'active' : ''}`}>
            <FaTruck /> Shipping Info
          </Link>
          <Link to="/returns" className={`policy-nav-link ${page === 'returns' ? 'active' : ''}`}>
            <FaUndo /> Returns
          </Link>
        </div>

        <div className="policy-content">
          {content.sections.map((section, index) => (
            <div key={index} className="policy-section">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
              {section.list && (
                <ul>
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.contact && (
                <div className="policy-contact">
                  <p><strong>Email:</strong> {section.contact.email}</p>
                  <p><strong>Phone:</strong> {section.contact.phone}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PolicyPages;