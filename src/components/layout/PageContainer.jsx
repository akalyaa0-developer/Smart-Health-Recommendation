import React from 'react';

export function PageContainer({
  children,
  title,
  subtitle,
  actions,
  badge,
  maxWidth = 'max-w-7xl',
  className = ''
}) {
  return (
    <main className={`flex-1 w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                {title}
              </h1>
              {badge && <span>{badge}</span>}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </main>
  );
}
