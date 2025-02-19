import Context from '@/luban/canvas/Context'
import type Device from '@/luban/canvas/Device'

export default interface Drawable {
  draw(device: Device, context: Context): void
}
