import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('bitezy_cart');
    const storedRest = localStorage.getItem('bitezy_cart_restaurant');
    if (stored) {
      try { setCartItems(JSON.parse(stored)); } catch { /* ignore */ }
    }
    if (storedRest) {
      try { setRestaurant(JSON.parse(storedRest)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bitezy_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (restaurant) {
      localStorage.setItem('bitezy_cart_restaurant', JSON.stringify(restaurant));
    }
  }, [restaurant]);

  const addToCart = (item, rest) => {
    // If adding from a different restaurant, clear cart
    if (restaurant && rest._id !== restaurant._id) {
      if (!window.confirm('Adding items from a different restaurant will clear your current cart. Continue?')) {
        return;
      }
      setCartItems([]);
    }

    setRestaurant(rest);

    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        toast.success(`Updated ${item.name} quantity`);
        return prev.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`${item.name} added to cart!`);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const updated = prev.filter(i => i._id !== itemId);
      if (updated.length === 0) {
        setRestaurant(null);
        localStorage.removeItem('bitezy_cart_restaurant');
      }
      return updated;
    });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(i => i._id === itemId ? { ...i, quantity } : i)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurant(null);
    localStorage.removeItem('bitezy_cart');
    localStorage.removeItem('bitezy_cart_restaurant');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, restaurant, addToCart, removeFromCart,
      updateQuantity, clearCart, subtotal, deliveryFee, tax, total, itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
