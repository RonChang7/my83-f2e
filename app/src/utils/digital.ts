export const padLeft = function(str: number | string, len: number) {
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
  const re = new RegExp(`(\\d)(?=(\\d{${digital}})+(?!\\d))`, 'g')
  return number.toString().replace(re, `$1${symbol}`)
}
