import { Matrix, Vector } from '@gl-painter/gl-canvas'

const DICE_CONFIG = {
  width: 20,
  /** 初始id，id逐渐递减 */
  id: -2,
  list: [
    {
      text: '前',
      matrix: Matrix.IDENTITY,
    },
    {
      text: '后',
      matrix: Matrix.IDENTITY.rotate(Vector.Z_AXIS, Math.PI).rotate(Vector.X_AXIS, Math.PI),
    },
    {
      text: '上',
      matrix: Matrix.IDENTITY.rotate(Vector.NEG_X_AXIS, Math.PI / 2),
    },
    {
      text: '下',
      matrix: Matrix.IDENTITY.rotate(Vector.X_AXIS, Math.PI / 2),
    },
    {
      text: '左',
      matrix: Matrix.IDENTITY.rotate(Vector.NEG_Y_AXIS, Math.PI / 2),
    },
    {
      text: '右',
      matrix: Matrix.IDENTITY.rotate(Vector.Y_AXIS, Math.PI / 2),
    },
  ],
}

export { DICE_CONFIG }
