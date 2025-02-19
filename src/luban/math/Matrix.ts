import Vector from '@/luban/math/Vector'

export default class Matrix {
  constructor(array: Float32Array | null = null) {
    const value: Float32Array = new Float32Array(16)
    if (array === null) for (let i = 0; i < 16; i++) value[i] = i % 5 === 0 ? 1 : 0
    else for (let i = 0; i < 16; i++) value[i] = array[i]
    this._array = value
  }

  equals(m: Matrix): boolean {
    const a = this._array
    const b = m._array

    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false

    return true
  }

  clone(): Matrix {
    const m = new Matrix()

    const a = this._array
    const b = m._array

    for (let i = 0; i < 16; i++) b[i] = a[i]

    return m
  }

  multiply(m: Matrix): Matrix {
    const r = new Matrix()

    const a = this._array
    const b = m._array
    const c = r._array

    const a00 = a[0 * 4 + 0]
    const a01 = a[0 * 4 + 1]
    const a02 = a[0 * 4 + 2]
    const a03 = a[0 * 4 + 3]
    const a10 = a[1 * 4 + 0]
    const a11 = a[1 * 4 + 1]
    const a12 = a[1 * 4 + 2]
    const a13 = a[1 * 4 + 3]
    const a20 = a[2 * 4 + 0]
    const a21 = a[2 * 4 + 1]
    const a22 = a[2 * 4 + 2]
    const a23 = a[2 * 4 + 3]
    const a30 = a[3 * 4 + 0]
    const a31 = a[3 * 4 + 1]
    const a32 = a[3 * 4 + 2]
    const a33 = a[3 * 4 + 3]
    const b00 = b[0 * 4 + 0]
    const b01 = b[0 * 4 + 1]
    const b02 = b[0 * 4 + 2]
    const b03 = b[0 * 4 + 3]
    const b10 = b[1 * 4 + 0]
    const b11 = b[1 * 4 + 1]
    const b12 = b[1 * 4 + 2]
    const b13 = b[1 * 4 + 3]
    const b20 = b[2 * 4 + 0]
    const b21 = b[2 * 4 + 1]
    const b22 = b[2 * 4 + 2]
    const b23 = b[2 * 4 + 3]
    const b30 = b[3 * 4 + 0]
    const b31 = b[3 * 4 + 1]
    const b32 = b[3 * 4 + 2]
    const b33 = b[3 * 4 + 3]
    c[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30
    c[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31
    c[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32
    c[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33
    c[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30
    c[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31
    c[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32
    c[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33
    c[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30
    c[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31
    c[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32
    c[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33
    c[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30
    c[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31
    c[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32
    c[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33

    return r
  }

  translate(v: Vector): Matrix {
    const m = new Matrix()

    const a = this._array
    const b = m._array

    const tx = v.x
    const ty = v.y
    const tz = v.z

    const a00 = a[0 * 4 + 0]
    const a01 = a[0 * 4 + 1]
    const a02 = a[0 * 4 + 2]
    const a03 = a[0 * 4 + 3]
    const a10 = a[1 * 4 + 0]
    const a11 = a[1 * 4 + 1]
    const a12 = a[1 * 4 + 2]
    const a13 = a[1 * 4 + 3]
    const a20 = a[2 * 4 + 0]
    const a21 = a[2 * 4 + 1]
    const a22 = a[2 * 4 + 2]
    const a23 = a[2 * 4 + 3]
    const a30 = a[3 * 4 + 0]
    const a31 = a[3 * 4 + 1]
    const a32 = a[3 * 4 + 2]
    const a33 = a[3 * 4 + 3]

    b[0] = a00
    b[1] = a01
    b[2] = a02
    b[3] = a03
    b[4] = a10
    b[5] = a11
    b[6] = a12
    b[7] = a13
    b[8] = a20
    b[9] = a21
    b[10] = a22
    b[11] = a23
    b[12] = a00 * tx + a10 * ty + a20 * tz + a30
    b[13] = a01 * tx + a11 * ty + a21 * tz + a31
    b[14] = a02 * tx + a12 * ty + a22 * tz + a32
    b[15] = a03 * tx + a13 * ty + a23 * tz + a33

    return m
  }

  getTranslation(): [number, number, number] {
    const array = this._array
    // prettier-ignore
    return [
            array[12],
            array[13],
            array[14]
        ]
  }

  rotate(axis: Vector, angle: number): Matrix {
    const m = new Matrix()

    const a = this._array
    const b = m._array

    let x = axis.x,
      y = axis.y,
      z = axis.z
    let len = Math.hypot(x, y, z)
    if (len < Matrix.EPSILON) {
      return m
    }
    len = 1 / len
    x *= len
    y *= len
    z *= len

    const s = Math.sin(angle)
    const c = Math.cos(angle)
    const t = 1 - c

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a03 = a[3]
    const a10 = a[4]
    const a11 = a[5]
    const a12 = a[6]
    const a13 = a[7]
    const a20 = a[8]
    const a21 = a[9]
    const a22 = a[10]
    const a23 = a[11]
    // Construct the elements of the rotation matrix
    const b00 = x * x * t + c
    const b01 = y * x * t + z * s
    const b02 = z * x * t - y * s
    const b10 = x * y * t - z * s
    const b11 = y * y * t + c
    const b12 = z * y * t + x * s
    const b20 = x * z * t + y * s
    const b21 = y * z * t - x * s
    const b22 = z * z * t + c
    // Perform rotation-specific matrix multiplication
    b[0] = a00 * b00 + a10 * b01 + a20 * b02
    b[1] = a01 * b00 + a11 * b01 + a21 * b02
    b[2] = a02 * b00 + a12 * b01 + a22 * b02
    b[3] = a03 * b00 + a13 * b01 + a23 * b02
    b[4] = a00 * b10 + a10 * b11 + a20 * b12
    b[5] = a01 * b10 + a11 * b11 + a21 * b12
    b[6] = a02 * b10 + a12 * b11 + a22 * b12
    b[7] = a03 * b10 + a13 * b11 + a23 * b12
    b[8] = a00 * b20 + a10 * b21 + a20 * b22
    b[9] = a01 * b20 + a11 * b21 + a21 * b22
    b[10] = a02 * b20 + a12 * b21 + a22 * b22
    b[11] = a03 * b20 + a13 * b21 + a23 * b22
    b[12] = a[12]
    b[13] = a[13]
    b[14] = a[14]
    b[15] = a[15]

    return m
  }

  // prettier-ignore
  getRotation() {
        const array = this._array;
        const [scale0, scale1, scale2] = this.getScaling();

        const is1 = 1 / scale0;
        const is2 = 1 / scale1;
        const is3 = 1 / scale2;

        const sm11 = array[0] * is1;
        const sm12 = array[1] * is2;
        const sm13 = array[2] * is3;

        const sm21 = array[4] * is1;
        const sm22 = array[5] * is2;
        const sm23 = array[6] * is3;

        const sm31 = array[8] * is1;
        const sm32 = array[9] * is2;
        const sm33 = array[10] * is3;

        const trace = sm11 + sm22 + sm33;
        let S = 0;
        if (trace > 0) {
            S = Math.sqrt(trace + 1) * 2;
            return [
                (sm23 - sm32) / S,
                (sm31 - sm13) / S,
                (sm12 - sm21) / S,
                0.25 * S,
            ]
        }

        if (sm11 > sm22 && sm11 > sm33) {
            S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
            return [
                0.25 * S,
                (sm12 + sm21) / S,
                (sm31 + sm13) / S,
                (sm23 - sm32) / S,
            ]
        }

        if (sm22 > sm33) {
            S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
            return [
                (sm12 + sm21) / S,
                0.25 * S,
                (sm23 + sm32) / S,
                (sm31 - sm13) / S,
            ]
        }

        S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
        return [
            (sm31 + sm13) / S,
            (sm23 + sm32) / S,
            0.25 * S,
            (sm12 - sm21) / S,
        ]
    }

  getAngle(): [number, number, number] {
    const translateMatrix = Matrix.IDENTITY.translate(new Vector(...this.getTranslation()))
    const rotateArray = translateMatrix.inverse().multiply(this.clone()).array

    const siny = rotateArray[8]
    if (Math.abs(siny) === 1) {
      const asiny = Math.asin(siny)
      const isA = siny > 0 ? -1 : 1
      const cosx_z = (rotateArray[5] + rotateArray[2] * isA) / 2
      const sinx_z = (rotateArray[6] - rotateArray[1] * isA) / 2
      const atanx_z =
        cosx_z === 0 ? (sinx_z > 0 ? Math.PI / 2 : -Math.PI / 2) : Math.atan(sinx_z / cosx_z)
      const atanz = atanx_z / 2
      const atanx = atanx_z + atanz * isA
      return [atanx, asiny, atanz]
    }

    const [coszcosy, sinzcosy, sinxcosy, cosxcosy] = [
      rotateArray[0],
      -rotateArray[4],
      -rotateArray[9],
      rotateArray[10],
    ]

    const getQuadrant = (sin: number, cos: number): number => {
      if (sin >= 0 && cos >= 0) return 1
      if (sin < 0 && cos < 0) return 4
      if (sin >= 0 && cos < 0) return 2
      if (sin < 0 && cos >= 0) return 8
      return 0
    }

    const getATan = (sin: number, cos: number) => {
      const quadrant = getQuadrant(sin, cos)
      let val: number
      if (cos === 0) val = (quadrant & 3) > 0 ? Math.PI / 2 : -Math.PI / 2
      else {
        const val1 = (quadrant & 9) > 0 ? 0 : quadrant === 2 ? 1 : -1
        val = val1 * Math.PI + Math.atan(sin / cos)
      }
      return val
    }

    const asiny = Math.asin(siny)
    const atanx = getATan(sinxcosy, cosxcosy)
    const atanz = getATan(sinzcosy, coszcosy)

    return [atanx, asiny, atanz]
  }

  scale(v: Vector): Matrix {
    const scaleMatrix: Matrix = new Matrix()
    const dst = scaleMatrix._array
    const a = this._array
    const x = v.x
    const y = v.y
    const z = v.z
    dst[0] = a[0] * x
    dst[1] = a[1] * x
    dst[2] = a[2] * x
    dst[3] = a[3] * x
    dst[4] = a[4] * y
    dst[5] = a[5] * y
    dst[6] = a[6] * y
    dst[7] = a[7] * y
    dst[8] = a[8] * z
    dst[9] = a[9] * z
    dst[10] = a[10] * z
    dst[11] = a[11] * z
    dst[12] = a[12]
    dst[13] = a[13]
    dst[14] = a[14]
    dst[15] = a[15]
    return scaleMatrix
  }

  getScaling(): [number, number, number] {
    const array = this._array
    const m11 = array[0]
    const m12 = array[1]
    const m13 = array[2]

    const m21 = array[4]
    const m22 = array[5]
    const m23 = array[6]

    const m31 = array[8]
    const m32 = array[9]
    const m33 = array[10]
    // prettier-ignore
    return [
            Math.hypot(m11, m12, m13),
            Math.hypot(m21, m22, m23),
            Math.hypot(m31, m32, m33)
        ]
  }

  transpose(): Matrix {
    const transposeMatrix: Matrix = new Matrix()
    const dst = transposeMatrix._array
    const m = this._array
    dst[0] = m[0]
    dst[1] = m[4]
    dst[2] = m[8]
    dst[3] = m[12]
    dst[4] = m[1]
    dst[5] = m[5]
    dst[6] = m[9]
    dst[7] = m[13]
    dst[8] = m[2]
    dst[9] = m[6]
    dst[10] = m[10]
    dst[11] = m[14]
    dst[12] = m[3]
    dst[13] = m[7]
    dst[14] = m[11]
    dst[15] = m[15]
    return transposeMatrix
  }

  inverse(): Matrix {
    const inversionMatrix: Matrix = new Matrix()
    const m = this._array
    const dst = inversionMatrix._array
    const m00 = m[0 * 4 + 0]
    const m01 = m[0 * 4 + 1]
    const m02 = m[0 * 4 + 2]
    const m03 = m[0 * 4 + 3]
    const m10 = m[1 * 4 + 0]
    const m11 = m[1 * 4 + 1]
    const m12 = m[1 * 4 + 2]
    const m13 = m[1 * 4 + 3]
    const m20 = m[2 * 4 + 0]
    const m21 = m[2 * 4 + 1]
    const m22 = m[2 * 4 + 2]
    const m23 = m[2 * 4 + 3]
    const m30 = m[3 * 4 + 0]
    const m31 = m[3 * 4 + 1]
    const m32 = m[3 * 4 + 2]
    const m33 = m[3 * 4 + 3]
    const tmp_0 = m22 * m33
    const tmp_1 = m32 * m23
    const tmp_2 = m12 * m33
    const tmp_3 = m32 * m13
    const tmp_4 = m12 * m23
    const tmp_5 = m22 * m13
    const tmp_6 = m02 * m33
    const tmp_7 = m32 * m03
    const tmp_8 = m02 * m23
    const tmp_9 = m22 * m03
    const tmp_10 = m02 * m13
    const tmp_11 = m12 * m03
    const tmp_12 = m20 * m31
    const tmp_13 = m30 * m21
    const tmp_14 = m10 * m31
    const tmp_15 = m30 * m11
    const tmp_16 = m10 * m21
    const tmp_17 = m20 * m11
    const tmp_18 = m00 * m31
    const tmp_19 = m30 * m01
    const tmp_20 = m00 * m21
    const tmp_21 = m20 * m01
    const tmp_22 = m00 * m11
    const tmp_23 = m10 * m01

    const t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
    const t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
    const t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
    const t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

    const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

    dst[0] = d * t0
    dst[1] = d * t1
    dst[2] = d * t2
    dst[3] = d * t3
    dst[4] =
      d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30))
    dst[5] =
      d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30))
    dst[6] =
      d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30))
    dst[7] =
      d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20))
    dst[8] =
      d *
      (tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33 - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33))
    dst[9] =
      d *
      (tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33 - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33))
    dst[10] =
      d *
      (tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33 - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33))
    dst[11] =
      d *
      (tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23 - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23))
    dst[12] =
      d *
      (tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12 - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22))
    dst[13] =
      d *
      (tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22 - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02))
    dst[14] =
      d *
      (tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02 - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12))
    dst[15] =
      d *
      (tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12 - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))

    return inversionMatrix
  }

