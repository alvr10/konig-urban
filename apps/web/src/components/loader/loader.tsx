"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./loader.module.css";

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const digitSlotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Ref for the numeric values to animate them independently of React state for performance if needed,
  // but for the sliding effect, we might want to map digits.
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation
          gsap.to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: onComplete,
          });
        }
      });

      // Simple counter animation for the state
      const countObj = { value: 0 };
      tl.to(countObj, {
        value: 100,
        duration: 3.5,
        ease: "power4.inOut",
        onUpdate: () => {
          const p = countObj.value;
          setProgress(Math.floor(p));
          
          // Slot 0: Hundreds [0, 1]
          if (digitSlotsRef.current[0]) {
            const hIndex = p / 100;
            gsap.set(digitSlotsRef.current[0], { yPercent: -hIndex * 50 });
          }
          
          // Slot 1: Tens [0...9, 0]
          if (digitSlotsRef.current[1]) {
            const tIndex = p / 10;
            gsap.set(digitSlotsRef.current[1], { yPercent: -tIndex * (100 / 11) });
          }
          
          // Slot 2: Units [0...9 * 10, 0]
          if (digitSlotsRef.current[2]) {
            const uIndex = p;
            gsap.set(digitSlotsRef.current[2], { yPercent: -uIndex * (100 / 101) });
          }
        }
      });
      
      // Reveal the counter initially
      tl.fromTo(counterRef.current, 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" },
        0.2
      );
    });

    return () => ctx.revert();
  }, [onComplete]);

  // Helper to render sliding digits
  const renderDigits = () => {
    const hundreds = [0, 1];
    const tens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const units = [...Array.from({ length: 10 }, () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).flat(), 0];
    
    const digitData = [hundreds, tens, units];

    return digitData.map((data, i) => (
      <div key={i} className={styles.digitWindow}>
        <div 
          ref={(el) => { digitSlotsRef.current[i] = el; }}
          className={styles.digitSlot}
        >
          {data.map((n, idx) => (
            <div key={idx} className={styles.digit}>
              {n}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div ref={containerRef} className={styles.loaderContainer}>
      <div className={styles.topSection}>
        <div className={styles.brand}>KONIG URBAN</div>
        <div className={styles.status}>[ SYSTEM INITIALIZING ]</div>
      </div>
      
      <div ref={counterRef} className={styles.counterWrapper}>
        <div className={styles.digits}>
          {renderDigits()}
          <span className={styles.percent}>%</span>
        </div>
        <div className={styles.loadingBarWrapper}>
          <div 
            className={styles.loadingBar} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
