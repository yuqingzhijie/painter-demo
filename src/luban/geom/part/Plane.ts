import Geometry3d from '@/luban/geom/part/Geometry3d'
import type { Container, Device } from '@gl-painter/gl-canvas'
import {
  Color,
  Context,
  FaceBuffer,
  LineBuffer,
  LineBufferType,
  Matrix,
  TextureBuffer,
} from '@gl-painter/gl-canvas'

export default class Plane extends Geometry3d {
  constructor(container: Container, id: number, text: string, matrix: Matrix) {
    super(container, id)
    this.text = text || ' '
    this.matrix = matrix
  }

  createBuffer(device: Device, context: Context): void {
    if (
      this.lineBuffer === undefined &&
      this.faceBuffer === undefined &&
      this.textureBuffer === undefined
    ) {
      const p = [
        [this.width / 2, this.height / 2, 0],
        [-this.width / 2, this.height / 2, 0],
        [-this.width / 2, -this.height / 2, 0],
        [this.width / 2, -this.height / 2, 0],
      ]

      this.lineBuffer = new LineBuffer(
        device.createVertexBuffer([...p[0], ...p[1], ...p[2], ...p[3]]),
        0,
        4,
        LineBufferType.Loop,
      )
      this.faceBuffer = new FaceBuffer(
        {
          vertexes: device.createVertexBuffer([...p[0], ...p[1], ...p[3], ...p[2]]),
          normals: device.createVertexBuffer([]),
        },
        0,
        4,
      )

      const texture = device.createTextTexture(
        this.text,
        // 'Arial',
        'Flama,Open Sans,Helvetica Neue,Helvetica,Arial,sans-serif',
        18,
        Color.PLANE_TEXT_COLOE,
        Color.PLANE_FACE_COLOR,
      )

      const textWidth = texture.width
      const textHeight = texture.height
      const ratio = context.orthoUnits
      const planeWidthInCssUnit = this.width / ratio / 2 / window.devicePixelRatio
      const planeHeightInCssUnit = this.height / ratio / 2 / window.devicePixelRatio
      const paddingTop = 10
      const paddingLeft = 16

      this.textureBuffer = new TextureBuffer(
        texture,
        device.createVertexBuffer([
          (planeWidthInCssUnit - paddingLeft) / textWidth,
          -paddingTop / textHeight,
          -paddingLeft / textWidth,
          -paddingTop / textHeight,
          (planeWidthInCssUnit - paddingLeft) / textWidth,
          (planeHeightInCssUnit - paddingTop) / textHeight,
          -paddingLeft / textWidth,
          (planeHeightInCssUnit - paddingTop) / textHeight,
        ]),
      )
    }
  }

  draw(device: Device, context: Context): void {
    this.createBuffer(device, context)
    const modelMatrix = context.modelMatrix
    context.modelMatrix = this.matrix.multiply(modelMatrix)
    device.drawLine(
      context,
      this.lineBuffer as LineBuffer,
      this.picked ? Color.PICKED_EDGE_COLOR : Color.PLANE_EDGE_COLOR,
      3,
    )
    device.drawFace(
      context,
      this.faceBuffer as FaceBuffer,
      Color.PLANE_FACE_COLOR,
      this.textureBuffer as TextureBuffer,
    )
    context.modelMatrix = modelMatrix
  }

  pick(device: Device, context: Context): void {
    this.createBuffer(device, context)
    const modelMatrix = context.modelMatrix
    context.modelMatrix = this.matrix.multiply(modelMatrix)
    device.pickFace(context, this.faceBuffer as FaceBuffer, this.id)
    context.modelMatrix = modelMatrix
  }

  hover(device: Device, context: Context): void {
    const modelMatrix = context.modelMatrix
    context.modelMatrix = this.matrix.multiply(modelMatrix)
    device.disableDepth()
    device.drawLine(context, this.lineBuffer as LineBuffer, Color.HOVER_COLOR)
    device.enableDepth()
    context.modelMatrix = modelMatrix
  }

  text: string
  width = 300
  height = 200
  matrix: Matrix

  lineBuffer?: LineBuffer
  faceBuffer?: FaceBuffer
  textureBuffer?: TextureBuffer
}
