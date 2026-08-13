import React, { useEffect, useRef } from 'react';
import './AnnouncementBar.css';

const AnnouncementBar = () => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId;
    let scrollPosition = 0;
    const speed = 0.8;

    const scroll = () => {
      if (!scrollContainer) return;
      const firstChild = scrollContainer.firstChild;
      if (!firstChild) return;

      scrollPosition -= speed;
      const firstChildWidth = firstChild.offsetWidth;

      if (scrollPosition < -firstChildWidth) {
        scrollPosition += firstChildWidth;
      }

      scrollContainer.style.transform = `translateX(${scrollPosition}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

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