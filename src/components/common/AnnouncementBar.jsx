import React, { useEffect, useRef } from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPosition = 0;
    const speed = 0.8; // Pixels per frame

    const scroll = () => {
      if (!scrollContainer) return;

      // Check if we need to reset
      const firstChild = scrollContainer.firstChild;
      if (!firstChild) return;

      const containerWidth = scrollContainer.offsetWidth;
      const firstChildWidth = firstChild.offsetWidth;

      // Move left
      scrollPosition -= speed;

      // Reset when first child is completely out of view
      if (scrollPosition < -firstChildWidth) {
        scrollPosition += firstChildWidth;
      }

      scrollContainer.style.transform = `translateX(${scrollPosition}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    // Start animation
    animationId = requestAnimationFrame(scroll);

    // Pause on hover
    const pauseScroll = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const resumeScroll = () => {
      if (!animationId) {
        animationId = requestAnimationFrame(scroll);
      }
    };

    scrollContainer.addEventListener('mouseenter', pauseScroll);
    scrollContainer.addEventListener('mouseleave', resumeScroll);

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      scrollContainer.removeEventListener('mouseenter', pauseScroll);
      scrollContainer.removeEventListener('mouseleave', resumeScroll);
    };
  }, []);

  return (
    <div className="announcement-bar">
      <div className="announcement-track" ref={scrollRef}>
        <span className="announcement-text">
          🇵🇰 Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
        <span className="announcement-text">
          🇵🇰 Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
        <span className="announcement-text">
          🇵🇰 Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;