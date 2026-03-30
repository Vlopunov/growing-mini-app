import React from 'react';
import styles from './Avatar.module.css';

interface AvatarProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', border = false }) => {
  return (
    <div className={`${styles.avatar} ${styles[size]} ${border ? styles.border : ''}`}>
      <img src={src} alt={name} className={styles.img} />
    </div>
  );
};