  adjoint(): Matrix {
    const adjointMatrix = new Matrix()
    const out = adjointMatrix._array
    const a = this._array
    const a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3]
    const a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7]
    const a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11]
    const a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]
    out[0] =
      a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22)
    out[1] = -(
      a01 * (a22 * a33 - a23 * a32) -
      a21 * (a02 * a33 - a03 * a32) +
      a31 * (a02 * a23 - a03 * a22)
    )
    out[2] =
      a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12)
    out[3] = -(
      a01 * (a12 * a23 - a13 * a22) -
      a11 * (a02 * a23 - a03 * a22) +
      a21 * (a02 * a13 - a03 * a12)
    )
    out[4] = -(
      a10 * (a22 * a33 - a23 * a32) -
      a20 * (a12 * a33 - a13 * a32) +
      a30 * (a12 * a23 - a13 * a22)
    )
    out[5] =
      a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22)
    out[6] = -(
      a00 * (a12 * a33 - a13 * a32) -
      a10 * (a02 * a33 - a03 * a32) +
      a30 * (a02 * a13 - a03 * a12)
    )
    out[7] =
      a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12)
    out[8] =
      a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21)
    out[9] = -(
      a00 * (a21 * a33 - a23 * a31) -
      a20 * (a01 * a33 - a03 * a31) +
      a30 * (a01 * a23 - a03 * a21)
    )
    out[10] =
      a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11)
    out[11] = -(
      a00 * (a11 * a23 - a13 * a21) -
      a10 * (a01 * a23 - a03 * a21) +
      a20 * (a01 * a13 - a03 * a11)
    )
    out[12] = -(
      a10 * (a21 * a32 - a22 * a31) -
      a20 * (a11 * a32 - a12 * a31) +
      a30 * (a11 * a22 - a12 * a21)
    )
    out[13] =
      a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21)
    out[14] = -(
      a00 * (a11 * a32 - a12 * a31) -
      a10 * (a01 * a32 - a02 * a31) +
      a30 * (a01 * a12 - a02 * a11)
    )
    out[15] =
      a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11)
    return adjointMatrix
  }

  static fromRotationTranslation(
    quat: [number, number, number, number],
    translation: [number, number, number],
  ): Matrix {
    const [x, y, z, w] = quat
    const x2 = x + x
    const y2 = y + y
    const z2 = z + z

    const xx = x * x2
    const xy = x * y2
    const xz = x * z2
    const yy = y * y2
    const yz = y * z2
    const zz = z * z2
    const wx = w * x2
    const wy = w * y2
    const wz = w * z2
    return new Matrix(
      new Float32Array([
        1 - (yy + zz),
        xy + wz,
        xz - wy,
        0,
        xy - wz,
        1 - (xx + zz),
        yz + wx,
        0,
        xz + wy,
        yz - wx,
        1 - (xx + yy),
        0,
        translation[0],
        translation[1],
        translation[2],
        1,
      ]),
    )
  }

  static ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number,
  ): Matrix {
    const orthoMatrix: Matrix = new Matrix()
    const out = orthoMatrix._array
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (near - far)
    out[0] = -2 * lr
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 0
    out[5] = -2 * bt
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[10] = 2 * nf
    out[11] = 0
    out[12] = (left + right) * lr
    out[13] = (top + bottom) * bt
    out[14] = (far + near) * nf
    out[15] = 1
    return orthoMatrix
  }

  static perspective(fovy: number, aspect: number, near: number, far: number): Matrix {
    const perspectiveMatrix: Matrix = new Matrix()
    const out = perspectiveMatrix._array
    const f = 1.0 / Math.tan(fovy / 2)
    let nf
    out[0] = f / aspect
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 0
    out[5] = f
    out[6] = 0
    out[7] = 0
    out[8] = 0
    out[9] = 0
    out[11] = -1
    out[12] = 0
    out[13] = 0
    out[15] = 0
    if (far !== null && far !== Infinity) {
      nf = 1 / (near - far)
      out[10] = (far + near) * nf
      out[14] = 2 * far * near * nf
    } else {
      out[10] = -1
      out[14] = -2 * near
    }
    return perspectiveMatrix
  }

  transform(x0: number, y0: number, z0: number) {
    const matrix = this._array
    const x = matrix[0] * x0 + matrix[4] * y0 + matrix[8] * z0 + matrix[12]
    const y = matrix[1] * x0 + matrix[5] * y0 + matrix[9] * z0 + matrix[13]
    const z = matrix[2] * x0 + matrix[6] * y0 + matrix[10] * z0 + matrix[14]
    return { x, y, z }
  }

  get array(): Readonly<Float32Array> {
    return this._array
  }

  /**
   * 以列向量的形式存储，表示的矩阵如下所示。
   *
   * |0,  4,  8,  12|
   * |1,  5,  9,  13|
   * |2,  6, 10,  14|
   * |3,  7, 11,  15|
   */
  private _array: Float32Array
  static readonly EPSILON = 0.000001
  static readonly IDENTITY: Matrix = new Matrix()
}
