import { reactive, onMounted, computed } from '@nuxtjs/composition-api'
import { padLeft } from '@/utils/digital'

export const useCountdown = (endTimeTimestamp: number) => {
  const countdown = reactive({
    day: '0',
    hour: '0',
    min: '0',
    sec: '0',
  })

  const countdownTransformer = (sec: number) => {
    const day = Math.floor(sec / (3600 * 24))
    sec -= day * (3600 * 24)
    const hour = Math.floor(sec / 3600)
    sec -= hour * 3600
    const min = Math.floor(sec / 60)
    sec -= min * 60
    sec = Math.floor(sec % 60)

    countdown.day = day.toString()
    countdown.hour = padLeft(hour, 2)
    countdown.min = padLeft(min, 2)
    countdown.sec = padLeft(sec, 2)
  }

  onMounted(() => {
    let secBeforeEnd = endTimeTimestamp - Math.round(Date.now() / 1000)

    countdownTransformer(secBeforeEnd)
    const timer = window.setInterval(() => {
      secBeforeEnd -= 1
      countdownTransformer(secBeforeEnd)

      if (secBeforeEnd <= 0) {
        window.clearInterval(timer)
      }
    }, 1000)
  })

  return computed(() => countdown)
}
