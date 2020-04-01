import { logger } from './logger'

export const trackingWrapper = (
  trackingFn: Function,
  trackingLogEnable: boolean,
  logPrefix: string,
  args: any[]
) => {
  trackingFn(...args)
  if (trackingLogEnable) {
    logger(logPrefix, args.join(' '))
  }
}
