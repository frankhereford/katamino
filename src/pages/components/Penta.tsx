import React, { useState, useEffect } from 'react'
import { trpc } from "../../utils/trpc";
import Square from "./Square";
//import Array2D from 'array2d'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')
import _ from "lodash";

import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
extend([mixPlugin]);

// A given puzzle with blocks made out of pieces

interface PentaProps {
  penta: any;
  borderWidth?: number;
}

function transformBlockShape(block: any) {
  console.log(block)
  const shape = block.piece.shape
  return shape
  //const array2d = new Array2D(shape)
  //const rotated = array2d.rotate(90)
  //const flipped = rotated.flip()
  //return flipped.toArray()
}

export default function Penta(props: PentaProps) {

  const { data: colorLookup } = trpc.color.getColorLookup.useQuery();
  const [borderWidth, setBorderWidth] = useState(props.borderWidth || 0)
  const boardHeight = 5
  // easier than typing an old library
  const genericBoard = Array2D.build(12 + (borderWidth * 2), boardHeight + (borderWidth * 2))

  const [board, setBoard] = useState(genericBoard);

  const boardColor = "lightGrey"

  useEffect(() => {
    const boardHeight = 5
    const board = Array2D.build((props.penta?.columns || 12) + (borderWidth * 2), boardHeight + (borderWidth * 2), boardColor)

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (row < borderWidth || row >= (board.length - borderWidth) || col < borderWidth || col >= (board[row].length - borderWidth)) {
          board[row][col] = "#bbbbbb" // this should be a color in the database
        }
      }
    }

    if (!props.penta?.blocks) {
      setBoard(board)
      return
    }

    const blocks = _.cloneDeep(props.penta?.blocks);
    // im letting my lazy typing come in here with this old code
    const sortedBlocks = blocks.sort((a: any, b: any) => a.last_update - b.last_update)
    //console.log(sortedBlocks)
    sortedBlocks.forEach((block: any) => {
      if (block.visible) { // flip this back when you have the key bindings in
        return
      }
      const shape = transformBlockShape(block)
      //console.log("Transformed Shape: ", shape)
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < (shape[row] || []).length; col++) {
          if (shape?.[row]?.[col]) {
            if (board[row][col] === boardColor) { // first piece to apply a color to this square
              board[row][col] = block.piece.color.name
            } else {
              let squareColor = board[row][col]
              if (board[row][col][0] !== "#") {
                squareColor = colorLookup?.[board[row][col]]?.hexCode || '#ffffff'
              }
              const pieceColor = colorLookup?.[block.piece.color.name]?.hexCode || '#ffffff'
              const mixedColor = colord(squareColor).mix(colord(pieceColor), .5).darken(.05).toHex()
              board[row][col] = mixedColor
            }
          }
        }
      }
    })

    setBoard(board)
  }, [borderWidth, props.penta])

  //console.log(board)

  const squares = []
  for (let row = 0; row < board?.length|| 0; row++) {
    for (let col = 0; col < board?.[row].length || 0; col++) {
      const key = `${row}-${col}`
      const color = board?.[row][col]
      squares.push(<Square key={key} color={color}></Square>)
    }
  }

  //console.log(squares)

  if (!props.penta) { return <div></div> }

  const classes = ["grid", "gap-0"]

  let columns = props.penta?.columns + (borderWidth * 2) || 12;
  if (columns > 12 || columns < 0) { columns = 5; }
  if (columns == 0) { classes.push("grid-cols-none") }
  if (columns == 1) { classes.push("grid-cols-1") }
  if (columns == 2) { classes.push("grid-cols-2") }
  if (columns == 3) { classes.push("grid-cols-3") }
  if (columns == 4) { classes.push("grid-cols-4") }
  if (columns == 5) { classes.push("grid-cols-5") }
  if (columns == 6) { classes.push("grid-cols-6") }
  if (columns == 7) { classes.push("grid-cols-7") }
  if (columns == 8) { classes.push("grid-cols-8") }
  if (columns == 9) { classes.push("grid-cols-9") }
  if (columns == 10) { classes.push("grid-cols-10") }
  if (columns == 11) { classes.push("grid-cols-11") }
  if (columns == 12) { classes.push("grid-cols-12") }
  if (columns > 12 ) { classes.push("grid-cols-[" + String(columns) + "]") }

  return (
    <>
      <div className="grid items-center justify-center">
        <div className={classes.join(' ')} >
          {squares}
        </div>
      </div>
    </>
  );
}