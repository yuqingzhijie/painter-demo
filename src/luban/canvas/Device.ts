import FaceBuffer from '@/luban/canvas/buffer/FaceBuffer'
import LineBuffer from '@/luban/canvas/buffer/LineBuffer'
import PointBuffer from '@/luban/canvas/buffer/PointBuffer'
import TextureBuffer from '@/luban/canvas/buffer/TextureBuffer'
import Color from '@/luban/canvas/Color'
import Context from '@/luban/canvas/Context'
import type IndexBuffer from '@/luban/canvas/IndexBuffer'
import type Texture from '@/luban/canvas/Texture'
import type VertexBuffer from '@/luban/canvas/VertexBuffer'

export default interface Device {
  createVertexBuffer(array: number[]): VertexBuffer
  createIndexBuffer(array: number[]): IndexBuffer

  createTextTexture(
    text: string,
    fontFamily: string,
    fontSize: number,
    textColor: Color,
    backgroundColor: Color,
  ): Texture
  createArrayTexture(pixels: ArrayBufferView, width: number, height: number): Texture
  createImageTexture(source: TexImageSource): Texture

  clearDepth(): void

  disableDepth(): void
  enableDepth(): void

  depthMask(flag: boolean): void

  beginDraw(): void
  endDraw(): void

  drawPoint(context: Context, buffer: PointBuffer, color: Color): void
  drawLine(context: Context, buffer: LineBuffer, color: Color, width?: number): void
  drawFace(context: Context, buffer: FaceBuffer, color: Color, texture?: TextureBuffer): void
  drawLine2D(context: Context, buffer: LineBuffer, color: Color): void
  drawFace2D(context: Context, buffer: FaceBuffer, color: Color): void

  beginPick(): void
  endPick(): void

  pickPoint(context: Context, buffer: PointBuffer, id: number): void
  pickLine(context: Context, buffer: LineBuffer, id: number): void
  pickFace(context: Context, buffer: FaceBuffer, id: number): void

  getPicked(x: number, y: number, w: number, h: number): number[]

  width(): number
  height(): number

  resize(width: number, height: number): void
}
