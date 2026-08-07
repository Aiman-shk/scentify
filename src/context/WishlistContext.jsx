import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Wishlist Context
const WishlistContext = createContext();

// Custom hook to use wishlist
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

// Wishlist Provider
export const WishlistProvider = ({ children }) => {
  // Initialize wishlist from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    setWishlistItems(prevItems => {
      const productId = product._id || product.id;
      const exists = prevItems.some(item => {
        const itemId = item._id || item.id;
        return itemId === productId;
      });
      
      if (exists) {
        return prevItems;
      } else {
        return [...prevItems, product];
      }
    });
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => {
        const itemId = item._id || item.id;
        return itemId !== productId;
      })
    );
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => {
      const itemId = item._id || item.id;
      return itemId === productId;
    });
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Get total wishlist count
  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};