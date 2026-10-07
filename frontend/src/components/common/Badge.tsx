import React from 'react';

export type BadgeVariant = 'indigo' | 'green' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant | 'blue' | 'amber' | 'red';
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'indigo',
  children,
  className = '',
  size = 'md',
}) => {
  // Normalize to 4-color palette: White / Dark text / Indigo / Green
  let styles = 'bg-gray-100 text-gray-700 border-gray-200';
  if (variant === 'indigo' || variant === 'blue') {
    styles = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (variant === 'green') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (variant === 'amber' || variant === 'red') {
    styles = 'bg-indigo-50 text-indigo-800 border-indigo-200';
  }

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border tracking-tight ${styles} ${sizeStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
};
