import https from 'https'
import axios from 'axios'
import Cookies from 'js-cookie'

const request = axios.create({
  baseURL: process.env.NUXT_ENV_API_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.client,
  }),
  withCredentials: true,
})

// Client side add Authorization header in order to valid JWT Token
if (process.client) {
  const tokenKey: string = process.env.NUXT_ENV_JWT_TOKEN_NAME!
  const jwtToken = Cookies.get(tokenKey)

  request.defaults.headers.common.Authorization = `Bearer ${jwtToken}`
}

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
