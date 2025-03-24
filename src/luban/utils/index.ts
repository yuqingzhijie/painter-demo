import { useCanvasStore } from '@/stores/canvas'
import { Context, Matrix, Vector, type Canvas } from '@gl-painter/gl-canvas'

type Quaternion = { w: number; x: number; y: number; z: number }
function matrixToQuaternion(matrix: number[]): Quaternion {
  // 提取 3x3 旋转矩阵
  const r11 = matrix[0] // m0
  const r21 = matrix[1] // m1
  const r31 = matrix[2] // m2
  const r12 = matrix[4] // m4
  const r22 = matrix[5] // m5
  const r32 = matrix[6] // m6
  const r13 = matrix[8] // m8
  const r23 = matrix[9] // m9
  const r33 = matrix[10] // m10

  // 计算四元数
  const trace = r11 + r22 + r33
  let w, x, y, z

  if (trace > 0) {
    const s = 0.5 / Math.sqrt(trace + 1.0)
    w = 0.25 / s
    x = (r32 - r23) * s
    y = (r13 - r31) * s
    z = (r21 - r12) * s
  } else if (r11 > r22 && r11 > r33) {
    const s = 2.0 * Math.sqrt(1.0 + r11 - r22 - r33)
    w = (r32 - r23) / s
    x = 0.25 * s
    y = (r12 + r21) / s
    z = (r13 + r31) / s
  } else if (r22 > r33) {
    const s = 2.0 * Math.sqrt(1.0 + r22 - r11 - r33)
    w = (r13 - r31) / s
    x = (r12 + r21) / s
    y = 0.25 * s
    z = (r23 + r32) / s
  } else {
    const s = 2.0 * Math.sqrt(1.0 + r33 - r11 - r22)
    w = (r21 - r12) / s
    x = (r13 + r31) / s
    y = (r23 + r32) / s
    z = 0.25 * s
  }

  return { w, x, y, z }
}

function quaternionToMatrix(q: Quaternion) {
  const { w, x, y, z } = q
  const xx = x * x,
    xy = x * y,
    xz = x * z
  const yy = y * y,
    yz = y * z,
    zz = z * z
  const wx = w * x,
    wy = w * y,
    wz = w * z

  // 列主序排列
  return new Matrix(
    new Float32Array([
      1 - 2 * (yy + zz), // m00 (第一列第一个元素)
      2 * (xy + wz), // m10 (第一列第二个元素)
      2 * (xz - wy), // m20 (第一列第三个元素)
      0,

      2 * (xy - wz), // m01 (第二列第一个元素)
      1 - 2 * (xx + zz), // m11 (第二列第二个元素)
      2 * (yz + wx), // m21 (第二列第三个元素)
      0,

      2 * (xz + wy), // m02 (第三列第一个元素)
      2 * (yz - wx), // m12 (第三列第二个元素)
      1 - 2 * (xx + yy), // m22 (第三列第三个元素)
      0,

      0,
      0,
      0,
      1, // 第四列
    ]),
  )
}

function slerp(q0: Quaternion, q1: Quaternion, t: number): Quaternion {
  // 计算点积
  let cosTheta = q0.w * q1.w + q0.x * q1.x + q0.y * q1.y + q0.z * q1.z

  // 如果点积为负，取反 q1 以选择最短路径
  if (cosTheta < 0) {
    q1 = { w: -q1.w, x: -q1.x, y: -q1.y, z: -q1.z }
    cosTheta = -cosTheta
  }

  // 如果四元数几乎相同，直接线性插值
  if (cosTheta > 0.9995) {
    return {
      w: (1 - t) * q0.w + t * q1.w,
      x: (1 - t) * q0.x + t * q1.x,
      y: (1 - t) * q0.y + t * q1.y,
      z: (1 - t) * q0.z + t * q1.z,
    }
  }

  // 计算夹角和插值权重
  const theta = Math.acos(cosTheta)
  const sinTheta = Math.sin(theta)
  const w0 = Math.sin((1 - t) * theta) / sinTheta
  const w1 = Math.sin(t * theta) / sinTheta

  // 返回插值结果
  return {
    w: w0 * q0.w + w1 * q1.w,
    x: w0 * q0.x + w1 * q1.x,
    y: w0 * q0.y + w1 * q1.y,
    z: w0 * q0.z + w1 * q1.z,
  }
}

function setView(targetViewMatrix: Matrix): void {
  const canvas = useCanvasStore().rawCanvas as Canvas
  const context = canvas.context
  const oldViewMatrix = context.viewMatrix
  const oldQuaternion = matrixToQuaternion(oldViewMatrix.array as unknown as number[])
  const tarQuaternion = matrixToQuaternion(targetViewMatrix.array as unknown as number[])
  // todo getTranslation为什么不返回向量
  const translation = oldViewMatrix.getTranslation()
  const oldCameraSize = context.orthoUnits

  const STEP_TOTAL = 40
  let currentStep = STEP_TOTAL - 1
  function step() {
    const stepValue = currentStep / STEP_TOTAL
    const nextQuaternion = slerp(oldQuaternion, tarQuaternion, 1 - stepValue)
    const nextRotateMatrix = quaternionToMatrix(nextQuaternion)
    const translationMatrix = Matrix.IDENTITY.translate(
      new Vector(
        translation[0] * stepValue,
        translation[1] * stepValue,
        translation[2] * stepValue,
      ),
    )

    context.viewMatrix = translationMatrix.multiply(nextRotateMatrix)
    context.orthoUnits =
      Context.INIT_ORTHO_UNIT - (Context.INIT_ORTHO_UNIT - oldCameraSize) * stepValue
    canvas.draw()
    if (currentStep === 0) {
      canvas.pick()
    }

    currentStep--
    if (currentStep >= 0) {
      requestAnimationFrame(step)
      // setTimeout(() => step(), 1000)
    }
  }
  step()
}

export { setView }
