import https from 'https'
import axios, { AxiosInstance } from 'axios'

const request: RequestInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.client,
  }),
  withCredentials: true,
})

// TODO: need to construct a class or change to nuxt-module
request.initApiUrlLogger = false

if (process.server) {
  request.interceptors.response.use(
    (res) => {
      return res
    },
    (err) => {
      if (err && err.response) {
        const { status } = err.response
        const { method, url } = err.config
        console.error(
          `Error ${status}: ${(method as string).toLocaleUpperCase()} ${url}`
        )
      } else {
        console.error('Unknown API Error:', err)
      }
      return Promise.reject(err)
    }
  )
}

interface RequestInstance extends AxiosInstance {
  initApiUrlLogger?: boolean
}

// P.S. Axios creates only one which is shared across SSR requests
export default request
