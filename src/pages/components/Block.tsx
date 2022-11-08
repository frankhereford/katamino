import React, { useState, useEffect } from 'react'
import Square from "./Square";

// One of the pieces in a game

interface BlockProps {
  block: any;
}

export default function PiecePage(props: BlockProps) {

    const [squares, setSquares] = useState<Array<JSX.Element>>([])

  useEffect(() => {
    if (!props.block?.piece.shape) { return }
    
    const squares = []
    const shape = props.block?.piece.shape as Array<number[]>
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < (shape[row] || []).length; col++) { 
        const key = `${row}-${col}`
        const color = shape?.[row]?.[col] == 1 ? props.block.piece.color.name : 'lightGrey'
        squares.push(<Square key={key} color={color} size={20}></Square>)
      } 
    }
    setSquares(squares)

  }, [props.block])

  const classes = ["grid", "gap-0", "grid-cols-5"]

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