import React from 'react';
import logoImg from '../../assets/logo.png';

export const BrandLogo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-10 sm:h-11',
    md: 'h-12 sm:h-14 md:h-16',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28',
  };

  return (
    <div className={`inline-flex items-center justify-center group select-none transition-transform duration-300 hover:scale-[1.03] ${className}`}>
      <img
        src={logoImg}
        alt="Inter Cars Import"
        className={`${sizeClasses[size] || sizeClasses.md} w-auto object-contain drop-shadow-[0_2px_10px_rgba(198,161,91,0.25)]`}
        loading="eager"
      />
    </div>
  );
};
