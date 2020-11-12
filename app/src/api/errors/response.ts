import { AxiosResponse } from 'axios'
import { Link } from '../type'
import { checkCorrectAxiosResponse } from '../helper'
import { ResponseBody, ErrorCode } from './type'

interface RedirectErrorResponseData {
  link: Link
}

export type RedirectErrorResponseBody = ResponseBody<RedirectErrorResponseData>

export const checkRedirectResponse = (res: AxiosResponse<any>) =>
  checkCorrectAxiosResponse<RedirectErrorResponseBody>(
    res,
    ({ data }) =>
      data.error_code === ErrorCode.Redirect && data.data && !!data.data.link
  )
