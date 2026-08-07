import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper function to get product ID (works with both _id and id)
const getProductId = (product) => {
  return product._id || product.id;
};

// Cart Provider component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart (supports both _id and id)
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const productId = getProductId(product);
      
      // Check if item already exists in cart
      const existingItem = prevItems.find(item => {
        const itemId = getProductId(item);
        return itemId === productId;
      });
      
      if (existingItem) {
        // If exists, update quantity
        return prevItems.map(item => {
          const itemId = getProductId(item);
          if (itemId === productId) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        // If new item, add to cart
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => {
        const itemId = getProductId(item);
        return itemId !== productId;
      })
    );
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        const itemId = getProductId(item);
        if (itemId === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total items in cart
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Context value
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};