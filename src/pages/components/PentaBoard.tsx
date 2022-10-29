import React, { useState } from 'react'
import { trpc } from "../../utils/trpc";
import GridSquare from './GridSquare'
import { transform_piece_shape } from "../../utils/transformations";
import { get_block_index } from "../../utils/block_list";


function check_block_coordinate(block: [object], row: number, column: number) {
  const shape = transform_piece_shape(block)
  return shape[row][column] ? true : false
}

export default function PentaBoard(props : {
    penta: any;
    active_block: number;
    board_color : string;
    square_size: number;
    columns: number;
}) {
  
  const grid = []
  for (let row = 0; row < 5; row++) {
    grid.push([])
    for (let col = 0; col < props.columns; col++) {
      const active_block_index = props.active_block ? get_block_index(props.penta.blocks, props.active_block) : 0
      //console.log("Row: " + row + " Col: " + col + " Occupied: " + occupied + " Active: " + props.active_block + " Draw: " + draw_block)
      grid[row].push (
        <GridSquare
          key={`${col}${row}`}
          row={row} col={col}
          color={check_block_coordinate(props.penta.blocks[active_block_index], row, col) ? props.penta.blocks[active_block_index].piece.color.name : props.board_color}
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
