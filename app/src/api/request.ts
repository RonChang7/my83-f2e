import https from 'https'
import axios from 'axios'

const request = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.client,
  }),
  withCredentials: true,
})

if (process.env.NUXT_ENV_APP_ENV === 'development') {
  request.interceptors.request.use((v) => {
    const tagStyle =
      'background: #7bd6ff; border-radius: 1em; color: #fff; padding: 2px 6px; font-weight: bold;'
    const contentStyle = 'padding: 2px 6px;'
    // eslint-disable-next-line no-console
    console.log(`%cAPI Request:%c${v.url}`, tagStyle, contentStyle)

    return v
  })
}

export default request
