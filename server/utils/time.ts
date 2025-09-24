import type { H3Event } from 'h3'

// Import shared time utilities from app/utils and re-expose them as local bindings.
// Using local bindings avoids possible bundler/rollup re-export resolution issues.
import { date2unix as _date2unix, getTimeZone as _getTimeZone, longDate as _longDate, shortDate as _shortDate, shortTime as _shortTime, unix2date as _unix2date } from '../../app/utils/time'

export const date2unix = _date2unix
export const getTimeZone = _getTimeZone
export const longDate = _longDate
export const shortDate = _shortDate
export const shortTime = _shortTime
export const unix2date = _unix2date

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
