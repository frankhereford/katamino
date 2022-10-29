import Array2D from 'array2d'




export function transform_piece_shape(block: any) {
  let shape = block.piece.shape

  // order of transformations matters
  if (block.reflection) {
    shape = Array2D.flip(shape, Array2D.AXES.X);
  }
  for (let i = 0; i < block.rotation.clockwise; i++) {
    shape = Array2D.rotate(shape, Array2D.DIRECTIONS.RIGHT)
  }

  return shape
}

//shape = Array2D.slide(shape, Array2D.DIRECTIONS.UP, 1);