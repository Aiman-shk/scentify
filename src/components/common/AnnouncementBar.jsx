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
            <svg width="22" height="16" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="20" fill="#01411C"/>
              <rect x="0" width="6" height="20" fill="#FFFFFF"/>
              <path d="M18 4C13.5 4 10 7.5 10 12C10 16.5 13.5 20 18 20C19.5 20 21 19.5 22.5 18.5C19.5 19.5 15.5 18.5 13.5 15.5C11.5 12.5 12 8 14.5 5.5C15.5 4.5 16.5 4 18 4Z" fill="#FFFFFF"/>
              <path d="M22 6L22.5 7.5L24 8L22.5 8.5L22 10L21.5 8.5L20 8L21.5 7.5L22 6Z" fill="#FFFFFF"/>
            </svg>
          </span>
          Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
        <span className="announcement-text">
          <span className="flag-pk">
            <svg width="22" height="16" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="20" fill="#01411C"/>
              <rect x="0" width="6" height="20" fill="#FFFFFF"/>
              <path d="M18 4C13.5 4 10 7.5 10 12C10 16.5 13.5 20 18 20C19.5 20 21 19.5 22.5 18.5C19.5 19.5 15.5 18.5 13.5 15.5C11.5 12.5 12 8 14.5 5.5C15.5 4.5 16.5 4 18 4Z" fill="#FFFFFF"/>
              <path d="M22 6L22.5 7.5L24 8L22.5 8.5L22 10L21.5 8.5L20 8L21.5 7.5L22 6Z" fill="#FFFFFF"/>
            </svg>
          </span>
          Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
        <span className="announcement-text">
          <span className="flag-pk">
            <svg width="22" height="16" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="20" fill="#01411C"/>
              <rect x="0" width="6" height="20" fill="#FFFFFF"/>
              <path d="M18 4C13.5 4 10 7.5 10 12C10 16.5 13.5 20 18 20C19.5 20 21 19.5 22.5 18.5C19.5 19.5 15.5 18.5 13.5 15.5C11.5 12.5 12 8 14.5 5.5C15.5 4.5 16.5 4 18 4Z" fill="#FFFFFF"/>
              <path d="M22 6L22.5 7.5L24 8L22.5 8.5L22 10L21.5 8.5L20 8L21.5 7.5L22 6Z" fill="#FFFFFF"/>
            </svg>
          </span>
          Azadi Sale is Live Now! &nbsp;•&nbsp; Free Delivery on Orders Above Rs. 3000
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;