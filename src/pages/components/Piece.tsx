import React, { useState, useEffect } from 'react'
import { trpc } from "../../utils/trpc";
import Square from "./Square";

// One of the pieces in the game

interface PieceProps {
  id?: string;
  size?: number;
}

export default function PiecePage(props: PieceProps) {

  // may not need this randomPiece call..., if i had an ID passed to me and could get the typing figured out
  const { data: randomPiece } = trpc.piece.randomPiece.useQuery(undefined, { enabled: true });
  const { data: propsPiece } = trpc.piece.getPiece.useQuery({ id: props.id }, { enabled: (props.id != null) });

  const [piece, setPiece] = useState<typeof randomPiece | null | undefined>()
  useEffect(() => {
    if (!piece?.id && props.id) {
      setPiece(propsPiece)
    }
    else if (!piece?.id && !props.id) {
      setPiece(randomPiece)
    }
  }, [piece, props.id, propsPiece, randomPiece])
  
  const size = props.size || 10;
  
  const [grid, setGrid] = useState<Array<JSX.Element>>([])
  useEffect(() => {
    if (!piece?.shape) { return }
    
    const grid = []
    const shape = piece?.shape as Array<number[]>
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < (shape[row] || []).length; col++) { 
        const key = `${row}-${col}`
        const color = shape?.[row]?.[col] == 1 ? piece.color.name : 'lightGrey'
        grid.push(<Square size={size} key={key} color={color}></Square>)
      } 
    }
    setGrid(grid)

  }, [piece])

  return (
    <div className="grid grid-cols-5 gap-0 m-2">
      {grid}
    </div>
  );
}