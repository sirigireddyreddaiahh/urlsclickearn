import { fromAbsolute, toCalendarDate } from '@internationalized/date'

export function getTimeZone() {
  if (typeof Intl === 'undefined')
    return 'Etc/UTC'

  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function shortDate(unix = 0) {
  const shortDate = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'short',
  })
  return shortDate.format(unix * 1000)
}

export function longDate(unix = 0) {
  return new Date(unix * 1000).toString()
}

export function shortTime(unix = 0) {
  const shortTime = new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
  })
  return shortTime.format(unix * 1000)
}

export function unix2date(unix: number) {
  return toCalendarDate(fromAbsolute(unix * 1000, getTimeZone()))
}
