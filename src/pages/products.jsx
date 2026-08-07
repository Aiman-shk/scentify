import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProductCard from '../home/ProductCard';
import { FaSlidersH, FaTimes } from 'react-icons/fa';
import './Products.css';

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortOption, setSortOption] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        console.log('📦 Products fetched:', data.length);
        console.log('📦 First product:', data[0]);

        // ===== FIXED: ALWAYS 50 ML for all products =====
        const productsWithExtras = data.map((product) => ({
          ...product,
          size: '50 ML',  // ← EVERY product shows 50 ML
          gender: product.gender || 'Unisex',
        }));
        // ================================================
        
        console.log('📦 Products with extras:', productsWithExtras.length);
        setProducts(productsWithExtras);
        setFilteredProducts(productsWithExtras);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ===== GET SEARCH FROM URL =====
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  // ===== CATEGORY FILTER REMOVED =====
  // Only keep gender filter
  const genders = ['All', ...new Set(products.map(p => p.gender || 'Unisex'))];

  // Filter and sort products
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];
    console.log('🔍 Before filters:', result.length);
    
    // Search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        // Category removed from search
      );
      console.log('🔍 After search:', result.length);
    }
    
    // ===== CATEGORY FILTER REMOVED =====
    // if (selectedCategory !== 'All') {
    //   result = result.filter(product => product.category === selectedCategory);
    // }
    
    // Gender filter
    if (selectedGender !== 'All') {
      result = result.filter(product => product.gender === selectedGender);
      console.log('🔍 After gender:', result.length);
    }
    
    // Price filter
    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    console.log('🔍 After price:', result.length);
    
    // Sorting
    if (sortOption === 'price-low-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high-low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    console.log('✅ Final filtered products:', result.length);
    setFilteredProducts(result);
  }, [searchTerm, selectedGender, priceRange, sortOption, products]);
  // selectedCategory removed from dependencies

  const handlePriceChange = (e, index) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedGender('All');
    setPriceRange([0, 20000]);
    setSortOption('default');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || selectedGender !== 'All' || priceRange[0] > 0 || priceRange[1] < 20000 || sortOption !== 'default';

  if (isLoading) {
    return (
      <div className="products-page">
        <div className="products-hero">
          <div className="products-hero-content">
            <h1 className="products-title">Our Collection</h1>
            <p className="products-subtitle">Loading fragrances...</p>
          </div>
        </div>
        <div className="products-container">
          <div className="products-grid loading">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
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
      className="products-page"
    >
      <div className="products-hero">
        <div className="products-hero-content">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="products-title"
          >
            Our Collection
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="products-subtitle"
          >
            {searchTerm ? `Showing results for "${searchTerm}"` : 'Discover your signature scent'}
          </motion.p>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm('');
                window.history.pushState({}, '', '/products');
              }}
            >
              Clear Search ✕
            </motion.button>
          )}
        </div>
      </div>

      <div className="products-container">
        {/* ===== FILTER BAR ===== */}
        <div className="filter-bar">
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaSlidersH />
            <span>Filters</span>
            {hasActiveFilters && <span className="filter-badge">•</span>}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="filters-expanded"
            >
              <div className="filters-grid">
                {/* ===== CATEGORY FILTER REMOVED ===== */}
                
                <div className="filter-group">
                  <label className="filter-label">Gender</label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="filter-select"
                  >
                    {genders.map(gender => (
                      <option key={gender} value={gender}>{gender}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Sort By</label>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="filter-select"
                  >
                    <option value="default">Featured</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                <div className="filter-group price-group">
                  <label className="filter-label">
                    Price Range: Rs. {priceRange[0]} - Rs. {priceRange[1]}
                  </label>
                  <div className="price-sliders">
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="price-slider"
                    />
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="price-slider"
                    />
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="reset-filters-wrapper">
                  <button onClick={resetFilters} className="reset-filters-btn">
                    <FaTimes /> Reset All Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="results-bar">
          <span className="results-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </span>
          {hasActiveFilters && (
            <span className="active-filters-count">
              {searchTerm && <span className="filter-tag">Search: "{searchTerm}"</span>}
              {selectedCategory !== 'All' && <span className="filter-tag">{selectedCategory}</span>}
              {selectedGender !== 'All' && <span className="filter-tag">{selectedGender}</span>}
              {(priceRange[0] > 0 || priceRange[1] < 20000) && (
                <span className="filter-tag">Rs. {priceRange[0]} - Rs. {priceRange[1]}</span>
              )}
              {sortOption !== 'default' && <span className="filter-tag">{sortOption.replace('-', ' ')}</span>}
            </span>
          )}
        </div>

        <div className="products-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="no-results"
          >
            <div className="no-results-icon">🔍</div>
            <h3>No fragrances found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={resetFilters} className="reset-filters-btn primary">
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Products;