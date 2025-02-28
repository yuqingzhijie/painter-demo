import { Context, Matrix, Vector, type Canvas } from '@painter/gl-canvas'

function returnInitialView(canvas: Canvas): void {
  console.log('test ------------------------')
  const m = Matrix.IDENTITY
  const m2 = m.rotate(Vector.Y_AXIS, Math.PI / 2).rotate(Vector.Z_AXIS, Math.PI / 2)
  console.log('m2: ', m2.array)
  console.log(m2.getAngle())
  console.log('vm: ', canvas.context.viewMatrix)
  console.log('end ---------------------------')
  const context = canvas.context
  const oldViewMatrix = context.viewMatrix
  const angle = oldViewMatrix.getAngle()
  const translation = oldViewMatrix.getTranslation()
  const oldCameraSize = context.orthoUnits

  const STEP_TOTAL = 40
  let currentStep = STEP_TOTAL - 1
  function step() {
    const stepValue = currentStep / STEP_TOTAL
    const translationMatrix = Matrix.IDENTITY.translate(
      new Vector(
        translation[0] * stepValue,
        translation[1] * stepValue,
        translation[2] * stepValue,
      ),
    )
    console.log(
      translation[0] * stepValue,
      translation[1] * stepValue,
      translation[2] * stepValue,
      angle[0] / Math.PI,
      angle[1] / Math.PI,
      angle[2] / Math.PI,
      (angle[0] * stepValue) / Math.PI,
      (angle[1] * stepValue) / Math.PI,
      (angle[2] * stepValue) / Math.PI,
    )
    const rotateMatrix = Matrix.IDENTITY.rotate(Vector.X_AXIS, angle[0] * stepValue)
      .rotate(Vector.Y_AXIS, angle[1] * stepValue)
      .rotate(Vector.Z_AXIS, angle[2] * stepValue)

    context.viewMatrix = translationMatrix.multiply(rotateMatrix)
    context.orthoUnits =
      Context.INIT_ORTHO_UNIT - (Context.INIT_ORTHO_UNIT - oldCameraSize) * stepValue
    canvas.draw()

    currentStep--
    if (currentStep >= 0) {
      requestAnimationFrame(step)
      // setTimeout(() => step(), 1000)
    }
  }
  step()
}

export { returnInitialView }
