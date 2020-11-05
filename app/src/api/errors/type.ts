export interface ResponseBody<D> {
  error_code: ErrorCode
  error_message: string
  data: D
}

export const enum ErrorCode {
  Redirect = 'GEN_000001',
  ProductOffline = 'PRD_000001',
}
