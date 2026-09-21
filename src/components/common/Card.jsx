import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  glass = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        ${glass ? 'glass-panel' : 'bg-white border border-slate-200'}
        rounded-2xl p-5 shadow-xs transition-all duration-200
        ${hover ? 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon: Icon, badge }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-800 text-base">{title}</h3>
            {badge && <span>{badge}</span>}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
