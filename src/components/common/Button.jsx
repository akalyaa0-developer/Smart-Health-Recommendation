import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5 font-semibold'
  };

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-emerald-600/20 focus:ring-emerald-500 active:bg-emerald-700',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs hover:border-slate-300 focus:ring-slate-300 active:bg-slate-100',
    outline: 'border border-emerald-600 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500',
    accent: 'bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-sm focus:ring-amber-400 active:bg-amber-600',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm focus:ring-rose-500 active:bg-rose-700',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 focus:ring-slate-300'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      <span>{children}</span>
      {IconRight && !loading && (
        <IconRight className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      )}
    </button>
  );
}
