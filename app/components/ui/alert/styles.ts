export type AlertVariant = 'default' | 'destructive'
export type AlertVariants = { variant?: AlertVariant }
export function alertVariants(opts?: { variant?: AlertVariant } | null) {
  const variant = opts?.variant || 'default'
  const base = 'rounded-md p-2 text-sm'
  const variants: Record<AlertVariant, string> = {
    default: 'bg-blue-50 text-blue-800',
    destructive: 'bg-red-50 text-red-800',
  }
  return [base, variants[variant]].filter(Boolean).join(' ')
}
