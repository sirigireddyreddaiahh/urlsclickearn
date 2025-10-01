// Minimal buttonVariants helper for class generation used across the UI components.
// This is a small, safe implementation to replace a missing barrel export.
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
export type ButtonSize = 'icon' | 'sm' | 'md' | 'lg' | 'xs'

export function buttonVariants(opts?: { variant?: ButtonVariant; size?: ButtonSize } | null) {
  const variant = opts?.variant || 'primary'
  const size = opts?.size || 'md'

  const base = 'inline-flex items-center justify-center rounded-md font-medium transition'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700',
    secondary: 'bg-white border text-slate-900 hover:bg-slate-50',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-900',
    outline: 'bg-transparent border border-slate-200 text-slate-900',
  }

  const sizes: Record<ButtonSize, string> = {
    icon: 'p-1',
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return [base, variants[variant], sizes[size]].filter(Boolean).join(' ')
}

export type ButtonVariants = {
  variant?: ButtonVariant
  size?: ButtonSize
}
