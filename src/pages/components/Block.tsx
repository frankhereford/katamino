import React, { useEffect, useState } from 'react'
import Array2D from 'array2d'
import GridSquare from './GridSquare'

export default function Block(props : {
    board_color : string;
    block: any;
    square_size: number;
    square_click_handler?: any;
    onClick?: any;
    opacity?: number;
}) {

  const [board, set_board] = useState(Array2D.build(5,5,0))

  useEffect(() => {
    let shape = props.block.piece.shape

    // order of transformations matters
    if (props.block.reflection) {
      shape = Array2D.flip(shape, Array2D.AXES.X);
    }
    for (let i = 0; i < props.block.rotation.clockwise; i++) {
      shape = Array2D.rotate(shape, Array2D.DIRECTIONS.RIGHT)
    }



    //shape = Array2D.slide(shape, Array2D.DIRECTIONS.UP, 1);

    set_board(shape)
  }, [props.block]);

  const grid = []
  for (let row = 0; row < board.length; row++) {
    grid.push([])
    for (let col = 0; col < board[row].length; col++) {
      grid[row].push (
        <GridSquare
          key={`${col}${row}`}
          row={row} col={col}
          color={`${board[row][col] ? props.block.piece.color.name : props.board_color}`}
          square_click_handler={props.square_click_handler}
          />
      )
    }
  }

  return (
    //<div style={{ opacity: props.opacity ? props.opacity : 1 } className="grid-board"
    <div className="grid-board"
      onClick={props.onClick}
      style={
        {
          '--cols': props.block.piece.shape[0].length,
          '--tile-size': props.square_size + 'px',
          '--border-width': props.square_size / 20 + 'px',
          'opacity': props.block.piece.opacity ? props.piece.opacity : 1
        }
      }>
      {grid}
    </div>
  )
}
