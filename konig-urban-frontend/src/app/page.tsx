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

const BagIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
const FacebookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);
const TwitterIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

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
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

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

      // Parallax Animations (existing, but integrated into context)
      // Background Video Parallax (slow down)
      gsap.to(videoRef.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Title Parallax (fast up)
      gsap.to(titleRef.current, {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Left Column content parallax (medium up)
      gsap.to(leftColRef.current, {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Right Column content parallax (fastest up)
      gsap.to(rightColRef.current, {
        y: -180,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroRef);

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
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

      <section id="collection" className={styles.collectionSection}>
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
    </main>
  );
}
