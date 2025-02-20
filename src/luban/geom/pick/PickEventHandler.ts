import PartPickFilter from '@/luban/geom/part/PartPickFilter'
import type { Container, EventHandler } from '@painter/gl-canvas'
import { Canvas, DummyEventHandler, Geometry } from '@painter/gl-canvas'
// import PickFilter from '@/luban/geom/pick/PickFilter'

export default class PickEventHandler extends DummyEventHandler {
  constructor(canvas: Canvas, next: EventHandler | null = null) {
    super(next)
    this.canvas = canvas
    this.filter = new PartPickFilter()
  }
  onMouseDown(ev: MouseEvent): boolean {
    if (ev.button !== 0) return super.onMouseDown(ev)

    this.isSelfDownEv = true
    this.downX = ev.offsetX
    this.downY = ev.offsetY
    return true
  }
  getPicked(ev: MouseEvent): (Geometry | null)[] {
    const container = this.canvas.root as Container
    if (this.isMoved(ev)) {
      // large move
      return []
    } else if (this.isSelfDownEv || (ev.type !== 'mouseup' && ev.buttons === 0)) {
      // click, small move, hover
      const d = 5
      return this.canvas
        .getPicked(ev.offsetX - d, ev.offsetY - d, 2 * d + 1, 2 * d + 1)
        .map((x) => (x === -1 ? null : container.geometries[x]))
    } else {
      return []
    }
  }
  onMouseMove(ev: MouseEvent): boolean {
    if (ev.buttons === 0) {
      // hover
      const geometry = this.filter.filter(this.getPicked(ev))
      this.canvas.draw()
      geometry?.hover(this.canvas.device, this.canvas.context)
    }

    return true
  }
  onMouseUp(ev: MouseEvent): boolean {
    const container = this.canvas.root as Container
    const picked: (Geometry | null)[] = this.getPicked(ev)
    if (picked.length === 1 && picked[0] === null) {
      for (const geometry of container.picks) geometry.picked = false
      container.picks = []
    } else if (this.isMoved(ev)) {
      for (const geometry of picked) {
        if (geometry) {
          geometry.picked = false
        }
        geometry?.click(this.canvas.device, this.canvas.context)
      }
    } else {
      this.filter.filter(picked)?.click(this.canvas.device, this.canvas.context)
    }

    this.canvas.draw()
    this.isSelfDownEv = false
    return true
  }

  // 鼠标移动超过一定距离才算move，不然小范围移动算点击
  // 从画布外长按左键进来的移动事件不处理，必须是画布里面的
  isMoved(ev: MouseEvent): boolean {
    const xDistance = Math.abs(ev.offsetX - this.downX)
    const yDistance = Math.abs(ev.offsetY - this.downY)
    return this.isSelfDownEv && xDistance + yDistance >= 4
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseLeave(ev: MouseEvent): boolean {
    this.isSelfDownEv = false
    return true
  }

  canvas: Canvas
  isSelfDownEv!: boolean
  downX!: number
  downY!: number

  filter: PartPickFilter
}
