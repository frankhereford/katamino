import React, { useState } from 'react'
import GridSquare from './GridSquare'


// Represents a 10 x 18 grid of grid squares

export default function GridBoard(props : {
    board_color : string;
    piece : any;
    size : number;
}) {


  //const [shape, setShape] = useState([
    //piece.shape
  //]);

  const grid = []
  for (let row = 0; row < props.piece.shape.length; row++) {
    grid.push([])
    for (let col = 0; col < props.piece.shape[row].length; col++) {
      grid[row].push (
        <GridSquare
          key={`${col}${row}`}
          row={row} col={col}
          color={`${props.piece.shape[row][col] ? props.piece.color : props.board_color}`} />
      )
    }
  }

  return (
    <div className="grid-board"
      style={
        {
          '--cols': props.piece.shape[0].length,
          '--tile-size': props.size + 'px',
          '--border-width': props.size / 20 + 'px'
        }
      }>
    {grid} </div>
  )
}
