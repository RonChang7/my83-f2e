export class RingCanvasGenerator {
  constructor(public type: RingType) {}

  static overRingCanvasGenerator(config: Config) {
    const { ctx, length, lineWidth } = config
    const radius = config.radius - lineWidth / 2
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    const arcConfigs: arcConfig[] = [
      // leftTop
      {
        x: length / 2,
        y: length / 2,
        radius,
        startAngle: -0.5 * Math.PI,
        endAngle: 1 * Math.PI,
        gradientPoint: [radius, 0, 0, radius],
        color: ['#6980D1', '#4C6AD5'],
      },
      // leftBottom
      {
        x: length / 2,
        y: length / 2,
        radius,
        startAngle: 1 * Math.PI,
        endAngle: 0.5 * Math.PI,
        gradientPoint: [0, radius, radius, radius * 2],
        color: ['#4C6AD5', '#8C75AF'],
      },
      // rightBottom
      {
        x: length / 2,
        y: length / 2,
        radius,
        startAngle: 0.5 * Math.PI,
        endAngle: 0 * Math.PI,
        gradientPoint: [radius, radius * 2, radius * 2, radius],
        color: ['#8C75AF', '#D07F86'],
      },
      // rightTop
      {
        x: length / 2,
        y: length / 2,
        radius,
        startAngle: 0 * Math.PI,
        endAngle: -0.5 * Math.PI,
        gradientPoint: [radius * 2, radius, radius, 0],
        color: ['#D07F86', '#FF8659'],
      },
    ]

    arcConfigs.forEach(
      ({ x, y, radius, startAngle, endAngle, gradientPoint, color }) => {
        ctx.beginPath()
        ctx.arc(x, y, radius, startAngle, endAngle, true)
        const linearGradient = ctx.createLinearGradient(...gradientPoint)
        linearGradient.addColorStop(0, color[0])
        linearGradient.addColorStop(1, color[1])
        ctx.strokeStyle = linearGradient
        ctx.stroke()
      }
    )
  }

  static lowerRingCanvasGenerator(config: Config) {
    if (config.deg && config.deg > 360) {
      return RingCanvasGenerator.overRingCanvasGenerator(config)
    } else if (config.deg && !(config.deg % 360)) {
      return RingCanvasGenerator.fillRingCanvasGenerator(config)
    }

    const { ctx, length, lineWidth } = config
    const deg = Number(config.deg)
    const radius = config.radius - lineWidth / 2
    const degShift = -0.5 * Math.PI
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.arc(length / 2, length / 2, radius, 0, 2 * Math.PI, true)
    ctx.strokeStyle = '#edf2ff'
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(
      length / 2,
      length / 2,
      radius,
      0 + degShift,
      -(deg / 180) * Math.PI + degShift,
      true
    )
    const endPoint = RingCanvasGenerator.convertAngleToCoordinate({
      x: length / 2,
      y: length / 2,
      radius: config.radius,
      deg,
    })

    const linearGradient = ctx.createLinearGradient(
      length / 2,
      0,
      endPoint.x,
      endPoint.y
    )
    linearGradient.addColorStop(0, '#899fe6')
    linearGradient.addColorStop(1, '#506ed0')
    ctx.strokeStyle = linearGradient
    ctx.stroke()
  }

  static fillRingCanvasGenerator(config: Config) {
    const { ctx, length, lineWidth } = config
    const radius = config.radius - lineWidth / 2
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.arc(length / 2, length / 2, radius, 0, 2 * Math.PI, true)
    const linearGradient = ctx.createLinearGradient(
      length / 2,
      0,
      length / 2,
      length
    )
    linearGradient.addColorStop(0, '#899fe6')
    linearGradient.addColorStop(1, '#506ed0')
    ctx.strokeStyle = linearGradient
    ctx.stroke()
  }

  private static convertAngleToCoordinate(
    parma: convertAngleToCoordinateParam
  ) {
    const deg = parma.deg + 90
    return {
      x: parma.x + Math.cos((deg / 180) * Math.PI) * parma.radius,
      y: parma.y - Math.sin((deg / 180) * Math.PI) * parma.radius,
    }
  }

  create(config: Config) {
    switch (this.type) {
      case 'over':
        RingCanvasGenerator.overRingCanvasGenerator(config)
        return
      case 'lower':
        RingCanvasGenerator.lowerRingCanvasGenerator(config)
        return
      case 'fill':
        RingCanvasGenerator.fillRingCanvasGenerator(config)
    }
  }
}

export type RingType = 'over' | 'lower' | 'fill'

export interface Config {
  ctx: CanvasRenderingContext2D
  length: number
  lineWidth: number
  radius: number
  deg?: number
  scale?: number
}

interface arcConfig {
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
  gradientPoint: [number, number, number, number]
  color: [string, string]
}

interface convertAngleToCoordinateParam {
  x: number
  y: number
  deg: number
  radius: number
}
