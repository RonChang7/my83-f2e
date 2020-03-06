export const padLeft = function(str: number | string, len: number) {
  str = '' + str
  return str.length >= len
    ? str
    : new Array(len - str.length + 1).join('0') + str
}
