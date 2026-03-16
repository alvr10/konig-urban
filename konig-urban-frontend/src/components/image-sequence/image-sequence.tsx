"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./image-sequence.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ImageSequenceProps {
  frameCount: number;
  basePath: string; // e.g. "/images/image-sequence/ezgif-frame-"
  extension: string; // e.g. "png"
}

export const ImageSequence = ({
  frameCount,
  basePath,
  extension,
}: ImageSequenceProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  // Pad frame number: 1 -> 001
  const getFrameUrl = useCallback(
    (index: number) => {
      const paddedIndex = index.toString().padStart(3, "0");
      return `${basePath}${paddedIndex}.${extension}`;
    },
    [basePath, extension],
  );

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new window.Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setIsLoaded(true);
        }
      };
      loadedImages[i] = img;
    }
    setImages(loadedImages);
  }, [frameCount, getFrameUrl]);

  // Setup GSAP animation
  useEffect(() => {
    const container = containerRef.current;
    if (!isLoaded || !container || !canvasRef.current || !stickyRef.current)
      return;

    const obj = { frame: 1 };

    // Create the pinned sequence
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=350%", // Increased distance for sequence + shrink
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onEnter: () => {
          gsap.to("header", { yPercent: -100, autoAlpha: 0, duration: 0.4 });
        },
        onLeave: () => {
          gsap.to("header", { yPercent: 0, autoAlpha: 1, duration: 0.4 });
        },
        onEnterBack: () => {
          gsap.to("header", { yPercent: -100, autoAlpha: 0, duration: 0.4 });
        },
        onLeaveBack: () => {
          gsap.to("header", { yPercent: 0, autoAlpha: 1, duration: 0.4 });
        },
      },
    });

    // Data for technical points
    const techPoints = container.querySelectorAll(`.${styles.floatingText}`);

    // Phase 1: Image sequence
    tl.to(obj, {
      frame: frameCount,
      snap: "frame",
      ease: "none",
      duration: 1,
      onUpdate: () => {
        setCurrentFrame(Math.floor(obj.frame));
      },
    });

    // Animate main text overlay (Fade out first)
    tl.to(
      textRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 0.1,
        ease: "power2.in",
      },
      0,
    ); // Start immediately at 0

    // Animate technical points during Phase 1
    techPoints.forEach((point, i) => {
      const startTime = 0.15 + i * 0.2; // Start after main text is gone
      const endTime = startTime + 0.15;

      // Enter
      tl.fromTo(
        point,
        { opacity: 0, x: i % 2 === 0 ? 20 : -20 },
        { opacity: 1, x: 0, duration: 0.1 },
        startTime,
      );

      // Exit
      tl.to(
        point,
        { opacity: 0, x: i % 2 === 0 ? -20 : 20, duration: 0.1 },
        endTime,
      );
    });

    // Phase 2: Shrink and grayscale
    tl.to(
      stickyRef.current,
      {
        scale: 0.33,
        filter: "grayscale(1)",
        duration: 0.5,
        ease: "power2.inOut",
      },
      "+=0.1",
    );

    // Reveal logo during shrink
    tl.fromTo(
      logoRef.current,
      {
        opacity: 0,
        clipPath: "inset(0 100% 0 0)", // Wipe from left to right
      },
      {
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
        duration: 0.5,
        ease: "power2.out",
      },
      "<", // Start at the same time as the shrink
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) st.kill();
      });
    };
  }, [isLoaded, frameCount]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !images[currentFrame]) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const img = images[currentFrame];

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.scale(dpr, dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Fill and center the image (object-fit: cover equivalent)
      const ratio = Math.max(width / img.width, height / img.height);
      const centerShiftX = (width - img.width * ratio) / 2;
      const centerShiftY = (height - img.height * ratio) / 2;

      context.clearRect(0, 0, width, height);
      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio,
      );
    };

    render();

    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [currentFrame, images, isLoaded]);

  return (
    <section ref={containerRef} className={styles.container}>
      <div ref={stickyRef} className={styles.stickyWrapper}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.overlay} />

        <div ref={textRef} className={styles.textOverlay}>
          <div className={styles.tag}>[ ADVANCED_GEAR ]</div>
          <h2 className={styles.title}>
            ENGINEERED
            <br />
            TO ENDURE
          </h2>
          <p className={styles.desc}>
            Created for the most extreme environments on the planet. Merging
            high-performance materials with urban aesthetics.
          </p>
        </div>

        {/* Technical Data Points */}
        <div
          className={`${styles.floatingText} ${styles.right}`}
          style={{ top: "20%" }}
        >
          <span className={styles.floatingLabel}>CHASSIS // STASIS MK.I</span>
          <span className={styles.floatingValue}>CARBON REINFORCED</span>
        </div>

        <div
          className={`${styles.floatingText} ${styles.left}`}
          style={{ top: "65%" }}
        >
          <span className={styles.floatingLabel}>THERMAL THRESHOLD</span>
          <span className={styles.floatingValue}>OPERATIONAL -45°C</span>
        </div>

        <div
          className={`${styles.floatingText} ${styles.right}`}
          style={{ top: "70%" }}
        >
          <span className={styles.floatingLabel}>ARTICULATION</span>
          <span className={styles.floatingValue}>KINETIC FLEX SYSTEM</span>
        </div>

        <div
          className={`${styles.floatingText} ${styles.left}`}
          style={{ top: "15%" }}
        >
          <span className={styles.floatingLabel}>ION-SHIELD</span>
          <span className={styles.floatingValue}>HYDROPHOBIC: MAX</span>
        </div>

        {/* Mascot Logo Overlay */}
        <div ref={logoRef} className={styles.logoOverlay}>
          <Image
            src="/svg/konigwhite.svg"
            alt="KÖNIG Mascot"
            width={600}
            height={355}
            className={styles.logoIcon}
          />
        </div>
      </div>
    </section>
  );
};
