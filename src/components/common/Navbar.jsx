import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch, FaBars, FaTimes, FaHome, FaTag, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
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
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close side menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSideMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* ===== HAMBURGER MENU BUTTON ===== */}
        <button 
          className="hamburger-btn"
          onClick={() => setIsSideMenuOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>

        {/* ===== LOGO ===== */}
        <div className="logo">
          <Link to="/">
            <span className="logo-main">SCENTIFY</span>
            <span className="logo-sub">Perfumes</span>
          </Link>
        </div>

        {/* ===== DESKTOP NAV LINKS ===== */}
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
          <li className={isActive('/contact')}>
            <Link to="/contact">Contact</Link>
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
      <div 
        className={`side-menu-overlay ${isSideMenuOpen ? 'open' : ''}`}
        onClick={closeSideMenu}
      />

      {/* ===== LEFT SIDE MENU ===== */}
      <div className={`side-menu ${isSideMenuOpen ? 'open' : ''}`}>
        <div className="side-menu-header">
          <div className="side-menu-logo">
            SCENTIFY
            <span>Perfumes</span>
          </div>
          <button className="side-menu-close" onClick={closeSideMenu}>
            <FaTimes />
          </button>
        </div>

        <nav className="side-menu-nav">
          <Link 
            to="/" 
            className={`side-menu-link ${isActive('/')}`}
            onClick={closeSideMenu}
          >
            <FaHome /> Home
          </Link>
          <Link 
            to="/products" 
            className={`side-menu-link ${isActive('/products')}`}
            onClick={closeSideMenu}
          >
            <FaTag /> Perfumes
          </Link>
          <Link 
            to="/about" 
            className={`side-menu-link ${isActive('/about')}`}
            onClick={closeSideMenu}
          >
            <FaInfoCircle /> About
          </Link>
          <Link 
            to="/contact" 
            className={`side-menu-link ${isActive('/contact')}`}
            onClick={closeSideMenu}
          >
            <FaEnvelope /> Contact Us
          </Link>
        </nav>

        <div className="side-menu-footer">
          <p>© 2026 Scentify</p>
        </div>
      </div>

      {/* ===== CART DRAWER ===== */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;