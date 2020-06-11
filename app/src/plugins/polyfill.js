/* eslint-disable */
require('intersection-observer')

if (typeof Promise.allSettled !== 'function') {
  Promise.allSettled = function PromiseAllSettled(promises) {
    const wrappedPromises = promises.map((p) =>
      Promise.resolve(p).then(
        (val) => ({ status: 'fulfilled', value: val }),
        (err) => ({ status: 'rejected', reason: err })
      )
    )
    return Promise.all(wrappedPromises)
  }
}
