// import Clickable from '@/luban/canvas/Clickable'
import Context from '@/luban/canvas/Context'
import type Device from '@/luban/canvas/Device'
import type Container from '@/luban/geom/Container'

export default abstract class Geometry {
  constructor(container: Container, id: number) {
    this.id = id
    this._picked = false
    this.container = container
  }
  //
  // eslint-disable-next-line
  hover(device: Device, context: Context): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  click(device: Device, context: Context): void {
    this.picked = !this.picked
    if (this.picked === true) {
      this.container.picks.push(this)
    } else {
      this.container.picks.splice(this.container.picks.indexOf(this), 1)
    }
  }

  get picked(): boolean {
    return this._picked
  }

  set picked(flag: boolean) {
    this._picked = flag
  }

  abstract draw(device: Device, context: Context): void
  abstract pick(device: Device, context: Context): void

  id: number
  private _picked: boolean
  container: Container
}
