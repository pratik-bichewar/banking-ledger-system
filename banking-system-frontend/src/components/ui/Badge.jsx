import React from 'react';

const variants = {
  success: 'bg-success/10 text-success',
  danger:  'bg-danger/10 text-danger',
  warning: 'bg-warning/10 text-warning',
  primary: 'bg-primary/10 text-primary',
  gray:    'bg-gray-100 text-gray-500',
  active:  'bg-success/10 text-success',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({ variant = 'primary', size = 'md', children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
