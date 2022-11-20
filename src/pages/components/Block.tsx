import React, { useState, useEffect } from 'react'
import { type Prisma } from '@prisma/client'
import Square from './Square'

interface BlockProps {
  size?: number
  block: Prisma.BlockGetPayload<{
    include: {
      piece: {
        include: {
          color: true
        }
      }
    }
  }> | Prisma.AvailableBlockGetPayload<{
    include: {
      piece: {
        include: {
          color: true
        }
      }
    }
  }>
}

export default function Block (props: BlockProps) {
  const [grid, setGrid] = useState<JSX.Element[]>([])

  useEffect(() => {
    if (props.block.piece === null) { return }

    // special typing checks for a JSON field, as it could contain anything
    if (
      props.block.piece.shape != null &&
      typeof props.block.piece.shape === 'object' &&
      Array.isArray(props.block.piece.shape)
    ) {
      const shape = props.block.piece.shape as number[][]

      // map down two layers (array of arrays) to compose the square component
      // invocation, and then flatten it all out to dump into the page
      setGrid(shape.map((row, rowIndex) => {
        return row.map((square, squareIndex) => {
          const key = `${rowIndex}-${squareIndex}`
          const color = shape?.[rowIndex]?.[squareIndex] === 1 ? props.block.piece.color.name : 'lightGrey'
          return (<Square size={props.size ?? 10} key={key} color={color}></Square>)
        })
      }).flat(1))
    }
  }, [props.block, props.size])

  return (
    <>
      <div className="m-1 grid grid-cols-5 pb-[1px] pr-[1px] outline outline-1 outline-slate-500">
        {grid}
      </div>
    </>
  )
}
