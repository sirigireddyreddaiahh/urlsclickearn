export type AvatarSize = 'sm' | 'md' | 'lg'
export type AvatarShape = 'circle' | 'square'
export type AvatarVariants = { size?: AvatarSize; shape?: AvatarShape }
export function avatarVariant(opts?: { size?: AvatarSize; shape?: AvatarShape } | null) {
  const size = opts?.size || 'sm'
  const shape = opts?.shape || 'circle'
  const sizes: Record<AvatarSize, string> = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }
  const shapes: Record<AvatarShape, string> = { circle: 'rounded-full', square: 'rounded' }
  return [sizes[size], shapes[shape]].join(' ')
}
