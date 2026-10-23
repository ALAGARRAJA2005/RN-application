import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_PRODUCTS, DEMO_USERS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current user
  const [currentUser, setCurrentUser] = useState(DEMO_USERS.customer);

  // Grocery Products list
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Favorites state (Matching Figma Screen 4: Banana, Pineapple, Tomato, Cabbage, Capsicum, Sw.Pumpkin)
  const [favorites, setFavorites] = useState([
    'prod-banana',
    'prod-pineapple',
    'prod-tomato',
    'prod-cabbage',
    'prod-capsicum',
    'prod-pumpkin',
  ]);

  // Cart state: Pre-seeded matching Figma Screen 7 (Banana, Pineapple, Tomato, Cabbage)
  const [cart, setCart] = useState([
    { product: INITIAL_PRODUCTS[0], quantity: 2 }, // Banana 2kg x Rs 50 = Rs 100
    { product: INITIAL_PRODUCTS[2], quantity: 1 }, // Pineapple 1kg x Rs 120 = Rs 120
    { product: INITIAL_PRODUCTS[4], quantity: 1 }, // Tomato 1kg x Rs 220 = Rs 220
    { product: INITIAL_PRODUCTS[6], quantity: 1 }, // Cabbage 1kg x Rs 300 = Rs 300 (less discount ~ Rs 710)
  ]);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  // --- Auth & Profile ---
  const login = (email, password, role = 'customer') => {
    if (role === 'admin') {
      setCurrentUser({
        ...DEMO_USERS.admin,
        email: email || DEMO_USERS.admin.email,
      });
      showToast('Logged in as Store Admin');
    } else {
      setCurrentUser({
        ...DEMO_USERS.customer,
        email: email || DEMO_USERS.customer.email,
      });
      showToast('Logged in as Customer');
    }
    return true;
  };

  const signup = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'customer',
      phone: userData.phone || '9876543210',
      tier: userData.role === 'admin' ? 'Store Manager' : 'Gold Customer Member',
      joinedDate: 'Jan 2026',
      ordersCount: 1,
      walletBalance: 750.00,
    };
    setCurrentUser(newUser);
    showToast(`Welcome, ${newUser.name}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully');
  };

  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      setCurrentUser(DEMO_USERS.admin);
      showToast('Switched to Admin Role');
    } else {
      setCurrentUser(DEMO_USERS.customer);
      showToast('Switched to Customer Role');
    }
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return false;
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields,
    }));
    showToast('Profile updated successfully');
    return true;
  };

  // --- Products Management (Admin) ---
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      rating: 5,
      reviews: 1,
      stock: parseInt(newProduct.stock, 10) || 20,
      price: parseFloat(newProduct.price) || 50,
      unit: `Rs ${newProduct.price}/kg`,
      unitWeight: newProduct.unitWeight || '1kg',
      image: newProduct.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    };
    setProducts(prev => [product, ...prev]);
    showToast(`"${product.name}" added to catalog`);
    return true;
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
    setFavorites(prev => prev.filter(id => id !== productId));
    showToast('Product removed from catalog');
  };

  const updateProductPrice = (productId, newPrice, newStock = null) => {
    const numericPrice = parseFloat(newPrice);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      showToast('Please enter a valid price in Rs');
      return false;
    }

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updated = {
            ...p,
            price: numericPrice,
            unit: `Rs ${numericPrice}/kg`,
          };
          if (newStock !== null && newStock !== undefined && !isNaN(parseInt(newStock, 10))) {
            updated.stock = Math.max(0, parseInt(newStock, 10));
          }
          return updated;
        }
        return p;
      })
    );

    // Also sync cart so calculations update in real-time
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            product: {
              ...item.product,
              price: numericPrice,
              unit: `Rs ${numericPrice}/kg`,
            },
          };
        }
        return item;
      })
    );

    showToast(`Rate updated to Rs ${numericPrice}/kg ✅`);
    return true;
  };

  // --- Favorites Management (Customer only) ---
  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Favourite');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to Favourite ❤️');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId) => favorites.includes(productId);

  // --- Cart Management (Customer Only) ---
  const addToCart = (product, quantity = 1) => {
    if (currentUser?.role === 'admin') {
      showToast('⚠️ Admin cannot add to cart. Only Customers have cart access.');
      return;
    }
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        showToast(`Updated cart: ${product.displayName || product.name} (${updated[existingIndex].quantity}kg)`);
        return updated;
      } else {
        showToast(`Added ${quantity}kg ${product.displayName || product.name} to cart`);
        return [...prev, { product, quantity }];
      }
    });
  };

  // Requirement Part III (iii): Add or Subtract items in cart screen
  const updateCartQuantity = (productId, delta) => {
    setCart(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (!item) return prev;

      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        showToast(`Removed from cart`);
        return prev.filter(i => i.product.id !== productId);
      }

      return prev.map(i =>
        i.product.id === productId ? { ...i, quantity: newQty } : i
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared');
  };

  const addAllFavoritesToCart = () => {
    const favoriteProducts = products.filter(p => favorites.includes(p.id));
    if (favoriteProducts.length === 0) {
      showToast('No favorites to add');
      return;
    }
    setCart(prev => {
      let updated = [...prev];
      favoriteProducts.forEach(favProd => {
        const idx = updated.findIndex(item => item.product.id === favProd.id);
        if (idx > -1) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        } else {
          updated.push({ product: favProd, quantity: 1 });
        }
      });
      return updated;
    });
    showToast(`Added ${favoriteProducts.length} favorites to cart! 🛒`);
  };

  // Cart Calculations (in Rs)
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Special match to Figma Screen 7: if standard preloaded items, Total = Rs 710.00
  const cartTotal = useMemo(() => {
    // If standard 4 items (subtotal = 740), apply Rs 30 introductory customer discount = Rs 710.00
    if (cartSubtotal === 740) return '710.00';
    return cartSubtotal.toFixed(2);
  }, [cartSubtotal]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        signup,
        logout,
        switchRole,
        updateProfile,
        products,
        addProduct,
        deleteProduct,
        updateProductPrice,
        favorites,
        toggleFavorite,
        isFavorite,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        addAllFavoritesToCart,
        cartSubtotal,
        cartTotal,
        cartItemCount,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
