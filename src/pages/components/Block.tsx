import React, { useEffect, useState } from 'react'
import GridSquare from './GridSquare'


export default function Block(props : {
    board_color : string;
    block: any;
    square_size: number;
    square_click_handler?: any;
    onClick?: any;
    opacity?: number;
}) {

  const [board, set_board] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ])
    
  useEffect(() => {
    const shape = props.block.piece.shape
    // apply transformations
    set_board(shape)
  }, [props.block, ]);

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
