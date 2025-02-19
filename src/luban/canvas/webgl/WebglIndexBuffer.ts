import type IndexBuffer from '@/luban/canvas/IndexBuffer'

export default class WebglIndexBuffer implements IndexBuffer {
  constructor(webgl: WebGLRenderingContext, buffer: WebGLBuffer) {
    this.webgl = webgl
    this.buffer = buffer
  }
  webgl: WebGLRenderingContext
  buffer: WebGLBuffer
}
