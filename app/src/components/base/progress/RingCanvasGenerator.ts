const enum RingType {
  OVER = 'OVER',
  LOWER = 'LOWER',
  FILL = 'Fill',
}

export class RingCanvasGenerator {
  private static defaultRingConfig: Record<
    RingType,
    (deg: number) => RingConfig[]
  > = {
    [RingType.OVER]: () => [
      // leftTop
      {
        startAngle: RingCanvasGenerator.degree(0),
        endAngle: RingCanvasGenerator.degree(90),
        gradientPoint: (radius) => [radius, 0, 0, radius],
        color: ['#6980D1', '#4C6AD5'],
      },
      // leftBottom
      {
        startAngle: RingCanvasGenerator.degree(90),
        endAngle: RingCanvasGenerator.degree(180),
        gradientPoint: (radius) => [0, radius, radius, radius * 2],
        color: ['#4C6AD5', '#8C75AF'],
      },
      // rightBottom
      {
        startAngle: RingCanvasGenerator.degree(180),
        endAngle: RingCanvasGenerator.degree(270),
        gradientPoint: (radius) => [radius, radius * 2, radius * 2, radius],
        color: ['#8C75AF', '#D07F86'],
      },
      // rightTop
      {
        startAngle: RingCanvasGenerator.degree(270),
        endAngle: RingCanvasGenerator.degree(360),
        gradientPoint: (radius) => [radius * 2, radius, radius, 0],
        color: ['#D07F86', '#FF8659'],
      },
    ],
    [RingType.LOWER]: (deg) => [
      {
        startAngle: RingCanvasGenerator.degree(0),
        endAngle: RingCanvasGenerator.degree(deg),
        gradientPoint: (radius) => [
          radius,
          0,
          RingCanvasGenerator.convertAngleToCoordinate({
            x: radius,
            y: radius,
            radius,
            deg,
          }).x,
          RingCanvasGenerator.convertAngleToCoordinate({
            x: radius,
            y: radius,
            radius,
            deg,
          }).y,
        ],
        color: ['#899fe6', '#506ed0'],
      },
    ],
    [RingType.FILL]: () => [
      {
        startAngle: 0,
        endAngle: 2 * Math.PI,
        gradientPoint: (radius) => [radius, 0, radius, radius * 2],
        color: ['#899fe6', '#506ed0'],
      },
    ],
  }

  private ctx: CanvasRenderingContext2D

  private ringConfig?: Partial<RingConfig>[]

  private bottomRingConfig?: Partial<BottomRingConfig>

  constructor({ ctx, ringConfig, bottomRingConfig }: initOption) {
    this.ctx = ctx
    this.ringConfig = ringConfig
    this.bottomRingConfig = bottomRingConfig
  }

  private static convertAngleToCoordinate(
    parma: ConvertAngleToCoordinateParam
  ) {
    const deg = parma.deg + 90
    return {
      x: parma.x + Math.cos((deg / 180) * Math.PI) * parma.radius,
      y: parma.y - Math.sin((deg / 180) * Math.PI) * parma.radius,
    }
  }

  private static degree(deg: number) {
    const degShift = -90
    return ((-deg + degShift) / 180) * Math.PI
  }

  public draw({ length, lineWidth, deg }: RingInstance) {
    const radius = length / 2 - lineWidth / 2
    this.ctx.lineWidth = lineWidth
    this.ctx.lineCap = 'round'

    const ringType =
      deg > 360 ? RingType.OVER : deg < 360 ? RingType.LOWER : RingType.FILL

    if (ringType === RingType.LOWER || this.bottomRingConfig) {
      this.ctx.beginPath()
      this.ctx.arc(
        length / 2,
        length / 2,
        radius,
        RingCanvasGenerator.degree(0),
        RingCanvasGenerator.degree(360),
        true
      )
      this.ctx.strokeStyle = this.bottomRingConfig?.color || '#edf2ff'
      this.ctx.stroke()
    }

    const drawRing = ({
      startAngle,
      endAngle,
      gradientPoint,
      color,
    }: RingConfig) => {
      this.ctx.beginPath()
      this.ctx.arc(length / 2, length / 2, radius, startAngle, endAngle, true)
      const lineGradientPoint =
        typeof gradientPoint === 'function'
          ? gradientPoint(length / 2)
          : gradientPoint

      const linearGradient = this.ctx.createLinearGradient(...lineGradientPoint)
      linearGradient.addColorStop(0, color[0])
      linearGradient.addColorStop(1, color[1])
      this.ctx.strokeStyle = linearGradient
      this.ctx.stroke()
    }

    RingCanvasGenerator.defaultRingConfig[ringType](deg).forEach(
      (ringConfig, index) => {
        const payload = this.ringConfig
          ? { ...ringConfig, ...this.ringConfig[index] }
          : ringConfig
        drawRing(payload)
      }
    )
  }
}

interface RingConfig {
  startAngle: number
  endAngle: number
  gradientPoint:
    | ((radius: number) => [number, number, number, number])
    | [number, number, number, number]
  color: [string, string]
}

interface BottomRingConfig {
  color: string
}

interface RingInstance {
  length: number
  lineWidth: number
  deg: number
}

interface initOption {
  ctx: CanvasRenderingContext2D
  ringConfig?: Partial<RingConfig>[]
  bottomRingConfig?: BottomRingConfig
}

interface ConvertAngleToCoordinateParam {
  x: number
  y: number
  deg: number
  radius: number
}
