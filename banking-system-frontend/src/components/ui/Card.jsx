import React from 'react';

export default function Card({ children, className = '', hover = false, gradient = false, ...props }) {
  return (
    <div
      className={`
        rounded-2xl bg-white
        ${hover ? 'shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 ease-out cursor-pointer' : 'shadow-card'}
        ${gradient ? 'bg-primary-gradient text-white' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 text-base">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}
