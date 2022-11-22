import { type Prisma } from '@prisma/client'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')

// eslint-disable-next-line @typescript-eslint/ban-types
export function transformBlockShape (shape: number[][], transformation: Prisma.TransformationGetPayload<{}>, borderWidth: number) {
  if (transformation.reflection) {
    shape = Array2D.flip(shape, Array2D.AXES.X)
  }
  for (let i = 0; i < transformation.rotation; i++) {
    shape = Array2D.rotate(shape, Array2D.DIRECTIONS.RIGHT)
  }
  if (transformation.translationUp != null || transformation.translationRight != null) {
    for (let i = 0; i < borderWidth; i++) {
      shape = Array2D.pad(shape, Array2D.EDGES.TOP, 1, 0)
      shape = Array2D.pad(shape, Array2D.EDGES.LEFT, 1, 0)
      shape = Array2D.pad(shape, Array2D.EDGES.BOTTOM, 1, 0)
      shape = Array2D.pad(shape, Array2D.EDGES.RIGHT, 1, 0)
    }
    for (let i = transformation.translationUp; i !== 0; (i > 0 ? i-- : i++)) { // ❤️
      shape = Array2D.slide(shape, (i > 0 ? Array2D.DIRECTIONS.UP : Array2D.DIRECTIONS.DOWN), 1)
    }
    for (let i = transformation.translationRight; i !== 0; (i > 0 ? i-- : i++)) {
      shape = Array2D.slide(shape, (i > 0 ? Array2D.DIRECTIONS.RIGHT : Array2D.DIRECTIONS.LEFT), 1)
    }
  }
  return shape
}
