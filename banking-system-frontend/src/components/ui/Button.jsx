import React from 'react';

const variants = {
  primary: 'bg-primary-gradient text-white shadow-btn hover:opacity-90',
  secondary: 'bg-white text-primary border border-primary/20 hover:bg-primary/5',
  ghost: 'bg-white/20 text-white border border-white/30 hover:bg-white/30',
  danger: 'bg-danger text-white hover:opacity-90',
  light: 'bg-light-bg text-gray-700 hover:bg-gray-200',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({ variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight, children, className = '', ...props }) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-xl
        transition-all duration-150 ease-out cursor-pointer
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={1.75} />}
      {children}
      {IconRight && <IconRight size={16} strokeWidth={1.75} />}
    </button>
  );
}
