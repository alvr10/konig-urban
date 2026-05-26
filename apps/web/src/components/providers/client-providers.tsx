"use client";

import { CartProvider } from "../../context/cart-context";
import { Cart } from "../cart/cart";
import { ReactLenis } from "lenis/react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      <CartProvider>
        {children}
        <Cart />
      </CartProvider>
    </ReactLenis>
  );
}
