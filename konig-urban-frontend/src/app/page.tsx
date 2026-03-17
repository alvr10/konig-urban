"use client";

import Image from "next/image";
import { useState, useLayoutEffect, useRef } from "react";
import styles from "./page.module.css";
import { NavLink } from "../components/nav-link/nav-link";
import { IconButton } from "../components/icon-button/icon-button";
import { ProductCard } from "../components/product-card/product-card";
import { useCart } from "../context/cart-context";
import { products, Product } from "../data/products";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Loader } from "../components/loader/loader";
import { ImageSequence } from "../components/image-sequence/image-sequence";
import { Footer } from "../components/footer/footer";
import {
  InstagramIcon,
  FacebookIcon,
  TwitterIcon,
  BagIcon,
} from "../components/icons";

gsap.registerPlugin(ScrollTrigger);

function ProductGridItem({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(
    product.colorMap?.[0]?.name || product.colors?.[0] || "DEFAULT",
  );

  return (
    <div className={styles.gridItem}>
      <div className={styles.gridImageWrapper}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={styles.gridImage}
        />
      </div>
      <div className={styles.productInfo}>
        <div className={styles.productName}>{product.name}</div>
        {product.desc && (
          <div className={styles.productDesc}>{product.desc}</div>
        )}

        <div className={styles.selectors}>
          {product.colorMap && product.colorMap.length > 0 && (
            <div className={styles.colorSelector}>
              {product.colorMap.map((color, idx) => (
                <span
                  key={idx}
                  className={`${styles.colorDotWrapper} ${selectedColor === color.name ? styles.activeColor : ""}`}
                  onClick={() => setSelectedColor(color.name)}
                >
                  <span
                    className={styles.colorDot}
                    style={{ backgroundColor: color.hex }}
                  ></span>
                  <span className={styles.colorName}>{color.name}</span>
                </span>
              ))}
            </div>
          )}

          <div className={styles.sizeSelector}>
            {product.sizes.map((size) => (
              <span
                key={size}
                className={`${styles.sizeOption} ${selectedSize === size ? styles.activeSize : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.productPrice}>
          $
          {product.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <button
          className={styles.gridItemCartBtn}
          onClick={() => {
            addItem({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              size: selectedSize,
              color: selectedColor,
              quantity: 1,
            });
          }}
        >
          <div className={styles.gridItemCartBtnInner}>ADD TO CART</div>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { toggleCart, addItem } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const product = products[0]; // Defaulting to Artic 01

  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[1]); // Default to SILVER based on image

  // Parallax Refs
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const collectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (isLoading) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const ctx = gsap.context(() => {
      // 1. Initial State: Hide elements (redundant if handled by CSS, but safe for GSAP)
      gsap.set([headerRef.current, leftColRef.current, rightColRef.current], {
        opacity: 0,
      });

      // 2. Entrance Animation (Timeline)
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => ScrollTrigger.refresh(),
      });

      tl.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        0.1,
      )
        .fromTo(
          leftColRef.current?.children ?? [],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
          "-=0.8",
        )
        .fromTo(
          rightColRef.current?.children ?? [],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
          "-=0.8",
        )
        .to(leftColRef.current, { opacity: 1, duration: 0.1 }, 0) // Ensure parents are visible
        .to(rightColRef.current, { opacity: 1, duration: 0.1 }, 0)
        .fromTo(
          videoRef.current,
          { opacity: 0, scale: 1.2 },
          { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
          0,
        );

      // Parallax Animations
      const parallaxDefaults = {
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      };

      // Background Video Parallax
      gsap.to(videoRef.current, {
        yPercent: 10,
        ...parallaxDefaults,
      });

      // Title Parallax
      gsap.to(titleRef.current, {
        y: -150,
        ...parallaxDefaults,
      });

      // Left Column content parallax
      gsap.to(leftColRef.current, {
        y: -80,
        ...parallaxDefaults,
      });

      // Right Column content parallax
      gsap.to(rightColRef.current, {
        y: -180,
        ...parallaxDefaults,
      });

      // 3. Collection Grid Reveal
      const cards = gsap.utils.toArray<HTMLElement>(`.${styles.gridItem}`);
      gsap.fromTo(
        cards,
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
            trigger: collectionRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
            fastScrollEnd: true,
          },
        },
      );
    });

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
      console.log("ScrollTrigger Refreshed");
    }, 2000);

    return () => {
      clearTimeout(timer);
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  // Global ScrollTrigger Refresh when components are ready
  useLayoutEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });
  };

  return (
    <main className={styles.main}>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      <section
        ref={heroRef}
        className={styles.heroSection}
        style={{ visibility: isLoading ? "hidden" : "visible" }}
      >
        {/* Background Video */}
        <div ref={videoRef} className={styles.videoWrapper}>
          <video className={styles.heroVideo} autoPlay loop muted playsInline>
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className={styles.overlay} />
        </div>

        {/* Content Overlay */}
        <div className={styles.content}>
          <header
            ref={headerRef}
            className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}
          >
            <div className={styles.brand}>KONIG URBAN</div>
            <nav className={styles.nav}>
              <NavLink href="#collection">COLLECTION</NavLink>
              <NavLink href="#">PUFFERS</NavLink>
              <NavLink href="#">BOOTS</NavLink>
            </nav>
            <div className={styles.actions}>
              <IconButton variant="hexagon" className="px-8">
                SIGN IN
              </IconButton>
              <IconButton variant="hexagon" onClick={toggleCart}>
                <BagIcon />
              </IconButton>
            </div>
          </header>

          <div className={styles.heroBody}>
            <div ref={leftColRef} className={styles.leftCol}>
              <div className={styles.seriesTag}>
                [ SERIES: STASIS MK.I ] [ SERIES ]
              </div>
              <h1 ref={titleRef} className={styles.title}>
                COLLECTION
                <br />
                ARTIC 01&trade;
              </h1>

              <div className={styles.optionsGroup}>
                <div className={styles.optionRow}>
                  <div className={styles.optionLabel}>SIZE</div>
                  <div className={styles.optionValues}>
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className={`${styles.optionValue} ${selectedSize === size ? styles.active : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.optionRow}>
                  <div className={styles.optionLabel}>COLOUR</div>
                  <div className={styles.optionValues}>
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className={`${styles.optionValue} ${selectedColor === color ? styles.active : ""}`}
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.addToCartRow}>
                <button className={styles.cartButton} onClick={handleAddToCart}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="19" x2="19" y2="5"></line>
                    <polyline points="9 5 19 5 19 15"></polyline>
                  </svg>
                </button>
                <div className={styles.cartInfo}>
                  <span className={styles.cartLabel}>ADD TO CART</span>
                  <span className={styles.cartPrice}>$899.99</span>
                </div>
              </div>
            </div>

            <div className={styles.centerCol}></div>

            <div ref={rightColRef} className={styles.rightCol}>
              <div className={styles.cardsCarousel}>
                <ProductCard imageSrc="/images/winter-drop/white-puffer-front.png" />
                <ProductCard imageSrc="/images/winter-drop/white-puffer-back.png" />
              </div>

              <div className={styles.pagination}>
                <span>01</span>
                <span className={styles.paginationLine}></span>
                <span>07</span>
              </div>

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
        </div>
      </section>

      <section
        id="collection"
        ref={collectionRef}
        className={styles.collectionSection}
      >
        <div className={styles.collectionHeader}>
          <h2 className={styles.collectionTitle}>NEW COLLECTION</h2>
          <div className={styles.collectionNavGroup}>
            <div className={styles.collectionTags}>
              <div>[ NEW COLLECTION ]</div>
              <div>[ SERIES_01 ]</div>
              <div>[ PUFFERS ]</div>
            </div>
            <div className={styles.collectionCategories}>
              <div>PUFFER JACKETS</div>
              <div>METAL EDITION</div>
              <div>GLOSS SERIES</div>
              <div>EXTREME COLD LINE</div>
            </div>
          </div>
        </div>

        <div className={styles.collectionGrid}>
          {/* First row, first item is wide */}
          <div className={`${styles.gridItem} ${styles.gridItemWide}`}>
            <div className={styles.gridImageWrapper}>
              <Image
                src="/images/winter-drop/starred.png"
                alt="Aurora"
                fill
                className={styles.wideCardInnerImage}
              />
              <div className={styles.wideCardOverlay}>
                <h3>AURORA&trade;</h3>
                <div className={styles.wideCardAction}>
                  <button
                    className={styles.cartButton}
                    onClick={() => {
                      addItem({
                        productId: "aurora-featured",
                        name: "AURORA™",
                        price: 1999,
                        image: "/images/winter-drop/starred.png",
                        size: "M",
                        color: "DEFAULT",
                        quantity: 1,
                      });
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </button>
                  <div className={styles.wideCardPrice}>
                    <span>ADD TO CART</span>
                    <span>$1,999</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of items */}
          {products.slice(1, 9).map((product, i) => (
            <ProductGridItem key={product.id || i} product={product} />
          ))}
        </div>
      </section>

      <ImageSequence
        frameCount={160}
        basePath="/images/image-sequence/ezgif-frame-"
        extension="png"
      />

      <Footer isLoading={isLoading} />
    </main>
  );
}
