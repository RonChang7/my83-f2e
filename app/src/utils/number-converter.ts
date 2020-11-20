export const ZHTWUnitMap = {
  1: '',
  10: '十',
  100: '百',
  1000: '千',
  10000: '萬',
}

export const numberConverterWithUnit = (number: number, cutPoint: number) => {
  if (typeof ZHTWUnitMap[cutPoint] === 'undefined') return `${number}`

  return number >= cutPoint
    ? `${number / cutPoint}${ZHTWUnitMap[cutPoint]}`
    : `${number}`
}
