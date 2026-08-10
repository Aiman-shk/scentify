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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
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
        </ul>

        {/* ===== NAV ICONS ===== */}
        <div className="nav-icons">
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

          {/* ===== HAMBURGER MENU TOGGLE ===== */}
          <button
            className="hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
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

      {/* ===== MOBILE MENU ===== */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              SCENTIFY
              <span>Perfumes</span>
            </div>
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <nav className="mobile-nav">
            <Link
              to="/"
              className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link
              to="/products"
              className={`mobile-nav-link ${location.pathname === '/products' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              🌸 Perfumes
            </Link>
            <Link
              to="/about"
              className={`mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ℹ️ About
            </Link>
            <Link
              to="/wishlist"
              className={`mobile-nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ❤️ Wishlist
              {wishlistCount > 0 && <span className="mobile-badge">{wishlistCount}</span>}
            </Link>
            <button
              className="mobile-nav-link"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
            >
              🛒 Cart
              {itemCount > 0 && <span className="mobile-badge">{itemCount}</span>}
            </button>
          </nav>
          <div className="mobile-menu-footer">
            <p>© 2026 Scentify</p>
          </div>
        </div>
      </div>

      {/* ===== CART DRAWER ===== */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;