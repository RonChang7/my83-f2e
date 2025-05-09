import { AxiosResponse, AxiosError } from 'axios'

export const isAxiosError = (error: any): error is AxiosError => {
  return (error as AxiosError).isAxiosError !== undefined
}

export const checkCorrectAxiosResponse = <T>(
  response: AxiosResponse<T> | undefined,
  // 命名參考 https://lodash.com/docs/4.17.15#pickBy 的第二個參數
  predicate?: (response: AxiosResponse<T>) => boolean
): boolean => {
  let value: boolean = false

  if (response && typeof predicate === 'function') {
    value = predicate(response)
  }

  return value
}
