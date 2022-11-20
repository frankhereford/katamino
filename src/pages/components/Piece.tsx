import React, { useState, useEffect } from 'react'
import { trpc } from '../../utils/trpc'
import Square from './Square'
import { type Prisma } from '@prisma/client'

interface PieceProps {
  id?: string
  size?: number
}

export default function PiecePage (props: PieceProps) {
  // query the data we may need
  const { data: randomPiece } = trpc.piece.randomPiece.useQuery(undefined, { enabled: true })
  const { data: propsPiece } = trpc.piece.getPiece.useQuery({ id: props.id }, { enabled: (props.id != null) })

  // the grid is a list of <Square> components
  const [grid, setGrid] = useState<JSX.Element[]>([])

  // the record of the piece we're displaying
  const [piece, setPiece] = useState<Prisma.PieceGetPayload<{
    include: {
      color: true
    }
  }>>()

  // monitor the inputs of the component and set the piece accordingly
  useEffect(() => {
    if ((props.id != null) && propsPiece != null) {
      setPiece(propsPiece)
    } else if (randomPiece != null) {
      setPiece(randomPiece)
    }
  }, [props, randomPiece, propsPiece])

  // given a piece, set the grid to display it
  useEffect(() => {
    if (piece === null) { return }

    // special typing checks for a JSON field, as it could contain anything
    if (
      piece?.shape != null &&
      typeof piece?.shape === 'object' &&
      Array.isArray(piece?.shape)
    ) {
      const shape = piece.shape as number[][]

      // map down two layers (array of arrays) to compose the square component
      // invocation, and then flatten it all out to dump into the page
      setGrid(shape.map((row, rowIndex) => {
        return row.map((square, squareIndex) => {
          const key = `${rowIndex}-${squareIndex}`
          const color = shape?.[rowIndex]?.[squareIndex] === 1 ? piece.color.name : 'lightGrey'
          return (<Square size={props.size ?? 10} key={key} color={color}></Square>)
        })
      }).flat(1))
    }
  }, [piece, props.size])

  // const size = props.size ?? 10
  // const color = 'red'
  // const key = '0-0'

  return (
    <div className="grid grid-cols-5 gap-0 m-2">
      {grid}
    </div>
  )
}
