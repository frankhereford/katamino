import React, { useState } from 'react'
import { trpc } from "../../utils/trpc";
import GridSquare from './GridSquare'
import { transform_piece_shape } from "../../utils/transformations";


function check_block_coordinate(block: [object], row: number, column: number) {
  console.log(block)

  const shape = transform_piece_shape(block)

  console.log(shape)
}

export default function PentaBoard(props : {
    penta: any;
    board_color : string;
    square_size: number;
    columns: number;
}) {
  


  const grid = []
  for (let row = 0; row < 5; row++) {
    grid.push([])
    for (let col = 0; col < props.columns; col++) {
      console.log("Row: " + row + " Col: " + col)
      const occupied = check_block_coordinate(props.penta.blocks[0], row, col)
      grid[row].push (
        <GridSquare
          key={`${col}${row}`}
          row={row} col={col}
          color={props.board_color}
          />
      )
    }
  }

  return (
    <div className="grid-board"
      style={
        {
          '--cols': props.columns,
          '--tile-size': props.square_size + 'px',
          '--border-width': props.square_size / 20 + 'px'
        }
      }>
      {grid}
    </div>
  )
}
