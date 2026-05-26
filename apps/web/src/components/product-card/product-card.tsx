import Image from "next/image";
import styles from "./product-card.module.css";

interface ProductCardProps {
  imageSrc: string;
}

export function ProductCard({ imageSrc }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt="Product image"
          fill
          className={styles.image}
        />
      </div>
    </div>
  );
}
