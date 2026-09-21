import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400
            transition-all duration-150 focus:outline-none focus:ring-2
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
              : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-slate-300'
            }
            ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}

export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800
          transition-all duration-150 focus:outline-none focus:ring-2 cursor-pointer
          ${error 
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20' 
            : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 hover:border-slate-300'
          }
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
}
