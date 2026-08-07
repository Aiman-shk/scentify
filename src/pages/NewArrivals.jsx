import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../home/ProductCard';
import './CategoryPage.css';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        console.log('All products:', data);
        
        // ===== FILTER: Only show "Midnight" product =====
        const midnightProduct = data.filter(p => p.name === 'Midnight');
        setProducts(midnightProduct);
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
        <div className="category-hero arrivals-hero-dark">
          <div className="category-hero-content">
            <span className="category-hero-badge-dark">New</span>
            <h1 className="category-hero-title-dark">New Arrivals</h1>
            <p className="category-hero-subtitle-dark">Loading...</p>
          </div>
        </div>
        <div className="category-products">
          <div className="loading-grid">
            {[...Array(1)].map((_, i) => (
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
      {/* Dark Hero Section */}
      <div className="category-hero arrivals-hero-dark">
        <div className="category-hero-content">
          <span className="category-hero-badge-dark">New</span>
          <h1 className="category-hero-title-dark">New Arrivals</h1>
          <p className="category-hero-subtitle-dark">
            Discover our latest luxury fragrances
          </p>
          <div className="category-hero-stats-dark">
            <span>{products.length} New Product</span>
          </div>
        </div>
      </div>

      <div className="category-products">
        {products.length === 0 ? (
          <div className="no-products-message">
            <p>No new arrivals found.</p>
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

export default NewArrivals;