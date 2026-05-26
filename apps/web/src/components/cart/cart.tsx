"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useCart } from "../../context/cart-context";
import styles from "./cart.module.css";
import { IconButton } from "../icon-button/icon-button";

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
)

export function Cart() {
  const { isOpen, closeCart, items, removeItem, totalPrice } = useCart();
  const overlayRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Animate in
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: "block" });
      gsap.fromTo(
        cartRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.5, ease: "power3.out" }
      );
    } else {
      // Animate out
      gsap.to(cartRef.current, { x: "100%", duration: 0.4, ease: "power3.inOut" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, display: "none", delay: 0.1 });
    }
  }, [isOpen]);

  return (
    <>
      <div className={styles.overlay} ref={overlayRef} onClick={closeCart} style={{ display: "none", opacity: 0 }}></div>
      <div className={styles.cart} ref={cartRef} style={{ transform: "translateX(100%)" }}>
        <div className={styles.header}>
            <h2 className={styles.title}>YOUR CART</h2>
            <IconButton onClick={closeCart} variant="hexagon">
              <CloseIcon />
            </IconButton>
        </div>
        
        <div className={styles.itemsList}>
            {items.length === 0 ? (
                <div className={styles.emptyState}>Your cart is empty.</div>
            ) : (
                items.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                        <div className={styles.itemImageWrapper}>
                             <div className={styles.placeholderBg}></div>
                             <Image src={item.image} alt={item.name} fill className={styles.itemImage} sizes="100px" />
                        </div>
                        <div className={styles.itemInfo}>
                            <div className={styles.itemName}>{item.name}</div>
                            <div className={styles.itemMeta}>Size: {item.size} — Color: {item.color}</div>
                            <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
                            <div className={styles.itemQuantity}>Qty: {item.quantity}</div>
                        </div>
                        <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                            <TrashIcon />
                        </button>
                    </div>
                ))
            )}
        </div>

        {items.length > 0 && (
            <div className={styles.footer}>
                <div className={styles.totalRow}>
                    <span>TOTAL</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button className={styles.checkoutBtn}>CHECKOUT</button>
            </div>
        )}
      </div>
    </>
  );
}
