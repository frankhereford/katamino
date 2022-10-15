import React, { useState } from 'react'
import { trpc } from "../../utils/trpc";
import GridSquare from './GridSquare'

export default function GridBoard(props : {
    board_color : string;
    square_size: number;
}) {


  const grid = []
  for (let row = 0; row < 5; row++) {
    grid.push([])
    for (let col = 0; col < 5; col++) {
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
          '--cols': 5,
          '--tile-size': props.square_size + 'px',
          '--border-width': props.square_size / 20 + 'px'
        }
      }>
      {grid}
    </div>
  )
}
