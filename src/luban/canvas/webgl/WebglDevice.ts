import DashedLineBuffer from '@/luban/canvas/buffer/DashedLineBuffer'
import FaceBuffer from '@/luban/canvas/buffer/FaceBuffer'
import { FaceBufferType } from '@/luban/canvas/buffer/FaceBufferType'
import LineBuffer from '@/luban/canvas/buffer/LineBuffer'
import { LineBufferType } from '@/luban/canvas/buffer/LineBufferType'
import PointBuffer from '@/luban/canvas/buffer/PointBuffer'
import TextureBuffer from '@/luban/canvas/buffer/TextureBuffer'
import Color from '@/luban/canvas/Color'
import Context from '@/luban/canvas/Context'
import type Device from '@/luban/canvas/Device'
import type EventHandler from '@/luban/canvas/event/EventHandler'
import type IndexBuffer from '@/luban/canvas/IndexBuffer'
import type Texture from '@/luban/canvas/Texture'
import type VertexBuffer from '@/luban/canvas/VertexBuffer'
import ColoredDashedLineProgram from '@/luban/canvas/webgl/program/ColoredDashedLineProgram'
import ColoredFaceProgram from '@/luban/canvas/webgl/program/ColoredFaceProgram'
import ColoredLineProgram from '@/luban/canvas/webgl/program/ColoredLineProgram'
import ColoredPointProgram from '@/luban/canvas/webgl/program/ColoredPointProgram'
import Face2DProgram from '@/luban/canvas/webgl/program/Face2DProgram'
import Line2DProgram from '@/luban/canvas/webgl/program/Line2DProgram'
import PickProgram from '@/luban/canvas/webgl/program/PickProgram'
import TexturedFaceProgram from '@/luban/canvas/webgl/program/TexturedFaceProgram'
import WebglIndexBuffer from '@/luban/canvas/webgl/WebglIndexBuffer'
import WebglTexture from '@/luban/canvas/webgl/WebglTexture'
import WebglVertexBuffer from '@/luban/canvas/webgl/WebglVertexBuffer'

export default class WebglDevice implements Device {
  constructor(canvas: HTMLCanvasElement, eventHandler: EventHandler) {
    const webgl = canvas.getContext('webgl2', {
      antialias: true,
      stencil: true,
    }) as WebGL2RenderingContext

    webgl.clearColor(1.0, 1.0, 1.0, 1.0)
    webgl.clearDepth(1.0)
    webgl.enable(webgl.DEPTH_TEST)
    webgl.enable(webgl.BLEND)
    webgl.blendFuncSeparate(
      webgl.SRC_ALPHA,
      webgl.ONE_MINUS_SRC_ALPHA,
      webgl.ONE,
      webgl.ONE_MINUS_SRC_ALPHA,
    )
    webgl.enable(webgl.POLYGON_OFFSET_FILL)
    webgl.lineWidth(1)
    console.log(webgl.getExtension('WEBKIT_EXT_texture_filter_anisotropic'))

    this.coloredLineProgram = new ColoredLineProgram(webgl)
    this.coloredDashedLineProgram = new ColoredDashedLineProgram(webgl)
    this.coloredFaceProgram = new ColoredFaceProgram(webgl)
    this.texturedFaceProgram = new TexturedFaceProgram(webgl)

    this.pickProgram = new PickProgram(webgl)
    this.pickFrameBuffer = webgl.createFramebuffer() as WebGLFramebuffer
    this.pickRenderBuffer = webgl.createRenderbuffer() as WebGLRenderbuffer
    this.pickTexture = webgl.createTexture() as WebGLTexture
    const texture = webgl.createTexture()
    webgl.bindTexture(webgl.TEXTURE_2D, texture)
    const ext =
      webgl.getExtension('EXT_texture_filter_anisotropic') ||
      webgl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
      webgl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
    console.log(ext, '-------------')

    this.line2DProgram = new Line2DProgram(webgl)
    this.face2DProgram = new Face2DProgram(webgl)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canvas.oncontextmenu = (ev: MouseEvent) => {
      return false
    }

    canvas.onmousedown = (ev: MouseEvent) => {
      return eventHandler.onMouseDown(ev)
    }

    canvas.onmousemove = (ev: MouseEvent) => {
      return eventHandler.onMouseMove(ev)
    }

    canvas.onmouseup = (ev: MouseEvent) => {
      return eventHandler.onMouseUp(ev)
    }

    canvas.onmouseleave = (ev: MouseEvent) => {
      return eventHandler.onMouseLeave(ev)
    }

    canvas.onwheel = (ev: WheelEvent) => {
      return eventHandler.onWheel(ev)
    }

    canvas.onkeydown = (ev: KeyboardEvent) => {
      eventHandler.onKeyDown(ev)
    }

    canvas.onkeyup = (ev: KeyboardEvent) => {
      eventHandler.onKeyUp(ev)
    }

    this.canvas = canvas
    this.webgl = webgl

    this.coloredPointProgram = new ColoredPointProgram(
      webgl,
      this.createArrayTexture(ColoredPointProgram.pointTextureImage, 64, 64) as WebglTexture,
    )
  }

