import https from 'https'
import axios from 'axios'

const request = axios.create({
  baseURL: process.env.NUXT_ENV_API_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: process.client,
  }),
})

export default request
