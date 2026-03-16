"use client";

import styles from "./nav-link.module.css";
import { useLenis } from "lenis/react";

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
}

export function NavLink({ children, href }: NavLinkProps) {
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#") && lenis) {
      e.preventDefault();
      lenis.scrollTo(href, { offset: -40 });
    }
  };

  return (
    <a href={href} className={styles.link} onClick={handleClick}>
      [ {children} ]
    </a>
  );
}
