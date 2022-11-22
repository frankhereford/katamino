import React, { useState, useEffect } from 'react'
import { type Prisma } from '@prisma/client'
import Square from './Square'
import { transformBlockShape } from '../../utils/transformations'
import { colord, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')
extend([mixPlugin])

// this is a way to get at complex types out of the prisma db library
interface PentaProps {
  penta: Prisma.PentaGetPayload<{
    include: {
      blocks: {
        include: {
          piece: {
            include: {
              color: true
            }
          }
          transformation: true
        }
      }
    }
  }>
}

export default function Penta (props: PentaProps) {
  // state to hold the actual components we'll render
  const [grid, setGrid] = useState<JSX.Element[]>([])

  useEffect(() => {
    const boardHeight = 5
    const boardColor = 'lightGrey'

    // we'll build up the grid in this array
    const squares = []
    // blank board
    const board = Array2D.build((props.penta.columns ?? 12) + (props.penta.borderWidth * 2), boardHeight + (props.penta.borderWidth * 2), boardColor)

    // recolor the border
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (row < props.penta?.borderWidth || row >= (board.length - props.penta?.borderWidth) || col < props.penta?.borderWidth || col >= (board[row].length - props.penta?.borderWidth)) {
          board[row][col] = '#bbbbbb' // this should be a color in the database
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedBlocks = props.penta.blocks.sort((a: any, b: any) => a.lastUpdate - b.lastUpdate)
    sortedBlocks.forEach((block) => {
      if (!block.transformation.visible) { return }
      if (
        block.piece.shape != null &&
        typeof block.piece.shape === 'object' &&
        Array.isArray(block.piece.shape)
      ) {
        let shape = block.piece.shape as number[][]
        shape = transformBlockShape(shape, block.transformation, props.penta.borderWidth)

        for (let row = 0; row < shape.length; row++) {
          // these exceptions to the typing are the pain from storing JSON
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          for (let column = 0; column < shape[row]!.length; column++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (shape[row]![column] === 1) {
              const pieceColor = block.piece.color.hexCode
              const squareColor = board[row][column]
              if (squareColor[0] !== '#') {
                board[row][column] = pieceColor
              } else {
                const mixedColor = colord(squareColor).mix(colord(pieceColor), 0.5).darken(0.05).toHex()
                board[row][column] = mixedColor
              }
            }
          }
        }
      }
    })
    // render `board` into the `grid` array
    for (let row = 0; row < board.length; row++) {
      for (let column = 0; column < board[row].length; column++) {
        squares.push(<Square key={`${row}-${column}`} color={board[row][column]} />)
      }
    }
    setGrid(squares)
  }, [props.penta])

  const classes = ['grid', 'w-fit']
  const boardColumns = props.penta.columns + (props.penta.borderWidth * 2)
  if (boardColumns === 0) { classes.push('grid-cols-none') }
  if (boardColumns === 1) { classes.push('grid-cols-1') }
  if (boardColumns === 2) { classes.push('grid-cols-2') }
  if (boardColumns === 3) { classes.push('grid-cols-3') }
  if (boardColumns === 4) { classes.push('grid-cols-4') }
  if (boardColumns === 5) { classes.push('grid-cols-5') }
  if (boardColumns === 6) { classes.push('grid-cols-6') }
  if (boardColumns === 7) { classes.push('grid-cols-7') }
  if (boardColumns === 8) { classes.push('grid-cols-8') }
  if (boardColumns === 9) { classes.push('grid-cols-9') }
  if (boardColumns === 10) { classes.push('grid-cols-10') }
  if (boardColumns === 11) { classes.push('grid-cols-11') }
  if (boardColumns === 12) { classes.push('grid-cols-12') }
  if (boardColumns === 13) { classes.push('grid-cols-13') }
  if (boardColumns === 14) { classes.push('grid-cols-14') }
  if (boardColumns === 15) { classes.push('grid-cols-15') }
  if (boardColumns === 16) { classes.push('grid-cols-16') }

  return (
    <>
      <div className={classes.join(' ')}>
        {grid}
      </div>
    </>
  )
}
