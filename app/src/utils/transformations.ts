import { type Prisma } from '@prisma/client'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')

function shapeInFirstColumn (shape: number[][]): boolean {
  for (let row = 0; row < shape.length; row++) {
    if (shape[row]?.[0] === 1) { return true }
  }
  return false
}

export function transformBlockShape (
  shape: number[][],
  transformation: Prisma.TransformationGetPayload<object>,
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

    // * An edge case (🥁) exists where the shape is larger than the board
    // * requires that the shape be trimmed down to the board's size.
    // *
    // * The technique is to slide the piece to the left until it has
    // * at least one square in the left most column, ensuring that
    // * it's not occupying the rightmost columns. Then, the number
    // * of columns on the right are chopped off. Finally, the piece
    // * is slid back to the right same number of times that it was
    // * slide to the left. By doing getting the board size right, the
    // * wrap-around behavior of the piece moving is preserved.

    let slides = 0
    while (!shapeInFirstColumn(shape)) {
      shape = Array2D.slide(shape, Array2D.DIRECTIONS.LEFT, 1)
      slides++
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const shapeWidth = shape[0]!.length
    const boardWidth = (columns ?? 5) + (borderWidth * 2)

    for (let i = 0; i < shapeWidth - boardWidth; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      shape = Array2D.deleteColumn(shape, shape[0]!.length - 1)
    }

    for (let slide = 0; slide < slides; slide++) {
      shape = Array2D.slide(shape, Array2D.DIRECTIONS.RIGHT, 1)
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
