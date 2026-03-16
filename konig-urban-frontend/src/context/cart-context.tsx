"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: string; // unique ID for the cart row
  productId: string; // the base product ID
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  isOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const toggleCart = () => setIsOpen((prev) => !prev);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // Check if item with same productId, size, and color exists
      const existing = prev.find(
        (item) => item.productId === newItem.productId && item.size === newItem.size && item.color === newItem.color
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prev, { ...newItem, id: Math.random().toString(36).substring(7) }];
    });
    openCart();
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ isOpen, toggleCart, openCart, closeCart, items, addItem, removeItem, totalPrice }}>
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
