import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaStar, FaRegStar, FaArrowLeft, FaMinus, FaPlus, 
  FaShoppingCart
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import Reviews from '../components/Reviews/Reviews';
import './Products.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ===== FRAGRANCE NOTES DATA PER PRODUCT =====
  const fragranceNotesData = {
    'Signature': {
      topNotes: ['Bergamot', 'Ambroxan', 'Orris Root'],
      heartNotes: ['Ambergris', 'Amber', 'Jasmine', 'Pink Pepper', 'Woody Notes', 'Floral Notes'],
      baseNotes: ['Musk', 'Patchouli', 'Cashmeran', 'Woody Notes'],
      longevity: '09+ Hours',
      description: 'A sophisticated blend inspired by the office for men. bold, confident, and timeless. This fragrance opens with bright bergamot and Ambroxan, leading to a heart of ambergris, amber, and jasmine with woody undertones, and settles into a warm base of musk, patchouli, and cashmeran.',
    },
    'First Impression': {
      topNotes: ['Lime', 'Gin', 'Galbanum'],
      heartNotes: ['Mint', 'Nutmeg', 'Cypress'],
      baseNotes: ['Amber', 'Vetiver', 'Texas Cedar'],
      longevity: '07+ Hours',
      description: 'A fresh and invigorating fragrance inspired by David Beckham. Opens with crisp lime, gin, and galbanum, evolving into a heart of mint, nutmeg, and cypress, settling into a warm base of amber, vetiver, and Texas cedar.',
    },
    'Velvet Bloom': {
      topNotes: ['Purple Passion Fruit', 'Grapefruit', 'Pineapple', 'Tangerine', 'Big Strawberry'],
      heartNotes: ['Shangri-La Peony', 'Vanilla Orchid', 'Red Berries', 'Jasmine', 'Lily-of-the-Valley'],
      baseNotes: ['Musk', 'Woody Notes', 'Oakmoss', 'Italian Pine'],
      longevity: '08+ Hours',
      description: 'Inspired by Bombshell, this fragrance is a vibrant bouquet of purple passion fruit, grapefruit, and pineapple, blooming into a heart of peony, vanilla orchid, and jasmine, with a warm base of musk, oakmoss, and Italian pine.',
    },
    'Abeeha': {
      topNotes: ['Pear Blossom', 'Italian Mandarin', 'Red Berries'],
      heartNotes: ['White Gardenia', 'Jasmine Absolute', 'Frangipani'],
      baseNotes: ['Patchouli', 'Brown Sugar Accord'],
      longevity: '07+ Hours',
      description: 'Inspired by Gucci Flora, this fragrance opens with pear blossom, Italian mandarin, and red berries, blooming into a heart of white gardenia, jasmine absolute, and frangipani, with a warm base of patchouli and brown sugar accord.',
    },
    'Midnight': {
      topNotes: ['Bergamot'],
      heartNotes: ['Sichuan Pepper', 'Lavender', 'Star Anise', 'Nutmeg'],
      baseNotes: ['Ambroxan', 'Vanilla'],
      longevity: '07+ Hours',
      description: 'Inspired by Dior Sauvage, this fragrance is a bold blend of bergamot, Sichuan pepper, lavender, and star anise, with a warm base of Ambroxan and vanilla.',
    },
    'Spiced': {
      topNotes: ['Cinnamon', 'Clove', 'Oak Wood'],
      heartNotes: ['Cognac', 'Spices', 'Woody Notes'],
      baseNotes: ['Amber', 'Vanilla', 'Oakmoss'],
      longevity: '07+ Hours',
      description: 'Warm cognac infused with cinnamon, clove, and oak wood. For the bold.',
    },
    'Gardenia Bliss': {
      topNotes: ['Gardenia', 'Jasmine', 'White Tea'],
      heartNotes: ['Coconut', 'Floral Notes', 'Vanilla'],
      baseNotes: ['Musk', 'Woody Notes', 'Amber'],
      longevity: '07+ Hours',
      description: 'Fresh gardenia blossoms with hints of jasmine and white tea.',
    },
    'Cedar & Smoke': {
      topNotes: ['Cedar', 'Pepper', 'Leather'],
      heartNotes: ['Smoke', 'Woody Notes', 'Vetiver'],
      baseNotes: ['Musk', 'Amber', 'Oakmoss'],
      longevity: '07+ Hours',
      description: 'Smoky cedar with a touch of leather and pepper. Rugged and sophisticated.',
    },
    'Citrus Sunrise': {
      topNotes: ['Grapefruit', 'Lemon', 'Bergamot', 'Orange'],
      heartNotes: ['Citrus', 'Floral Notes', 'Jasmine'],
      baseNotes: ['Musk', 'Woody Notes', 'Amber'],
      longevity: '07+ Hours',
      description: 'Zesty citrus with grapefruit, lemon, and bergamot. A burst of energy.',
    },
  };
  // =========================================

  // ===== SECOND IMAGE FROM FRONTEND =====
  const getSecondImage = (productName) => {
    const imageMap = {
      'Signature': '/images/signature2.jpg',
      'Midnight': '/images/midnight2.jpg',
      'Abeeha': '/images/abeeha2.jpg',
      'Velvet Bloom': '/images/velvetbloom2.jpg',
      'First Impression': '/images/firstimpression2.jpg',
      'Spiced': '/images/spiced2.jpg',
      'Gardenia Bliss': '/images/gardenia2.jpg',
      'Cedar & Smoke': '/images/cedar2.jpg',
      'Citrus Sunrise': '/images/citrus2.jpg',
    };
    return imageMap[productName] || '/images/placeholder2.jpg';
  };
  // ======================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.image);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching product:', error);
        setError(error.message);
        setLoading(false);
        setTimeout(() => {
          navigate('/products');
        }, 3000);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star empty" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (product && product.inStock) {
      addToCart(product, quantity);
      alert(`${product.name} added to cart! 🛒`);
    }
  };

  // ===== Get product-specific notes =====
  const productNotes = fragranceNotesData[product?.name] || fragranceNotesData['Signature'];
  const topNotes = productNotes?.topNotes || [];
  const heartNotes = productNotes?.heartNotes || [];
  const baseNotes = productNotes?.baseNotes || [];
  const longevity = productNotes?.longevity || '07+ Hours';
  const description = productNotes?.description || product?.description || 'No description available.';
  // =====================================

  // ===== BUILD THUMBNAILS =====
  const thumbnails = [
    product?.image || '/images/placeholder.jpg',
    getSecondImage(product?.name),
  ].filter(Boolean);
  // ============================

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <h2>❌ Product Not Found</h2>
        <p>{error || 'The product you are looking for does not exist.'}</p>
        <Link to="/products" className="back-to-products">
          <FaArrowLeft /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="product-details-wrapper"
    >
      <div className="product-details-container">
        {/* Back Button */}
        <button onClick={() => navigate('/products')} className="back-btn">
          <FaArrowLeft /> Back to Products
        </button>

        {/* Main Product Card */}
        <div className="product-card-main product-card-single-image">
          {/* Left Column - Images with Thumbnails */}
          <div className="product-single-image-wrapper">
            <div className="product-image-with-thumbnails">
              {/* Thumbnails - Left Side */}
              <div className="thumbnail-strip-vertical">
                {thumbnails.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`thumbnail-vertical-item ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="product-single-image">
                <img src={selectedImage} alt={product.name} />
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="product-details-column">
            {/* Product Name */}
            <h1 className="product-detail-name">{product.name}</h1>
            
            {/* ===== SUBTITLE REMOVED ===== */}
            {/* <p className="product-detail-subtitle">
              {product.fragranceType || 'LUXURY FRAGRANCE'}
              <span className="subtitle-gender">FOR {product.gender?.toUpperCase() || 'UNISEX'}</span>
            </p> */}

            {/* Rating Section - No reviews count */}
            <div className="rating-section">
              <div className="stars-wrapper">{renderStars(product.rating)}</div>
              <span className="rating-number">{product.rating}</span>
            </div>

            {/* ===== PRICE ===== */}
            <div className="price-above-notes">
              <span className="current-price">Rs. {product.price.toFixed(0)}</span>
              {product.originalPrice && (
                <span className="original-price">Rs. {product.originalPrice.toFixed(0)}</span>
              )}
            </div>

            {/* ===== BEAUTIFUL NOTES DISPLAY ===== */}
            <div className="notes-display">
              {/* Top Notes */}
              <div className="note-category">
                <h3 className="note-category-title">Top Notes</h3>
                <div className="note-tags">
                  {topNotes.map((note, index) => (
                    <span key={index} className="note-tag">{note}</span>
                  ))}
                </div>
              </div>

              {/* Heart Notes */}
              <div className="note-category">
                <h3 className="note-category-title">Heart Notes</h3>
                <div className="note-tags">
                  {heartNotes.map((note, index) => (
                    <span key={index} className="note-tag">{note}</span>
                  ))}
                </div>
              </div>

              {/* Base Notes */}
              <div className="note-category">
                <h3 className="note-category-title">Base Notes</h3>
                <div className="note-tags">
                  {baseNotes.map((note, index) => (
                    <span key={index} className="note-tag">{note}</span>
                  ))}
                </div>
              </div>

              {/* Longevity */}
              <div className="note-longevity">
                <span className="longevity-label">LONGEVITY</span>
                <span className="longevity-value">{longevity}</span>
              </div>
            </div>

            {/* ===== DESCRIPTION ===== */}
            <div className="product-info-centered">
              <div className="info-section">
                <h3 className="info-section-title">Description</h3>
                <p className="info-section-content">{description}</p>
              </div>

              {/* ===== SHIPPING INFORMATION REMOVED ===== */}
              {/* <div className="info-section">
                <h3 className="info-section-title">Shipping Information</h3>
                <p className="info-section-content">
                  Free shipping on orders over $50. Standard delivery takes 3-5 business days.
                  <br />
                  Express shipping available at checkout.
                </p>
              </div> */}

              {/* Quantity & Add to Cart */}
              {product.inStock && (
                <div className="add-to-cart-section">
                  <div className="quantity-selector">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-btn"
                    >
                      <FaMinus />
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="qty-btn"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button onClick={handleAddToCart} className="add-to-cart-btn">
                    <FaShoppingCart /> Add to Cart
                    <span className="total-price">Rs. {(product.price * quantity).toFixed(0)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== CUSTOMER REVIEWS SECTION ===== */}
        <div className="reviews-wrapper">
          <Reviews productId={product._id} productName={product.name} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;