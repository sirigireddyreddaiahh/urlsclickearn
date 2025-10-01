export type BadgeVariant = 'default' | 'secondary'
export type BadgeVariants = { variant?: BadgeVariant }
export function badgeVariants(opts?: { variant?: BadgeVariant } | null) {
  const variant = opts?.variant || 'default'
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 text-slate-800',
    secondary: 'bg-transparent text-slate-600',
  }
  return [base, variants[variant]].filter(Boolean).join(' ')
}
