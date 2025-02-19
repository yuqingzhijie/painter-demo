export default interface EventHandler {
  next: EventHandler | null

  onMouseDown(ev: MouseEvent): boolean
  onMouseMove(ev: MouseEvent): boolean
  onMouseUp(ev: MouseEvent): boolean
  onMouseLeave(ev: MouseEvent): boolean
  onWheel(ev: MouseEvent): boolean
  onKeyDown(ev: KeyboardEvent): boolean
  onKeyUp(ev: KeyboardEvent): boolean
}
