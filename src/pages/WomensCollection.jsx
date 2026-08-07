import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../home/ProductCard';
import './CategoryPage.css';

const WomensCollection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        const womensProducts = data.filter(p => p.gender === 'Women' || p.gender === 'Unisex');
        setProducts(womensProducts);
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
      <div className="category-page">
        <div className="category-hero womens-hero">
          <div className="category-hero-content">
            <span className="category-hero-badge">Women</span>
            <h1>Women's Collection</h1>
            <p>Elegant, floral, and captivating scents</p>
          </div>
        </div>
        <div className="category-products">
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="product-skeleton"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="category-page"
    >
      <div className="category-hero womens-hero-warm">
        <div className="category-hero-content">
          <span className="category-hero-badge-warm">Women</span>
          <h1 className="category-hero-title-warm">Women's Collection</h1>
          <p className="category-hero-subtitle-warm">
            Elegant, floral, and captivating scents
          </p>
          <div className="category-hero-stats-warm">
            <span>{products.length} Products</span>
          </div>
        </div>
      </div>

      <div className="category-products">
        {products.length === 0 ? (
          <div className="no-products-message">
            <p>No products found in this collection.</p>
          </div>
        ) : (
          <div className="category-products-grid">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WomensCollection;