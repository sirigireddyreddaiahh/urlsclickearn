import type { H3Event } from 'h3'

// Re-export shared time utilities from app/utils so server code can import them
export { date2unix, getTimeZone, longDate, shortDate, shortTime, unix2date } from '../../app/utils/time'

export function getExpiration(event: H3Event, expiration: number | undefined) {
  const { previewMode } = useRuntimeConfig(event).public
  if (previewMode) {
    const { previewTTL } = useAppConfig(event)
    const previewExpiration = Math.floor(Date.now() / 1000) + previewTTL
    if (!expiration || expiration > previewExpiration)
      expiration = Math.floor(Date.now() / 1000) + previewTTL
  }

  return expiration
}
