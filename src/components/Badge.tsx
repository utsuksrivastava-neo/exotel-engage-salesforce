import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'whatsapp' | 'sms' | 'call' | 'email';

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-100 text-surface-600',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  whatsapp: 'bg-green-50 text-green-700',
  sms: 'bg-violet-50 text-violet-700',
  call: 'bg-orange-50 text-orange-700',
  email: 'bg-sky-50 text-sky-700',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export default function Badge({ variant = 'default', children, dot, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${variantStyles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-emerald-500' : variant === 'danger' ? 'bg-red-500' : variant === 'warning' ? 'bg-amber-500' : 'bg-current'}`} />}
      {children}
    </span>
  );
}
