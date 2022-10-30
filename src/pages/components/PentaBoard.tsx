import React, { useState } from 'react'
import GridSquare from './GridSquare'
import { transform_block_shape } from "../../utils/transformations";
import { get_block_index } from "../../utils/block_list";
import Penta from '../penta/[id]';


function check_block_coordinate(block: [object], penta: any, row: number, column: number) {
  if (!block) { return false; }
  const shape = transform_block_shape({ block: block, do_translation: true, columns: penta.columns })
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
      grid[row].push (
        <GridSquare
          key={`${col}${row}`}
          row={row} col={col}
          color={check_block_coordinate(props.penta?.blocks[active_block_index], props.penta, row, col)
            ? props.penta.blocks[active_block_index].piece.color.name
            : props.board_color}
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
