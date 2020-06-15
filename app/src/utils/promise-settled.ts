/**
 * 由於目前透過 map 進行原本 Promise wrapper 無法正確的推斷型別
 * 導致後續使用無法快速的使用 TypeScript 型別提示的優勢
 *
 * 故之後使用方式如下：
 * Promise.all([promiseWrapper(promise1), promiseWrapper(promise2)])
 *
 * @param p A Promise.
 */
export const promiseSettledWrapper = <T>(
  p: Promise<T>
): Promise<PromiseFulfilledResult<T> | PromiseRejectedResult> =>
  p.then(
    (val): PromiseFulfilledResult<T> => ({
      status: 'fulfilled',
      value: val,
    }),
    (err): PromiseRejectedResult => ({ status: 'rejected', reason: err })
  )

interface PromiseFulfilledResult<T> {
  status: 'fulfilled'
  value: T
}

interface PromiseRejectedResult {
  status: 'rejected'
  reason: any
}
