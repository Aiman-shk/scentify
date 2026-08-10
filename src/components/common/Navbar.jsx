import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import CartDrawer from '../CartDrawer/CartDrawer';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { getWishlistCount } = useWishlist();
  const itemCount = getTotalItems();
  const wishlistCount = getWishlistCount();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close side menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearch(false);
      setSearchTerm('');
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* ===== HAMBURGER MENU BUTTON (LEFT SIDE) ===== */}
        <button
          className="icon-container menu-btn"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars className="icon" />
        </button>

        {/* ===== UPDATED LOGO ===== */}
        <div className="logo">
          <Link to="/">
            <span className="logo-main">SCENTIFY</span>
            <span className="logo-sub">Perfumes</span>
          </Link>
        </div>

        <ul className="nav-links">
          <li className={isActive('/')}>
            <Link to="/">Home</Link>
          </li>
          <li className={isActive('/products')}>
            <Link to="/products">Perfumes</Link>
          </li>
          <li className={isActive('/about')}>
            <Link to="/about">About</Link>
          </li>
        </ul>

        <div className="nav-icons">
          {/* ===== SEARCH ICON ===== */}
          <button 
            className="icon-container search-btn"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
          >
            <FaSearch className="icon" />
          </button>

          <Link to="/wishlist" className="icon-container">
            <FaHeart className="icon" />
            {wishlistCount > 0 && (
              <span className="cart-badge">{wishlistCount}</span>
            )}
          </Link>

          {/* ===== CART ICON - OPENS DRAWER ===== */}
          <button 
            className="icon-container cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            <FaShoppingCart className="icon" />
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </button>
        </div>

        {/* ===== SEARCH DROPDOWN ===== */}
        {showSearch && (
          <div className="search-dropdown">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search for fragrances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="search-input-dropdown"
              />
              <button type="submit" className="search-submit-btn">
                <FaSearch />
              </button>
            </form>
            <button 
              className="search-close-btn"
              onClick={() => setShowSearch(false)}
            >
              ✕
            </button>
          </div>
        )}
      </nav>

      {/* ===== LEFT SIDE MENU OVERLAY ===== */}
      {isMenuOpen && (
        <div className="side-menu-overlay" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* ===== LEFT SIDE MENU DRAWER ===== */}
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="side-menu-header">
          <span className="side-menu-title">Menu</span>
          <button
            className="side-menu-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <FaTimes />
          </button>
        </div>
        <ul className="side-menu-links">
          <li className={isActive('/')}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li className={isActive('/products')}>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Perfumes</Link>
          </li>
          <li className={isActive('/about')}>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
          </li>
          <li className={isActive('/contact')}>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          </li>
        </ul>
      </div>

      {/* ===== CART DRAWER ===== */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;