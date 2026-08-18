import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaShieldAlt, FaGift, FaLock } from 'react-icons/fa';
import Hero from '../home/Hero';
import BestSellerCarousel from '../home/BestSellerCarousel';
import './Home.css';
import API_URL from '../api/config';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <Hero />
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Best Sellers</span>
              <h2>Featured Fragrances</h2>
              <p className="loading-text">Loading...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="home-page"
    >
      <Hero />

      {products.length > 0 && (
        <BestSellerCarousel products={products} />
      )}

      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon"><FaLock /></div>
              <h3>Secure Payments</h3>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon"><FaShieldAlt /></div>
              <h3>Authenticity Guaranteed</h3>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon"><FaGift /></div>
              <h3>Luxury Packaging</h3>
            </motion.div>

            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="feature-card"
            >
              <div className="feature-icon"><FaStar /></div>
              <h3>Premium Quality</h3>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;