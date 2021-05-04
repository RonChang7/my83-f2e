import { Plugin as NuxtPlugin } from '@nuxt/types'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

export default ((_, inject) => {
  const notyf = new Notyf({
    position: {
      x: 'center',
      y: 'top',
    },
    duration: 5000,
    types: [
      {
        type: 'success',
        background: '#1dbd9d',
      },
    ],
  })

  inject('notification', notyf)
}) as NuxtPlugin
