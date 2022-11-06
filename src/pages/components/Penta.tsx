import React, { useState, useEffect } from 'react'
import { trpc } from "../../utils/trpc";
import Square from "./Square";
import Array2D from 'array2d'

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

  if (!penta) { return <div></div> }

  //console.log(board)

  const squares = []
  for (let row = 0; row < board?.length|| 0; row++) {
    for (let col = 0; col < board?.length || 0; col++) {
      const key = `${row}-${col}`
      const color = board?.[row][col] || 'lightGrey'
      squares.push(<Square key={key} color={color}></Square>)
    }
  }

  console.log(squares)

  const columns = penta?.columns || 12;
  const classes = ["grid", "grid-cols-" + columns, "gap-0", "m-2"]

  return (
    <div className={classes.join(' ')}>
      {squares}
    </div>
  );
}