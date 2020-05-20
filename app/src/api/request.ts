import https from 'https'
import axios, { AxiosInstance } from 'axios'
export class Request {
  private static instance: Request

  public initApiUrlLogger: boolean

  public initServerSideSentryInterceptor: boolean

  public axiosInstance: AxiosInstance

  private constructor() {
    this.initApiUrlLogger = false
    this.initServerSideSentryInterceptor = false

    this.axiosInstance = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: process.client,
      }),
      withCredentials: true,
    })
  }

  public static getInstance() {
    if (!Request.instance) {
      Request.instance = new Request()
    }
    return Request.instance
  }
}

const request = Request.getInstance().axiosInstance

// P.S. Axios creates only one which is shared across SSR requests
export default request
