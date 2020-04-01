import { format, isToday, isYesterday } from 'date-fns'

export function postingTimeParser(timestamp: number | string) {
  const postingTime = new Date(Number(timestamp) * 1000)
  if (isToday(postingTime)) {
    return format(postingTime, '今天 HH:mm')
  } else if (isYesterday(postingTime)) {
    return format(postingTime, '昨天 HH:mm')
  }
  return format(postingTime, 'yyyy-MM-dd HH:mm')
}
