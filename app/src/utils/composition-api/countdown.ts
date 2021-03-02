import { reactive, onMounted, watch } from '@nuxtjs/composition-api'
import { padLeft } from '@/utils/digital'

export const useCountdownTimer = (endTimeTimestamp?: number) => {
  let timer: number | null = null
  const countdownTimer: CountdownTimer = reactive({
    endTimeTimestamp: endTimeTimestamp || 0,
    day: '0',
    hour: '00',
    min: '00',
    sec: '00',
  })

  const displayTimerTransformer = (sec: number) => {
    const day = Math.floor(sec / (3600 * 24))
    sec -= day * (3600 * 24)
    const hour = Math.floor(sec / 3600)
    sec -= hour * 3600
    const min = Math.floor(sec / 60)
    sec -= min * 60
    sec = Math.floor(sec % 60)

    countdownTimer.day = day.toString()
    countdownTimer.hour = padLeft(hour, 2)
    countdownTimer.min = padLeft(min, 2)
    countdownTimer.sec = padLeft(sec, 2)
  }

  const setupTimer = () => {
    let secBeforeEnd =
      countdownTimer.endTimeTimestamp - Math.round(Date.now() / 1000)

    if (secBeforeEnd <= 0) {
      stopTimer()
      resetEndTime()
      return
    }

    displayTimerTransformer(secBeforeEnd)
    timer = window.setInterval(() => {
      secBeforeEnd -= 1
      displayTimerTransformer(secBeforeEnd)

      if (secBeforeEnd <= 0) {
        stopTimer()
        resetEndTime()
      }
    }, 1000)
  }

  const stopTimer = () => {
    timer !== null && window.clearInterval(timer)
  }

  const resetEndTime = () => {
    countdownTimer.endTimeTimestamp = 0
  }

  onMounted(() => {
    if (!countdownTimer.endTimeTimestamp) return
    setupTimer()
  })

  watch(
    () => countdownTimer.endTimeTimestamp,
    (val) => {
      stopTimer()

      if (!val) return
      setupTimer()
    }
  )

  return countdownTimer
}

interface CountdownTimer {
  endTimeTimestamp: number
  day: string
  hour: string
  min: string
  sec: string
}
