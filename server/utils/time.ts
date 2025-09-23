import type { DateValue } from '@internationalized/date'

import type { H3Event } from 'h3'

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

export function date2unix(dateValue: DateValue | Date, type?: string) {
  const date = dateValue instanceof Date ? dateValue : dateValue.toDate(typeof Intl === 'undefined' ? 'Etc/UTC' : Intl.DateTimeFormat().resolvedOptions().timeZone)
  if (type === 'start')
    return Math.floor(date.setHours(0, 0, 0) / 1000)

  if (type === 'end')
    return Math.floor(date.setHours(23, 59, 59) / 1000)

  return Math.floor(date.getTime() / 1000)
}
