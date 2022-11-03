import React, {useState, useEffect} from 'react'
import GridSquare from './GridSquare'
import {transform_block_shape} from "../../utils/transformations";
import {colors, toCamelCase, mix_colors} from "../../utils/colors";
import Array2D from 'array2d'
import _ from "lodash";

export default function EmptyBoard(props : {
  board_color : string;
  border_color: string;
  square_size : number;
  columns : number;
}) {

  const [board, set_board] = useState([]);
  const [border_width, set_boarder_width] = useState(0);

  useEffect(() => {
    const current_board = Array2D.build(props.columns + (border_width * 2), 5 + (border_width * 2), props.board_color)
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (row < border_width || row >= (current_board.length - border_width) || col < border_width || col >= (current_board[row].length - border_width)) {
          const mixed_color = mix_colors(current_board[row][col], "#aaaaaa")
          current_board[row][col] = mixed_color
        }
      }
    }

    set_board(current_board)
  }, []);

  const grid = []
  for (let row = 0; row < board.length; row++) {
    grid.push([])
    for (let col = 0; col < props.columns + 0; col++) {
    //for (let col = 0; col < board[row].length; col++) {
      grid[row].push (
        <GridSquare key={
            `${col}${row}`
          }
          row={row}
          col={col}
          color={
            props.board_color
          }/>
      )
    }
  }

  //console.log(grid)

  return (
    <>
    <div className="grid-board"
      style={
        {
          '--cols': props.columns + (border_width * 2),
          '--tile-size': props.square_size + 'px',
          '--border-width': props.square_size / 20 + 'px'
        }
    }>
      {grid} </div>
    </>
  )
}
