import React, { useState, useEffect } from 'react'
import Square from "./Square";
import { BsSlashLg } from 'react-icons/bs';
import { transformBlockShape } from "../../utils/transformations";

// One of the pieces in a game

interface BlockProps {
  block: any;
  size?: number;
  hideVisibility?: boolean;
}

export default function PiecePage(props: BlockProps) {

  const [squares, setSquares] = useState<Array<JSX.Element>>([])

  useEffect(() => {
    if (!props.block?.piece.shape) { return }

    let shape = props.block?.piece.shape as Array<number[]>
    
    shape = transformBlockShape(props.block, 0, false, 5)
    
    const squares = []
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < (shape[row] || []).length; col++) { 
        const key = `${row}-${col}`
        const color = shape?.[row]?.[col] == 1 ? props.block.piece.color.name : 'lightGrey'
        squares.push(<Square key={key} color={color} size={props.size || 20}></Square>)
      } 
    }
    setSquares(squares)

  }, [props.block, props.size])


  const outerClasses = ["grid", "items-center","justify-center"]
  if (!props.block?.visible) {
    outerClasses.push("opacity-50")
  }
  const innerClasses = ["grid", "gap-0", "grid-cols-5"]

  return (
    <>
      <div>
        {!props.hideVisibility &&
          <div className="absolute">
            {!props.block?.visible &&
              <BsSlashLg size={100} style={{ color: "#00000099" }} />
            }
          </div>
        }
        <div className={outerClasses.join(' ')}>
          <div className={innerClasses.join(' ')}>
            {squares}
          </div>
        </div>
      </div>
    </>
  );
}