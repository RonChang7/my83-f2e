export enum ObjectFitTypeType {
  NONE = 'none',
  CONTAIN = 'contain',
  COVER = 'cover',
  FILL = 'fill',
  SCALE_DOWN = 'scale-down',
}

export const isSupportObjectFit = () => {
  if (typeof window === 'undefined') {
    return false
  }
  return document.documentElement.style.objectFit !== undefined
}

export const getImageStyle = (
  fitType: ObjectFitTypeType,
  imageHeight: number | null,
  imageWidth: number | null,
  containerHeight: number | null,
  containerWidth: number | null
) => {
  if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) {
    return {}
  }

  const imageAspectRatio = imageWidth / imageHeight
  const containerAspectRatio = containerWidth / containerHeight

  if (fitType === ObjectFitTypeType.SCALE_DOWN) {
    const isSmaller =
      imageWidth < containerWidth && imageHeight < containerHeight
    fitType = isSmaller ? ObjectFitTypeType.NONE : ObjectFitTypeType.CONTAIN
  }

  switch (fitType) {
    case ObjectFitTypeType.NONE:
      return { width: 'auto', height: 'auto' }
    case ObjectFitTypeType.CONTAIN:
      return imageAspectRatio < containerAspectRatio
        ? { width: 'auto' }
        : { height: 'auto' }
    case ObjectFitTypeType.COVER:
      return imageAspectRatio < containerAspectRatio
        ? { height: 'auto' }
        : { width: 'auto' }
    default:
      return {}
  }
}
