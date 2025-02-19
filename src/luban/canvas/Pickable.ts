import Context from '@/luban/canvas/Context'
import type Device from '@/luban/canvas/Device'
import type Drawable from '@/luban/canvas/Drawable'

export default interface Pickable extends Drawable {
  pick(device: Device, context: Context): void
}
