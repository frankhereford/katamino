import { type Prisma } from '@prisma/client'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')

export function transformBlockShape (
  shape: number[][],
  // eslint-disable-next-line @typescript-eslint/ban-types
  transformation: Prisma.TransformationGetPayload<{}>,
  borderWidth: number,
  doTranslation: boolean,
  columns?: number
) {
  if (transformation.reflection) {
    shape = Array2D.flip(shape, Array2D.AXES.X)
  }

  for (let i = 0; i < transformation.rotation; i++) {
    shape = Array2D.rotate(shape, Array2D.DIRECTIONS.RIGHT)
  }

  if (doTranslation && (transformation.translationUp != null || transformation.translationRight != null)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const translationColumns = columns ?? shape[0]!.length

    if (translationColumns > 5) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shape = Array2D.pad(shape, Array2D.EDGES.RIGHT, translationColumns - shape[0]!.length, 0)
    }

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
