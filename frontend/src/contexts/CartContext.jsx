import { createContext, useEffect, useMemo, useState, useCallback } from 'react';

export const CartContext = createContext(null);

const STORAGE_KEY = 'eatery_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((menuItem, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.menuItem._id === menuItem._id);
      if (existing) {
        return prev.map((line) =>
          line.menuItem._id === menuItem._id ? { ...line, quantity: line.quantity + quantity } : line
        );
      }
      return [...prev, { menuItem, quantity }];
    });
  }, []);

  const setQuantity = useCallback((menuItemId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((line) => line.menuItem._id !== menuItemId);
      return prev.map((line) => (line.menuItem._id === menuItemId ? { ...line, quantity } : line));
    });
  }, []);

  const removeItem = useCallback((menuItemId) => {
    setItems((prev) => prev.filter((line) => line.menuItem._id !== menuItemId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);

  // Display-only estimate. The server is the source of truth for totals
  // and re-prices every line item from the live database at checkout.
  const estimatedTotal = useMemo(
    () => items.reduce((sum, line) => sum + line.menuItem.price * line.quantity, 0),
    [items]
  );

  const value = { items, addItem, setQuantity, removeItem, clearCart, itemCount, estimatedTotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
