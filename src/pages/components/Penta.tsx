import React, { useState, useEffect } from 'react'
import { trpc } from "../../utils/trpc";
import Square from "./Square";
//import Array2D from 'array2d'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')

// A given puzzle with blocks made out of pieces

interface PentaProps {
  penta: any;
  borderWidth?: number;
}

export default function Penta(props: PentaProps) {

  const [borderWidth, setBorderWidth] = useState(props.borderWidth || 0)
  const boardHeight = 5
  // easier than typing an old library
  const genericBoard = Array2D.build(12 + (borderWidth * 2), boardHeight + (borderWidth * 2))

  const [board, setBoard] = useState(genericBoard);

  useEffect(() => {
    const boardHeight = 5
    const board = Array2D.build((props.penta?.columns || 12) + (borderWidth * 2), boardHeight + (borderWidth * 2))
    setBoard(board)
  }, [borderWidth, props.penta])

  //console.log(board)

  const squares = []
  for (let row = 0; row < board?.length|| 0; row++) {
    for (let col = 0; col < board?.[row].length || 0; col++) {
      const key = `${row}-${col}`
      const color = board?.[row][col] || 'lightGrey'
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