"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import styles from "./footer.module.css";
import { IconButton } from "../icon-button/icon-button";
import { NavLink } from "../nav-link/nav-link";
import {
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  ArrowRightIcon,
} from "../icons";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  isLoading?: boolean;
}

export function Footer({ isLoading = false }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLHeadingElement>(null);
  const currentYear = 2026;

  useLayoutEffect(() => {
    if (isLoading) return;

    const footer = footerRef.current;
    if (!footer) return;

    // 1. Immediate Splitting
    if (bigTextRef.current && !bigTextRef.current.querySelector(".char")) {
      const text = bigTextRef.current.innerText;
      bigTextRef.current.innerHTML = Array.from(text)
        .map((char) =>
          char === " "
            ? `<span style="display:inline-block; width:0.3em">&nbsp;</span>`
            : `<span class="char" style="display:inline-block; opacity:0; transform:translateY(100%)">${char}</span>`,
        )
        .join("");
    }

    const ctx = gsap.context(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      const intervals: NodeJS.Timeout[] = [];

      const scrambleText = (el: HTMLElement) => {
        if (el.getAttribute("data-scrambling") === "true") return;
        const originalText = el.getAttribute("data-original") || el.innerText;
        if (!el.getAttribute("data-original")) {
          el.setAttribute("data-original", originalText);
        }
        el.setAttribute("data-scrambling", "true");
        const maxIterations = 8;
        let iterations = 0;
        const interval = setInterval(() => {
          el.innerText = Array.from(originalText)
            .map((char, i) => {
              if (char === " ") return " ";
              if (iterations >= maxIterations) return originalText[i] || "";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
          iterations++;
          if (iterations >= maxIterations) {
            clearInterval(interval);
            el.innerText = originalText;
            el.removeAttribute("data-scrambling");
          }
        }, 40);
        intervals.push(interval);
      };

      // 2. Footer Columns Reveal - EXACT CLONE OF WORKING GRID
      const columns = gsap.utils.toArray<HTMLElement>(`.${styles.column}`);
      gsap.fromTo(
        columns,
        {
          opacity: 0,
          y: 120,
          scale: 0.85,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: footer, // Use the footer ref itself as trigger
            start: "top bottom-=100",
            toggleActions: "play none none none",
            fastScrollEnd: true,
            onEnter: () => {
              // Crucial for pages with pinned sequences above
              ScrollTrigger.refresh();
              const allScrambles = footer.querySelectorAll<HTMLElement>(
                `.${styles.columnTitle}, .${styles.footerNav} a`,
              );
              allScrambles.forEach((el) => scrambleText(el));
            },
          },
        },
      );

      // 3. Big Text Reveal
      if (bigTextRef.current) {
        gsap.to(bigTextRef.current.querySelectorAll(".char"), {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.01,
          ease: "expo.out",
          scrollTrigger: {
            trigger: bigTextRef.current,
            start: "top bottom-=50",
            toggleActions: "play none none none",
          },
        });
      }

      return () => {
        intervals.forEach(clearInterval);
      };
    }, footer);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [isLoading]);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.footerGrid}>
        {/* Column 1: Info & Barcode */}
        <div className={styles.column}>
          <div className={styles.columnTitle}>IDENTIFICATION</div>
          <div className={styles.barcodeWrapper}>
            <div className={styles.barcode} />
          </div>
          <div className={styles.infoText}>
            © {currentYear} KONIG URBAN CORP.
            <br />
            STASIS DIVISION [MK.I]
            <br />
            142 TECHNO-DISTRICT
            <br />
            NEO NEON, 00-X
          </div>
        </div>

        {/* Column 2: Newsletter */}
        <div className={styles.column}>
          <div className={styles.columnTitle}>STAY UPDATED</div>
          <div className={styles.newsletter}>
            <p className={styles.infoText}>
              Join the transmission for exclusive series drops and tactical
              updates.
            </p>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="EMAIL_ADDRESS"
                className={styles.input}
              />
              <button className={styles.submitBtn}>
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Column 3: Navigation */}
        <div className={`${styles.column} ${styles.centerColumn}`}>
          <div className={styles.columnTitle}>DIRECTORY</div>
          <nav className={styles.footerNav}>
            <NavLink href="#collection">COLLECTION</NavLink>
            <NavLink href="#">PUFFERS</NavLink>
            <NavLink href="#">COOKIES</NavLink>
            <NavLink href="#">PRIVACY</NavLink>
            <NavLink href="#">TERMS</NavLink>
          </nav>
        </div>

        {/* Column 4: Logo & Social */}
        <div className={`${styles.column} ${styles.logoColumn}`}>
          <div className={styles.columnTitle}>TRANSMIT</div>
          <Image
            src="/svg/konigwhite.svg"
            alt="KONIG Logo"
            width={120}
            height={70}
            className={styles.footerLogo}
          />
          <div className={styles.socialIcons}>
            <IconButton variant="hexagon">
              <InstagramIcon />
            </IconButton>
            <IconButton variant="hexagon">
              <FacebookIcon />
            </IconButton>
            <IconButton variant="hexagon">
              <TwitterIcon />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Big Brand Headline */}
      <div className={styles.bigBrand}>
        <h2 ref={bigTextRef} className={styles.bigBrandText}>
          KONIG URBAN
        </h2>
      </div>
    </footer>
  );
}
