import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  cartId: string;
  productId: number;
  name: string;
  slug: string;
  price: number;
  size: string;
  color: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  totalItems: number;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const FREE_SHIPPING_THRESHOLD = 150;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zabbro_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse cart storage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("zabbro_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist cart storage", e);
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, "cartId">) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += item.quantity;
        return next;
      }

      const cartId = `${item.productId}-${item.size}-${item.color}-${Date.now()}`;
      return [...prev, { ...item, cartId }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalItems,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
