import React from 'react';

const colorMap = {
  primary:  'bg-primary/10 text-primary',
  secondary:'bg-secondary/10 text-secondary',
  success:  'bg-success/10 text-success',
  danger:   'bg-danger/10 text-danger',
  warning:  'bg-warning/10 text-warning',
  pink:     'bg-pink-100 text-pink-500',
  cyan:     'bg-cyan-100 text-cyan-500',
  indigo:   'bg-indigo-100 text-indigo-500',
  teal:     'bg-teal-100 text-teal-600',
};

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export default function IconBadge({ icon: Icon, color = 'primary', size = 'md', iconSize = 18, className = '' }) {
  return (
    <div className={`${colorMap[color]} ${sizes[size]} rounded-full flex items-center justify-center flex-shrink-0 ${className}`}>
      <Icon size={iconSize} strokeWidth={1.75} />
    </div>
  );
}
