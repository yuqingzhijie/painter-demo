import Context from '@/luban/canvas/Context'
import type Device from '@/luban/canvas/Device'
import type Pickable from '@/luban/canvas/Pickable'

export default interface Clickable extends Pickable {
  hover(device: Device, context: Context): void
  click(device: Device, context: Context): void
}
