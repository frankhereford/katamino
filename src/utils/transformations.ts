import Array2D from 'array2d'


export function transform_block_shape({ block, do_translation = false}: NamedArguments) {
  let shape = block.piece.shape

  // order of transformations matters
  if (block.reflection) {
    shape = Array2D.flip(shape, Array2D.AXES.X);
  }

  for (let i = 0; i < block.rotation.clockwise; i++) {
    shape = Array2D.rotate(shape, Array2D.DIRECTIONS.RIGHT)
  }

  if (do_translation) {
    if (block.translation.up > 0) {
      for (let i = 0; i < block.translation.up; i++) {
        shape = Array2D.slide(shape, Array2D.DIRECTIONS.UP, 1);
      }
    }
    else if (block.translation.up < 0) {
      for (let i = block.translation.up; i < 0; i++) {
        shape = Array2D.slide(shape, Array2D.DIRECTIONS.DOWN, 1);
      }
    }

    if (block.translation.right > 0) {
      for (let i = 0; i < block.translation.right; i++) {
        shape = Array2D.slide(shape, Array2D.DIRECTIONS.RIGHT, 1);
      }
    }
    else if (block.translation.right < 0) {
      for (let i = block.translation.right; i < 0; i++) {
        shape = Array2D.slide(shape, Array2D.DIRECTIONS.LEFT, 1);
      }
    }
  }

return shape
}
