import Edge from '@/luban/geom/part/Edge'
import Geometry3d, { type DrawOptions } from '@/luban/geom/part/Geometry3d'
import Shape from '@/luban/geom/part/Shape'
import type { Container, Device } from '@painter/gl-canvas'
import { Color, Context, FaceBuffer, FaceBufferType, TextureBuffer } from '@painter/gl-canvas'

export default class Face extends Geometry3d {
  constructor(
    container: Container,
    id: number,
    shape: Shape,
    data: {
      vertexes: number[]
      normals: number[]
      indexes?: number[]
    },
    color: Color,
    texture?: {
      textImageSource: TexImageSource
      textureBuffer: number[]
    },
  ) {
    super(container, id)
    this.shape = shape
    this.vertexes = data.vertexes
    this.normals = data.normals
    this.indexes = data.indexes
    this.color = color
    this.texture = texture
  }

  createBuffer(device: Device): void {
    if (this.faceBuffer === undefined) {
      this.faceBuffer = new FaceBuffer(
        {
          vertexes: device.createVertexBuffer(this.vertexes),
          normals: device.createVertexBuffer(this.normals),
          indexes: this.indexes ? device.createIndexBuffer(this.indexes) : this.indexes,
        },
        0,
        this.indexes ? this.indexes.length : this.vertexes.length / 3,
        this.indexes ? FaceBufferType.Default : FaceBufferType.Strip,
      )
    }
    if (this.texture && this.textureBuffer === undefined) {
      const texture = this.texture
      this.textureBuffer = new TextureBuffer(
        device.createImageTexture(texture.textImageSource),
        device.createVertexBuffer(texture.textureBuffer),
      )
    }
  }

  draw(device: Device, context: Context, options?: DrawOptions): void {
    this.createBuffer(device)
    let color = this.picked ? Color.PICKED_FACE_COLOR : options?.color || this.color
    color = new Color(...color.rgb, options?.opacity || color.a)
    device.drawFace(context, this.faceBuffer as FaceBuffer, color, this.textureBuffer)
  }

  pick(device: Device, context: Context): void {
    this.createBuffer(device)
    device.pickFace(context, this.faceBuffer as FaceBuffer, this.id)
  }

  hover(device: Device, context: Context): void {
    for (const border of this.borders) border?.hover(device, context)
  }

  shape: Shape

  borders: Edge[] = []

  vertexes: number[]
  normals: number[]
  indexes?: number[]
  color: Color
  texture?: {
    textImageSource: TexImageSource
    textureBuffer: number[]
  }
  faceBuffer?: FaceBuffer
  textureBuffer?: TextureBuffer
}
