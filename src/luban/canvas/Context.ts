import Color from '@/luban/canvas/Color'
import type Device from '@/luban/canvas/Device'
import { RenderMode } from '@/luban/canvas/RenderMode'
import Matrix from '@/luban/math/Matrix'
import Vector from '@/luban/math/Vector'

export default class Context {
  constructor(device: Device) {
    this._modelMatrix = Matrix.IDENTITY
    this._viewMatrix = Matrix.IDENTITY
    this.canvasSize = { width: device.width(), height: device.height() }
    this.orthoUnits = Context.INIT_ORTHO_UNIT
    this.ambientLightColor = new Color(120, 120, 120)
    this.pointLightColor = new Color(200, 200, 200)
    this.pointLightVector = new Vector(1, 1, 1)
    this.renderMode = RenderMode.Shaded

    this.updateVertexMatrix()
    this.updateNormalMatrix()
  }

  get vertexMatrix(): Matrix {
    return this._vertexMatrix
  }

  get normalMatrix(): Matrix {
    return this._normalMatrix
  }

  set modelMatrix(m: Matrix) {
    this._modelMatrix = m.clone()
    this.updateVertexMatrix()
    this.updateNormalMatrix()
  }

  get modelMatrix(): Matrix {
    return this._modelMatrix
  }

  set viewMatrix(m: Matrix) {
    this._viewMatrix = m.clone()
    this.updateVertexMatrix()
    this.updateNormalMatrix()
    this.updateDiceMatrix()
  }

  get viewMatrix(): Matrix {
    return this._viewMatrix
  }

  set projectMatrix(m: Matrix) {
    this._projectionMatrix = m.clone()
    this._projectionInverseMatrix = this._projectionMatrix.inverse()
    this.updateVertexMatrix()
  }

  get projectMatrix(): Matrix {
    return this._projectionMatrix
  }

  get projectionInverseMatrix(): Matrix {
    return this._projectionInverseMatrix
  }

  get diceMatrix(): Matrix {
    return this._diceMatrix
  }

  set orthoUnits(orthoUnits: number) {
    this._orthoUnits = orthoUnits
    this.updateProjectionMatrix()
  }

  get orthoUnits(): number {
    return this._orthoUnits
  }

  set canvasSize(size: { width: number; height: number }) {
    this._canvasSize = size
    this.updateProjectionMatrix()
    this.updateDiceMatrix()
  }

  private updateProjectionMatrix(): void {
    const orthoUnitsW = this._canvasSize.width * this._orthoUnits
    const orthoUnitsH = this._canvasSize.height * this._orthoUnits
    this.projectMatrix = Matrix.ortho(
      -orthoUnitsW,
      orthoUnitsW,
      -orthoUnitsH,
      orthoUnitsH,
      -10000,
      10000,
    )
  }

  private updateVertexMatrix(): void {
    this._vertexMatrix = this._projectionMatrix
      .multiply(this._viewMatrix)
      .multiply(this._modelMatrix)
  }

  private updateNormalMatrix(): void {
    this._normalMatrix = this._modelMatrix.multiply(this._viewMatrix).inverse().transpose()
  }

  private updateDiceMatrix(): void {
    const viewMatrix = new Matrix(
      this.viewMatrix.array.map((x) => {
        return x > 11 ? 0 : x
      }),
    )
    const orthoUnitsW = this._canvasSize.width * Context.INIT_ORTHO_UNIT
    const orthoUnitsH = this._canvasSize.height * Context.INIT_ORTHO_UNIT
    this._diceMatrix = Matrix.ortho(
      -orthoUnitsW,
      orthoUnitsW,
      -orthoUnitsH,
      orthoUnitsH,
      -10000,
      10000,
    ).multiply(viewMatrix)
  }

  private _modelMatrix!: Matrix
  private _viewMatrix!: Matrix
  private _projectionMatrix!: Matrix
  private _projectionInverseMatrix!: Matrix
  private _vertexMatrix!: Matrix
  private _normalMatrix!: Matrix

  private _canvasSize!: { width: number; height: number }

  private _diceMatrix!: Matrix

  private _orthoUnits!: number

  ambientLightColor: Color
  pointLightColor: Color
  pointLightVector: Vector

  renderMode: RenderMode

  static readonly INIT_ORTHO_UNIT: number = 0.2
}
