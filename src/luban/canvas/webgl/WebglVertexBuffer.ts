import type VertexBuffer from '@/luban/canvas/VertexBuffer'

export default class WebglVertexBuffer implements VertexBuffer {
  constructor(webgl: WebGLRenderingContext, buffer: WebGLBuffer) {
    this.webgl = webgl
    this.buffer = buffer
  }
  webgl: WebGLRenderingContext
  buffer: WebGLBuffer
}
