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
          <span className="flag-pk">
            <svg width="20" height="14" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="20" fill="#01411C"/>
              <rect x="10" width="20" height="20" fill="#FFFFFF"/>
              <rect x="10" width="20" height="20" fill="#01411C"/>
              <circle cx="18" cy="10" r="6" fill="#FFFFFF"/>
              <circle cx="18" cy="10" r="5" fill="#01411C"/>
              <path d="M22 8L20 10L22 12L18 10L22 8Z" fill="#FFFFFF"/>
              <path d="M22 10L20 8L22 6L18 10L22 14Z" fill="#FFFFFF"/>
              <path d="M22 8L20 10L22 12L18 10L22 8Z" fill="#01411C" opacity="0.3"/>
              <path d="M18 5C19.5 5 20.5 6 21 7.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
              <path d="M18 15C19.5 15 20.5 14 21 12.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
              <circle cx="18" cy="10" r="3" fill="#01411C"/>
              <circle cx="18" cy="10" r="2" fill="#FFFFFF"/>
              <circle cx="18" cy="10" r="1" fill="#01411C"/>
              <path d="M22 6L21 8L24 9L21 10L22 12L25 10L22 13L24 15L21 14L18 15L20 13L17 12L20 11L18 9L21 8L22 6Z" fill="#FFFFFF"/>
            </svg>
          </span>
          Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
        <span className="announcement-text">
          <span className="flag-pk">
            <svg width="20" height="14" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="20" fill="#01411C"/>
              <rect x="10" width="20" height="20" fill="#FFFFFF"/>
              <rect x="10" width="20" height="20" fill="#01411C"/>
              <circle cx="18" cy="10" r="6" fill="#FFFFFF"/>
              <circle cx="18" cy="10" r="5" fill="#01411C"/>
              <path d="M22 8L20 10L22 12L18 10L22 8Z" fill="#FFFFFF"/>
              <path d="M22 10L20 8L22 6L18 10L22 14Z" fill="#FFFFFF"/>
              <path d="M22 8L20 10L22 12L18 10L22 8Z" fill="#01411C" opacity="0.3"/>
              <path d="M18 5C19.5 5 20.5 6 21 7.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
              <path d="M18 15C19.5 15 20.5 14 21 12.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
              <circle cx="18" cy="10" r="3" fill="#01411C"/>
              <circle cx="18" cy="10" r="2" fill="#FFFFFF"/>
              <circle cx="18" cy="10" r="1" fill="#01411C"/>
              <path d="M22 6L21 8L24 9L21 10L22 12L25 10L22 13L24 15L21 14L18 15L20 13L17 12L20 11L18 9L21 8L22 6Z" fill="#FFFFFF"/>
            </svg>
          </span>
          Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
        <span className="announcement-text">
          <span className="flag-pk">
            <svg width="20" height="14" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="20" fill="#01411C"/>
              <rect x="10" width="20" height="20" fill="#FFFFFF"/>
              <rect x="10" width="20" height="20" fill="#01411C"/>
              <circle cx="18" cy="10" r="6" fill="#FFFFFF"/>
              <circle cx="18" cy="10" r="5" fill="#01411C"/>
              <path d="M22 8L20 10L22 12L18 10L22 8Z" fill="#FFFFFF"/>
              <path d="M22 10L20 8L22 6L18 10L22 14Z" fill="#FFFFFF"/>
              <path d="M22 8L20 10L22 12L18 10L22 8Z" fill="#01411C" opacity="0.3"/>
              <path d="M18 5C19.5 5 20.5 6 21 7.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
              <path d="M18 15C19.5 15 20.5 14 21 12.5" stroke="#FFFFFF" strokeWidth="1.5" fill="none"/>
              <circle cx="18" cy="10" r="3" fill="#01411C"/>
              <circle cx="18" cy="10" r="2" fill="#FFFFFF"/>
              <circle cx="18" cy="10" r="1" fill="#01411C"/>
              <path d="M22 6L21 8L24 9L21 10L22 12L25 10L22 13L24 15L21 14L18 15L20 13L17 12L20 11L18 9L21 8L22 6Z" fill="#FFFFFF"/>
            </svg>
          </span>
          Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;