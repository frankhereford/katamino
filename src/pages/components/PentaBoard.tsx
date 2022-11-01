import React, { useState, useEffect } from 'react'
import GridSquare from './GridSquare'
import { transform_block_shape } from "../../utils/transformations";
import { colors, toCamelCase, mix_colors } from "../../utils/colors";
import Array2D from 'array2d'
import _ from "lodash";

export default function PentaBoard(props : {
    penta: any;
    active_block: number;
    board_color : string;
    square_size: number;
    columns: number;
}) {
  
  const [board, set_board] = useState([]);
  
  useEffect(() => {
    if (!props.penta) { return}
    const current_board = Array2D.build(props.penta.columns, 5, props.board_color)
    const blocks = _.cloneDeep(props.penta.blocks);
    const sorted_blocks = blocks.sort((a: any, b: any) => a.last_update - b.last_update)
    sorted_blocks.forEach((block: any) => {
      if (!block.visible) { return }
      const shape = transform_block_shape({ block: block, do_translation: true, columns: props.penta.columns })
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            if (current_board[row][col] === props.board_color) {
              // first piece to apply a color to this square
              current_board[row][col] = colors[toCamelCase(block.piece.color.name)]
            }
            else {
              // need to blend colors for this square
              const mixed_color = mix_colors(current_board[row][col], colors[toCamelCase(block.piece.color.name)])
              current_board[row][col] = mixed_color
            }
          }
        }
      }
    })
    set_board(current_board)
    }, [props.penta]);
  
  const grid = []
  for (let row = 0; row < 5; row++) {
    grid.push([])
    for (let col = 0; col < props.columns; col++) {
      grid[row].push (
        <GridSquare
          key={`${col}${row}`}
          row={row} col={col}
          color={board[1] ? board[row][col] : props.board_color}
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
