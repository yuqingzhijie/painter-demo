export default class Color {
  constructor(r: number, g: number, b: number, a = 1.0) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }

  readonly r: number
  readonly g: number
  readonly b: number
  readonly a: number

  get rgba(): [number, number, number, number] {
    const { r, g, b, a } = this
    return [r / 255, g / 255, b / 255, a]
  }

  get rgb(): [number, number, number] {
    const { r, g, b } = this
    return [r / 255, g / 255, b / 255]
  }

  static readonly RED: Color = new Color(255, 0, 0)
  static readonly BLUE: Color = new Color(0, 0, 255)
  static readonly GREEN: Color = new Color(0, 255, 0)

  static readonly WHITE: Color = new Color(255, 255, 255)
  static readonly BLACK: Color = new Color(0, 0, 0)

  static readonly POINT_COLOR = new Color(0, 0, 0)
  static readonly EDGE_COLOR = new Color(35, 47, 53)
  static readonly FACE_COLOR: Color = new Color(142, 184, 213)

  static readonly HOVER_COLOR = new Color(232, 155, 28)
  static readonly PICKED_EDGE_COLOR = new Color(232, 155, 28)
  static readonly PICKED_FACE_COLOR = new Color(232, 155, 28)

  static readonly PLANE_TEXT_COLOE = new Color(23, 64, 162, 1)
  static readonly PLANE_EDGE_COLOR = new Color(161, 183, 217, 0.75)
  static readonly PLANE_FACE_COLOR = new Color(243, 246, 249, 0.1)
}
