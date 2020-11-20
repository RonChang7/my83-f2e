export const padLeft = function (str: number | string, len: number) {
  str = '' + str
  return str.length >= len
    ? str
    : new Array(len - str.length + 1).join('0') + str
}

export const delimitIntegerWithSymbol = (
  number: number,
  digital: number = 3,
  symbol: string = ','
) => {
  // ref: https://blog.kalan.dev/2020-10-20-how-to-add-comma-into-number/
  const re = new RegExp(`\\B(?=(\\d{${digital}})+$)`, 'g')
  return number.toString().replace(re, `${symbol}`)
}
