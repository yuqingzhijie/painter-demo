import type Dice from '@/luban/geom/dice/Dice'
import Geometry3d from '@/luban/geom/part/Geometry3d'
import { setView } from '@/luban/utils'
import type { Device, Matrix } from '@painter/gl-canvas'
import { Color, Context, FaceBuffer, FaceBufferType, TextureBuffer } from '@painter/gl-canvas'

export default class DiceFace extends Geometry3d {
  constructor(container: Dice, id: number, vertexes: number[], text: string, matrix: Matrix) {
    super(container, id)
    this.vertexes = vertexes
    this.text = text
    this.matrix = matrix
  }

  createBuffer(device: Device): void {
    if (this.faceBuffer === undefined || this.textureBuffer === undefined) {
      this.faceBuffer = new FaceBuffer(
        {
          vertexes: device.createVertexBuffer(this.vertexes),
          normals: device.createVertexBuffer(this.normals),
        },
        0,
        this.vertexes.length / 3,
        FaceBufferType.Strip,
      )
      const texture = device.createTextTexture(
        this.text,
        'Arial,Flama,Open Sans,Helvetica Neue,Helvetica,sans-serif',
        24,
        this.colorOptions.textColor,
        this.colorOptions.faceColor,
      )
      const hoveredTexture = device.createTextTexture(
        this.text,
        'Arial,Flama,Open Sans,Helvetica Neue,Helvetica,sans-serif',
        24,
        this.colorOptions.textColor,
        this.colorOptions.hoveredFaceColor,
      )
      const verTexBuffer = device.createVertexBuffer([1.6, -0.6, -0.6, -0.6, 1.6, 1.6, -0.6, 1.6])
      this.hoveredTextureBuffer = new TextureBuffer(hoveredTexture, verTexBuffer)
      this.textureBuffer = new TextureBuffer(texture, verTexBuffer)
    }
  }

  draw(device: Device, context: Context): void {
    this.createBuffer(device)
    const modelMatrix = context.modelMatrix
    context.modelMatrix = modelMatrix.multiply(this.matrix)
    device.drawFace(
      context,
      this.faceBuffer as FaceBuffer,
      this.colorOptions.faceColor,
      this.textureBuffer as TextureBuffer,
    )
    context.modelMatrix = modelMatrix
  }

  pick(device: Device, context: Context): void {
    this.createBuffer(device)
    const modelMatrix = context.modelMatrix
    context.modelMatrix = modelMatrix.multiply(this.matrix)
    device.pickFace(context, this.faceBuffer as FaceBuffer, this.id)
    context.modelMatrix = modelMatrix
  }

  hover(device: Device, context: Context): void {
    this.createBuffer(device)
    const modelMatrix = context.modelMatrix
    context.modelMatrix = modelMatrix.multiply(this.matrix)
    device.setPolygonOffset(-1, -1)
    device.drawFace(
      context,
      this.faceBuffer as FaceBuffer,
      this.colorOptions.hoveredFaceColor,
      this.hoveredTextureBuffer as TextureBuffer,
    )
    device.setPolygonOffset(1, 1)
    context.modelMatrix = modelMatrix
  }

  click(device: Device, context: Context): void {
    setView(this.matrix.inverse())
  }

  vertexes: number[]
  normals: number[] = Array(4).fill([0, 0, 1]).flat()
  text: string
  matrix: Matrix
  colorOptions = {
    faceColor: new Color(200, 215, 250),
    hoveredFaceColor: new Color(175, 200, 250),
    textColor: new Color(45, 125, 215),
  }
  faceBuffer?: FaceBuffer
  textureBuffer?: TextureBuffer
  hoveredTextureBuffer?: TextureBuffer
}
