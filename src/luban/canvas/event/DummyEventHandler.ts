import type EventHandler from '@/luban/canvas/event/EventHandler'

export default class DummyEventHandler implements EventHandler {
  constructor(next: EventHandler | null = null) {
    this.next = next
  }
  onMouseDown(ev: MouseEvent): boolean {
    return this.next === null ? false : this.next.onMouseDown(ev)
  }
  onMouseMove(ev: MouseEvent): boolean {
    return this.next === null ? false : this.next.onMouseMove(ev)
  }
  onMouseUp(ev: MouseEvent): boolean {
    return this.next === null ? false : this.next.onMouseUp(ev)
  }
  onMouseLeave(ev: MouseEvent): boolean {
    return this.next === null ? false : this.next.onMouseLeave(ev)
  }
  onWheel(ev: WheelEvent): boolean {
    return this.next === null ? false : this.next.onWheel(ev)
  }
  onKeyDown(ev: KeyboardEvent): boolean {
    return this.next === null ? false : this.next.onKeyDown(ev)
  }
  onKeyUp(ev: KeyboardEvent): boolean {
    return this.next === null ? false : this.next.onKeyUp(ev)
  }
  next: EventHandler | null
}
