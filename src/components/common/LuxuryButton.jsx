import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const LuxuryButton = ({
  children,
  to,
  href,
  onClick,
  variant = 'gold', // 'gold' | 'rolex' | 'outline-gold' | 'outline-white' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'right',
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs uppercase tracking-wider',
    md: 'px-6 py-3 text-sm uppercase tracking-wider',
    lg: 'px-8 py-4 text-base uppercase tracking-widest',
  }[size];

  const variantClasses = {
    gold: 'bg-gold hover:bg-gold-bright text-rolex-950 font-semibold shadow-gold-glow border border-gold-light/40 relative overflow-hidden group',
    rolex: 'bg-rolex hover:bg-rolex-600 text-white font-semibold shadow-rolex-glow border border-gold/30 relative overflow-hidden group',
    'outline-gold': 'bg-transparent hover:bg-gold/10 text-gold hover:text-gold-light border border-gold/60 hover:border-gold transition-all',
    'outline-white': 'bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white transition-all',
    ghost: 'bg-transparent hover:bg-white/5 text-slate-200 hover:text-white',
  }[variant];

  const content = (
    <>
      {/* Effet shimmer au survol pour les boutons pleins */}
      {(variant === 'gold' || variant === 'rolex') && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
      </span>
    </>
  );

  const baseClasses = `inline-flex items-center justify-center rounded-sm font-medium transition-all duration-300 select-none ${sizeClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      {...props}
    >
      {content}
    </motion.button>
  );
};
