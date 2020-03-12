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

interface RequestInstance extends AxiosInstance {
  initApiUrlLogger?: boolean
}

export default request
