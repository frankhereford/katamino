import React, { useState, useEffect } from 'react'
import { trpc } from "../../utils/trpc";
import Square from "./Square";
//import Array2D from 'array2d'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')

// A given puzzle with blocks made out of pieces

interface PentaProps {
  id?: string;
}

export default function Penta(props: PentaProps) {

  const { data: penta, refetch: penta_refetch } = trpc.penta.get.useQuery({
    id: String(props.id)
  }, {
    enabled: !!props.id 
  },);

  const border_width = 0
  const boardHeight = 5
  // easier than typing an old library
  const genericBoard = Array2D.build(12 + (border_width * 2), boardHeight + (border_width * 2))

  const [board, setBoard] = useState(genericBoard);

  useEffect(() => {
    const border_width = 0
    const boardHeight = 5
    const board = Array2D.build(penta?.columns || 12 + (border_width * 2), boardHeight + (border_width * 2))
    setBoard(board)
  }, [penta])



  //console.log(board)

  const squares = []
  for (let row = 0; row < board?.length|| 0; row++) {
    for (let col = 0; col < board?.length || 0; col++) {
      const key = `${row}-${col}`
      const color = board?.[row][col] || 'lightGrey'
      squares.push(<Square key={key} color={color} row={row} col={col}></Square>)
    }
  }

  //console.log(squares)

  const [width, setWidth] = useState(0)

  useEffect(() => {
    const columns = penta?.columns || 12;
    const width = columns * 40 + ((columns - 1) * 2)
    setWidth(width)
  }, [penta])


  if (!penta) { return <div></div> }

  const columns = penta?.columns || 12;
  const classes = ["grid", "grid-cols-" + columns, "gap-0", "m-2"]

  return (
    <>
      <div className={classes.join(' ')} style={{ width: width + "px" }}>
        {squares}
      </div>
    </>
  );
}