import React, { useState } from 'react'
import GridSquare from './GridSquare'

export default function GridBoard(props : {
    board_color : string;
    piece : any;
    square_size: number;
    square_click_handler?: any;
}) {

  const grid = []
  for (let row = 0; row < props.piece.shape.length; row++) {
    grid.push([])
    for (let col = 0; col < props.piece.shape[row].length; col++) {
      grid[row].push (
        <GridSquare
          key={`${col}${row}`}
          row={row} col={col}
          color={`${props.piece.shape[row][col] ? props.piece.color : props.board_color}`}
          square_click_handler={props.square_click_handler}
          />
      )
    }
  }

  return (
    <div className="grid-board"
      style={
        {
          '--cols': props.piece.shape[0].length,
          '--tile-size': props.square_size + 'px',
          '--border-width': props.square_size / 20 + 'px'
        }
      }>
      {grid}
    </div>
  )
}
