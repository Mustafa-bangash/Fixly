import { Link } from 'react-router-dom';

const variants = {
  primary: 'border-brand bg-brand text-white hover:bg-[#1648a0]',
  secondary: 'border-line bg-transparent text-navy hover:bg-navy-light',
  danger: 'border-danger bg-transparent text-danger hover:bg-red-50',
};

// Flexible button component:
// - If 'to' is provided, renders React Router <Link>
// - If 'href' is provided, renders normal <a>
// - Otherwise, renders native <button>
export default function Button({
  to,
  href,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  onClick,
  children,
}) {
  const baseClasses = `mt-[14px] inline-flex items-center justify-center min-h-[56px] rounded-[10px] border-2 py-[14px] px-6 text-center text-[18px] font-semibold leading-[normal] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={baseClasses}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
