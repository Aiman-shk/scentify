import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaAward, FaShippingFast, FaHandshake, FaArrowRight } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="about-page"
    >
      {/* ===== STORY SECTION ===== */}
      <section className="about-story">
        <div className="about-story-container">
          <div className="about-story-image">
            <div className="about-story-image-placeholder">
              <span>🪄</span>
            </div>
          </div>
          <div className="about-story-text">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="about-story-badge">Our Story</span>
              <h2 className="about-story-title">
                A Passion for <br />Fragrance
              </h2>
              <p className="about-story-description">
                Founded with a vision to redefine luxury perfumery, Scentify 
                brings together the finest ingredients from around the world. 
                Each fragrance is a masterpiece, carefully blended by master 
                perfumers to create scents that are timeless, elegant, and 
                unforgettable.
              </p>
              <p className="about-story-description">
                We believe that perfume is more than just a scent—it's a form 
                of self-expression, a memory, and a feeling. Our mission is to 
                help you find the fragrance that tells your story.
              </p>
              <Link to="/products" className="about-story-btn">
                Explore Our Collection <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== VALUES SECTION ===== */}
      <section className="about-values">
        <div className="about-values-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="about-values-header"
          >
            <span className="about-values-badge">Why Scentify</span>
            <h2 className="about-values-title">Our Values</h2>
            <p className="about-values-subtitle">
              What sets us apart in the world of luxury fragrances
            </p>
          </motion.div>

          <div className="about-values-grid">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="about-value-card"
            >
              <div className="about-value-icon"><FaLeaf /></div>
              <h3>Premium Ingredients</h3>
              <p>We source only the finest natural ingredients from around the globe.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="about-value-card"
            >
              <div className="about-value-icon"><FaAward /></div>
              <h3>Expert Craftsmanship</h3>
              <p>Each fragrance is created by master perfumers with decades of experience.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="about-value-card"
            >
              <div className="about-value-icon"><FaShippingFast /></div>
              <h3>Sustainable Luxury</h3>
              <p>We are committed to ethical sourcing and environmentally conscious practices.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="about-value-card"
            >
              <div className="about-value-icon"><FaHandshake /></div>
              <h3>Customer First</h3>
              <p>Your satisfaction is our priority, from the first spray to the last drop.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;