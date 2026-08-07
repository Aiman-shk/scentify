import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // ← Removed FaStar
import './Hero.css';

// Import your perfume bottle images (replace with your actual images)
import mainBottle from '../assets/images/main-perfume.jpg';
import bottle1 from '../assets/images/perfume-1.jpg';
import bottle2 from '../assets/images/perfume-2.jpg';

const Hero = () => {
  // ===== PARTICLES REMOVED =====
  // const particlesRef = useRef(null);
  // useEffect(() => { ... }, []);

  return (
    <section className="hero">
      {/* ===== PARTICLES CANVAS REMOVED ===== */}
      {/* <canvas ref={particlesRef} className="hero-particles" /> */}

      {/* Background Glow */}
      <div className="hero-glow" />

      <div className="hero-container">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hero-content"
        >
          {/* ===== BADGE REMOVED ===== */}
          {/* <motion.div ... className="hero-badge"> */}

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-title"
          >
            <span className="title-line">Crafted Luxury</span>
            <span className="title-line highlight">In Every Spray</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hero-description"
          >
            Discover our curated collection of premium fragrances,
            meticulously crafted to tell your unique story.
            Each scent is a masterpiece of luxury and sophistication.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="hero-buttons"
          >
            <Link to="/products" className="btn-primary">
              Shop Now
              <FaArrowRight className="btn-icon" />
            </Link>
            <Link to="/products" className="btn-secondary">
              Explore Collection
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Content - Perfume Bottles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="hero-visual"
        >
          <div className="bottles-container">
            {/* Background Bottles */}
            <motion.div
              initial={{ opacity: 0, y: 30, x: -20 }}
              animate={{ opacity: 0.4, y: 0, x: -20 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bottle bottle-back-1"
            >
              <img src={bottle2 || 'https://via.placeholder.com/150/8b7355/ffffff?text=Perfume'} alt="Perfume" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20, x: 30 }}
              animate={{ opacity: 0.3, y: 0, x: 30 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bottle bottle-back-2"
            >
              <img src={bottle1 || 'https://via.placeholder.com/120/d4af37/ffffff?text=Perfume'} alt="Perfume" />
            </motion.div>

            {/* Main Bottle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
              className="bottle bottle-main"
            >
              <div className="bottle-glow" />
              <img 
                src={mainBottle || 'https://via.placeholder.com/300/c9a96e/ffffff?text=✨'} 
                alt="Featured Perfume" 
              />
              <div className="bottle-float-layer" />
            </motion.div>

            {/* ===== SPARKLES KEPT (they are not particles) ===== */}
            <motion.div
              className="sparkle sparkle-1"
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="sparkle sparkle-2"
              animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="sparkle sparkle-3"
              animate={{ opacity: [0.1, 0.6, 0.1], scale: [0.7, 1.1, 0.7] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="hero-scroll"
      >
        <span className="scroll-text">Scroll</span>
        <div className="scroll-line" />
      </motion.div>
    </section>
  );
};

export default Hero;