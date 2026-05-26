import styles from './icon-button.module.css';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'square' | 'circle' | 'hexagon';
  className?: string; // Add className for external styling
}

export function IconButton({ children, onClick, variant = 'square', className = '' }: IconButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
