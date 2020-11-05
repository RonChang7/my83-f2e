import { AxiosResponse } from 'axios'
import { Link, LinkButton } from '../type'
import { checkCorrectAxiosResponse } from '../helper'
import { ResponseBody, ErrorCode } from './type'

interface RedirectErrorResponseData {
  link: Link
}

interface ProductOfflineErrorResponseData {
  btn: LinkButton
}

export type RedirectErrorResponseBody = ResponseBody<RedirectErrorResponseData>
export type ProductOfflineErrorResponseBody = ResponseBody<
  ProductOfflineErrorResponseData
>

export const checkRedirectResponse = (res: AxiosResponse<any>) =>
  checkCorrectAxiosResponse<RedirectErrorResponseBody>(
    res,
    ({ data }) =>
      data.error_code === ErrorCode.Redirect && data.data && !!data.data.link
  )

export const checkProductOfflineResponse = (res: AxiosResponse<any>) =>
  checkCorrectAxiosResponse<ProductOfflineErrorResponseBody>(
    res,
    ({ data }) =>
      data.error_code === ErrorCode.ProductOffline &&
      data.data &&
      !!data.data.btn
  )