  createVertexBuffer(array: number[]): VertexBuffer {
    const webgl = this.webgl as WebGL2RenderingContext
    const buffer = webgl.createBuffer() as WebGLBuffer
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer)
    webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(array), webgl.STATIC_DRAW)
    return new WebglVertexBuffer(webgl, buffer)
  }

  createIndexBuffer(array: number[]): IndexBuffer {
    const webgl = this.webgl as WebGL2RenderingContext
    const buffer = webgl.createBuffer() as WebGLBuffer
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, buffer)
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint32Array(array), webgl.STATIC_DRAW)
    return new WebglIndexBuffer(webgl, buffer)
  }

  updateBuffer(buffer: WebGLBuffer, array: number[]) {
    const webgl = this.webgl as WebGL2RenderingContext
    webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer)
    this.webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(array), webgl.STATIC_DRAW)
  }

  createTextTexture(
    text: string,
    fontFamily: string,
    fontSize: number,
    textColor: Color,
    backgroundColor: Color,
  ): Texture {
    const textCanvas = document.createElement('canvas')

    const context2d = textCanvas.getContext('2d') as CanvasRenderingContext2D
    context2d.font = `normal ${fontSize}px ${fontFamily}`
    const textWidth = context2d.measureText(text).width
    textCanvas.width = textWidth
    textCanvas.height = fontSize
    context2d.font = `normal ${fontSize}px ${fontFamily}`
    context2d.textAlign = 'center'
    context2d.textBaseline = 'middle'

    const { r: bgRed, g: bgGreen, b: bgBlue, a: bgAlpha } = backgroundColor
    context2d.fillStyle = `rgba(${[bgRed, bgGreen, bgBlue, bgAlpha].join(',')})`

    context2d.fillRect(0, 0, textCanvas.width, textCanvas.height)

    const { r: textR, g: textG, b: textB, a: textA } = textColor
    context2d.fillStyle = `rgba(${textR}, ${textG}, ${textB}, ${textA})`
    context2d.fillText(text, textWidth / 2, fontSize / 2)

    const webgl = this.webgl
    const texture = webgl.createTexture() as WebGLTexture
    const myTexture = new WebglTexture(webgl, texture)
    myTexture.width = textCanvas.width
    myTexture.height = textCanvas.height
    webgl.activeTexture(myTexture.number)
    webgl.bindTexture(webgl.TEXTURE_2D, texture)
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, textCanvas)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR)

    return myTexture
  }

  createArrayTexture(pixels: ArrayBufferView, width: number, height: number): Texture {
    const webgl = this.webgl
    const texture = webgl.createTexture() as WebGLTexture
    const myTexture = new WebglTexture(webgl, texture)
    webgl.activeTexture(myTexture.number)
    webgl.bindTexture(webgl.TEXTURE_2D, texture)
    webgl.texImage2D(
      webgl.TEXTURE_2D,
      0,
      webgl.RGBA,
      width,
      height,
      0,
      webgl.RGBA,
      webgl.UNSIGNED_BYTE,
      pixels,
    )

    return myTexture
  }

  createImageTexture(source: TexImageSource) {
    const webgl = this.webgl
    const texture = webgl.createTexture() as WebGLTexture
    const myTexture = new WebglTexture(webgl, texture)
    webgl.activeTexture(myTexture.number)
    webgl.bindTexture(webgl.TEXTURE_2D, texture)
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, source)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR)
    webgl.generateMipmap(webgl.TEXTURE_2D)

    return myTexture
  }

  clear(): void {
    const webgl: WebGLRenderingContext = this.webgl
    webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT)
  }

  clearDepth(): void {
    const webgl: WebGLRenderingContext = this.webgl
    webgl.clear(webgl.DEPTH_BUFFER_BIT)
  }

  disableDepth(): void {
    const webgl = this.webgl
    webgl.disable(webgl.DEPTH_TEST)
  }

  enableDepth(): void {
    const webgl = this.webgl
    webgl.enable(webgl.DEPTH_TEST)
  }

  depthMask(flag: boolean): void {
    this.webgl.depthMask(flag)
  }

  beginDraw(): void {
    this.webgl.polygonOffset(1, 1)
    this.clear()
  }

  endDraw(): void {}

  drawPoint(context: Context, buffer: PointBuffer, color: Color): void {
    const webgl: WebGLRenderingContext = this.webgl
    const pointProgram: ColoredPointProgram = this.coloredPointProgram

    webgl.useProgram(pointProgram.program)

    webgl.uniformMatrix4fv(
      pointProgram.vertexMatrixUniformPosition,
      false,
      context.vertexMatrix.array,
    )
    webgl.uniform4f(pointProgram.colorUniformPosition, ...color.rgba)

    webgl.bindBuffer(webgl.ARRAY_BUFFER, (buffer.vertexes as WebglVertexBuffer).buffer)

    webgl.vertexAttribPointer(pointProgram.vertexAttribPosition, 3, webgl.FLOAT, false, 0, 0)
    webgl.enableVertexAttribArray(pointProgram.vertexAttribPosition)
    webgl.disable(webgl.DEPTH_TEST)
    webgl.activeTexture(pointProgram.pointTexture.number)
    webgl.bindTexture(webgl.TEXTURE_2D, pointProgram.pointTexture.texture)
    webgl.uniform1i(
      pointProgram.textureUniformPosition,
      pointProgram.pointTexture.number - WebglTexture.StartIndex,
    )
    webgl.drawArrays(webgl.POINTS, 0, 1)
    webgl.enable(webgl.DEPTH_TEST)
  }

  drawLine(context: Context, buffer: LineBuffer, color: Color, width = 2): void {
    const webgl = this.webgl
    const isDashedLine = buffer instanceof DashedLineBuffer
    const lineProgram = isDashedLine ? this.coloredDashedLineProgram : this.coloredLineProgram

    webgl.useProgram(lineProgram.program)

    webgl.uniformMatrix4fv(
      lineProgram.vertexMatrixUniformPosition,
      false,
      context.vertexMatrix.array,
    )
    webgl.uniform4f(lineProgram.colorUniformPosition, ...color.rgba)

    webgl.bindBuffer(webgl.ARRAY_BUFFER, (buffer.vertexes as WebglVertexBuffer).buffer)

    webgl.vertexAttribPointer(lineProgram.vertexAttribPosition, 3, webgl.FLOAT, false, 0, 0)
    webgl.enableVertexAttribArray(lineProgram.vertexAttribPosition)

    if (isDashedLine) {
      const dashedLineProgram = lineProgram as ColoredDashedLineProgram
      webgl.uniform1f(
        dashedLineProgram.dashSizeUniformPosition,
        buffer.dashed * context.orthoUnits * 2,
      )
      webgl.uniform1f(
        dashedLineProgram.totalSizeUniformPosition,
        buffer.total * context.orthoUnits * 2,
      )

      webgl.bindBuffer(webgl.ARRAY_BUFFER, (buffer.lengths as WebglVertexBuffer).buffer)
      webgl.vertexAttribPointer(dashedLineProgram.lengthAttribPosition, 1, webgl.FLOAT, false, 0, 0)
      webgl.enableVertexAttribArray(dashedLineProgram.lengthAttribPosition)
    }

    const mode = WebglDevice.lineBufferType.get(buffer.type) as GLenum
    let xOffset = NaN
    let yOffset = NaN

    const maxOffset = Math.max((width - 1) / 2, 0)
    const [canvasWidth, canvasHeight] = [this.width(), this.height()]
    for (let p = 0; p <= maxOffset; p += 0.5) {
      xOffset = (p / canvasWidth) * 2
      yOffset = (p / canvasHeight) * 2

      webgl.uniform2f(lineProgram.offsetUniformPosition, xOffset, yOffset)
      webgl.drawArrays(mode, buffer.first, buffer.count)
      webgl.uniform2f(lineProgram.offsetUniformPosition, xOffset, -yOffset)
      webgl.drawArrays(mode, buffer.first, buffer.count)
      webgl.uniform2f(lineProgram.offsetUniformPosition, -xOffset, -yOffset)
      webgl.drawArrays(mode, buffer.first, buffer.count)
      webgl.uniform2f(lineProgram.offsetUniformPosition, -xOffset, yOffset)
      webgl.drawArrays(mode, buffer.first, buffer.count)
    }
  }

  drawLine2D(context: Context, buffer: LineBuffer, color: Color): void {
    const webgl = this.webgl
    const line2DProgram = this.line2DProgram

    webgl.useProgram(line2DProgram.program)

    // webgl.uniformMatrix4fv(Line2DProgram.vertexMatrixUniformPosition, false, context.vertexMatrix.array);
    webgl.uniform4f(line2DProgram.colorUniformPosition, ...color.rgba)

    webgl.bindBuffer(webgl.ARRAY_BUFFER, (buffer.vertexes as WebglVertexBuffer).buffer)

    webgl.vertexAttribPointer(line2DProgram.vertexAttribPosition, 2, webgl.FLOAT, false, 0, 0)
    webgl.enableVertexAttribArray(line2DProgram.vertexAttribPosition)
    const xOffset = (0.5 / this.width()) * 2
    const yOffset = (0.5 / this.height()) * 2

    // const xOffset = 0;
    // const yOffset = 0;
    const mode = WebglDevice.lineBufferType.get(buffer.type) as GLenum

    webgl.uniform2f(line2DProgram.offsetUniformPosition, xOffset, yOffset)
    webgl.drawArrays(mode, buffer.first, buffer.count)
    webgl.uniform2f(line2DProgram.offsetUniformPosition, xOffset, -yOffset)
    webgl.drawArrays(mode, buffer.first, buffer.count)
    webgl.uniform2f(line2DProgram.offsetUniformPosition, -xOffset, -yOffset)
    webgl.drawArrays(mode, buffer.first, buffer.count)
    webgl.uniform2f(line2DProgram.offsetUniformPosition, -xOffset, yOffset)
    webgl.drawArrays(mode, buffer.first, buffer.count)
  }
  drawFace(context: Context, buffer: FaceBuffer, color: Color, texture?: TextureBuffer): void {
    const webgl = this.webgl
    const faceProgram = texture ? this.texturedFaceProgram : this.coloredFaceProgram
    webgl.useProgram(faceProgram.program)
    webgl.uniformMatrix4fv(
      faceProgram.vertexMatrixUniformPosition,
      false,
      context.vertexMatrix.array,
    )
    webgl.uniformMatrix4fv(
      faceProgram.normalMatrixUniformPosition,
      false,
      context.normalMatrix.array,
    )
    webgl.uniform4f((faceProgram as ColoredFaceProgram).colorUniformPosition, ...color.rgba)

    const { ambientLightColor, pointLightColor, pointLightVector } = context
    webgl.uniform3f(faceProgram.ambientColorUniformPosition, ...ambientLightColor.rgb)
    webgl.uniform3f(faceProgram.pointColorUniformPosition, ...pointLightColor.rgb)
    webgl.uniform3f(faceProgram.pointVectorUniformPosition, ...pointLightVector.xyz)

    webgl.bindBuffer(webgl.ARRAY_BUFFER, (buffer.vertexes as WebglVertexBuffer).buffer)
    webgl.vertexAttribPointer(faceProgram.vertexAttribPosition, 3, webgl.FLOAT, false, 0, 0)
    webgl.enableVertexAttribArray(faceProgram.vertexAttribPosition)

    webgl.bindBuffer(webgl.ARRAY_BUFFER, (buffer.normals as WebglVertexBuffer).buffer)
    webgl.vertexAttribPointer(faceProgram.normalAttribPosition, 3, webgl.FLOAT, false, 0, 0)
    webgl.enableVertexAttribArray(faceProgram.normalAttribPosition)

    if (faceProgram instanceof TexturedFaceProgram) {
      const program = faceProgram as TexturedFaceProgram
      const textureBuffer = texture as TextureBuffer
      webgl.bindBuffer(webgl.ARRAY_BUFFER, (textureBuffer.coordinate as WebglVertexBuffer).buffer)
      webgl.vertexAttribPointer(program.textureCoordPosition, 2, webgl.FLOAT, false, 0, 0)
      webgl.enableVertexAttribArray(program.textureCoordPosition)

      webgl.activeTexture((textureBuffer.texture as WebglTexture).number)
      webgl.bindTexture(webgl.TEXTURE_2D, (textureBuffer.texture as WebglTexture).texture)
      webgl.uniform1i(
        program.samplerUniformPosition,
        (textureBuffer.texture as WebglTexture).number - WebglTexture.StartIndex,
      )
    }

    const mode = WebglDevice.faceBufferType.get(buffer.type) as GLenum

    if (buffer.indexes) {
      webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, (buffer.indexes as WebglIndexBuffer).buffer)
      webgl.drawElements(mode, buffer.count, webgl.UNSIGNED_INT, buffer.first)
    } else {
      webgl.drawArrays(mode, buffer.first, buffer.count)
    }
  }
  drawFace2D(context: Context, buffer: FaceBuffer, color: Color): void {
    const webgl = this.webgl
    const face2DProgram = this.face2DProgram
    webgl.useProgram(face2DProgram.program)
    webgl.uniform4f((face2DProgram as ColoredFaceProgram).colorUniformPosition, ...color.rgba)

    webgl.bindBuffer(webgl.ARRAY_BUFFER, (buffer.vertexes as WebglVertexBuffer).buffer)
    webgl.vertexAttribPointer(face2DProgram.vertexAttribPosition, 2, webgl.FLOAT, false, 0, 0)
    webgl.enableVertexAttribArray(face2DProgram.vertexAttribPosition)

    const mode = WebglDevice.faceBufferType.get(buffer.type) as GLenum
    if (buffer.indexes) {
      webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, (buffer.indexes as WebglIndexBuffer).buffer)
      webgl.drawElements(mode, buffer.count, webgl.UNSIGNED_INT, buffer.first)
    } else {
      webgl.drawArrays(mode, buffer.first, buffer.count)
    }
  }

  pick(
    context: Context,
    buffer: { vertexes: VertexBuffer; indexes?: IndexBuffer; first: number; count: number },
    id: number,
    mode: GLenum,
  ): void {
    const webgl = this.webgl
    const pickProgram: PickProgram = this.pickProgram

    webgl.useProgram(pickProgram.program)

    webgl.uniformMatrix4fv(
      pickProgram.vertexMatrixUniformPosition,
      false,
      context.vertexMatrix.array,
    )

    webgl.uniform4f(
      pickProgram.colorUniformPosition,
      ((id >> 24) & 0xff) / 255,
      ((id >> 16) & 0xff) / 255,
      ((id >> 8) & 0xff) / 255,
      (id & 0xff) / 255,
    )
    webgl.bindBuffer(webgl.ARRAY_BUFFER, (buffer.vertexes as WebglVertexBuffer).buffer)

    webgl.vertexAttribPointer(pickProgram.vertexAttribPosition, 3, webgl.FLOAT, false, 0, 0)
    webgl.enableVertexAttribArray(pickProgram.vertexAttribPosition)

    if (buffer.indexes) {
      webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, (buffer.indexes as WebglIndexBuffer).buffer)
      webgl.drawElements(mode, buffer.count, webgl.UNSIGNED_INT, buffer.first)
    } else {
      webgl.drawArrays(mode, buffer.first, buffer.count)
    }
  }

  pickPoint(context: Context, buffer: PointBuffer, id: number): void {
    this.pick(
      context,
      { vertexes: buffer.vertexes, first: buffer.first, count: buffer.count },
      id,
      this.webgl.POINTS,
    )
  }

  pickLine(context: Context, buffer: LineBuffer, id: number): void {
    this.pick(
      context,
      { vertexes: buffer.vertexes, first: buffer.first, count: buffer.count },
      id,
      WebglDevice.lineBufferType.get(buffer.type) as GLenum,
    )
  }

  pickFace(context: Context, buffer: FaceBuffer, id: number): void {
    this.pick(
      context,
      {
        vertexes: buffer.vertexes,
        indexes: buffer.indexes,
        first: buffer.first,
        count: buffer.count,
      },
      id,
      WebglDevice.faceBufferType.get(buffer.type) as GLenum,
    )
  }

  beginPick(): void {
    const webgl = this.webgl
    const width = this.width()
    const height = this.height()

    webgl.bindTexture(webgl.TEXTURE_2D, this.pickTexture)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)
    webgl.texImage2D(
      webgl.TEXTURE_2D,
      0,
      webgl.RGBA,
      width,
      height,
      0,
      webgl.RGBA,
      webgl.UNSIGNED_BYTE,
      null,
    )

    webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.pickRenderBuffer)
    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_COMPONENT16, width, height)

    webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.pickFrameBuffer)
    webgl.framebufferTexture2D(
      webgl.FRAMEBUFFER,
      webgl.COLOR_ATTACHMENT0,
      webgl.TEXTURE_2D,
      this.pickTexture,
      0,
    )
    webgl.framebufferRenderbuffer(
      webgl.FRAMEBUFFER,
      webgl.DEPTH_ATTACHMENT,
      webgl.RENDERBUFFER,
      this.pickRenderBuffer,
    )

    webgl.disable(webgl.BLEND)
    webgl.polygonOffset(1, 1)
    this.clear()
  }

  endPick(): void {
    const webgl = this.webgl

    webgl.enable(webgl.BLEND)
    webgl.bindFramebuffer(webgl.FRAMEBUFFER, null)
  }

  getPicked(x: number, y: number, w: number, h: number): number[] {
    const webgl: WebGLRenderingContext = this.webgl

    const pixels = new Uint8Array(4 * w * h)
    webgl.readPixels(x, y, w, h, webgl.RGBA, webgl.UNSIGNED_BYTE, pixels)
    const picked: number[] = []

    for (let i = 0, length = pixels.length; i < length; i += 4)
      picked.push((pixels[i] << 24) | (pixels[i + 1] << 16) | (pixels[i + 2] << 8) | pixels[i + 3])
    return picked
  }

  width(): number {
    return this.canvas.width
  }

  height(): number {
    return this.canvas.height
  }

  resize(width: number, height: number): void {
    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'
    const devicePixelRatio: number = window.devicePixelRatio
    this.canvas.width = width * devicePixelRatio
    this.canvas.height = height * devicePixelRatio
    this.webgl.viewport(0, 0, width * devicePixelRatio, height * devicePixelRatio)
  }

  canvas: HTMLCanvasElement
  webgl: WebGLRenderingContext

  coloredPointProgram: ColoredPointProgram
  coloredLineProgram: ColoredLineProgram
  coloredDashedLineProgram: ColoredDashedLineProgram
  coloredFaceProgram: ColoredFaceProgram
  texturedFaceProgram: TexturedFaceProgram
  line2DProgram: Line2DProgram
  face2DProgram: Face2DProgram

  pickProgram: PickProgram
  pickFrameBuffer: WebGLFramebuffer
  pickRenderBuffer: WebGLRenderbuffer
  pickTexture: WebGLTexture

  static faceBufferType = new Map<FaceBufferType, GLenum>([
    [FaceBufferType.Default, WebGLRenderingContext.prototype.TRIANGLES],
    [FaceBufferType.Strip, WebGLRenderingContext.prototype.TRIANGLE_STRIP],
    [FaceBufferType.Fan, WebGLRenderingContext.prototype.TRIANGLE_FAN],
  ])
  static lineBufferType = new Map<LineBufferType, GLenum>([
    [LineBufferType.Default, WebGLRenderingContext.prototype.LINES],
    [LineBufferType.Strip, WebGLRenderingContext.prototype.LINE_STRIP],
    [LineBufferType.Loop, WebGLRenderingContext.prototype.LINE_LOOP],
  ])
}
