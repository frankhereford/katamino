import Fire from './Fire'
import React, { useState, useEffect } from 'react'
import { type Prisma } from '@prisma/client'
import Square from './Square'
import { transformBlockShape } from '../../utils/transformations'
import { colord, extend } from 'colord'
import mixPlugin from 'colord/plugins/mix'
import _ from 'lodash'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')
extend([mixPlugin])

// * this is a way to get at complex types out of the prisma db library
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
  size?: 12 | 35
  noBorder?: boolean
  completed?: () => void
  fire?: boolean
}

export default function Penta (props: PentaProps) {
  // * state to hold the actual components we'll render
  const [grid, setGrid] = useState<JSX.Element[]>([])

  useEffect(() => {
    const boardHeight = 5
    const boardColor = 'lightGrey'

    // * we'll build up the grid in this array
    const squares = []
    // * blank board
    let board = Array2D.build((props.penta.columns ?? 12) + (props.penta.borderWidth * 2), boardHeight + (props.penta.borderWidth * 2), boardColor)

    // * recolor the border
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (row < props.penta?.borderWidth ||
          row >= (board.length - props.penta?.borderWidth) ||
          col < props.penta?.borderWidth ||
          col >= (board[row].length - props.penta?.borderWidth)) {
          board[row][col] = '#bbbbbb' // this should be a color in the database
        }
      }
    }

    const blocks = _.cloneDeep(props.penta.blocks)
    // TODO: these should be Block typed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortedBlocks = blocks.sort((a: any, b: any) => a.lastUpdate - b.lastUpdate)
    sortedBlocks.forEach((block) => {
      if (!block.transformation.visible) { return }
      if (
        block.piece.shape != null &&
        typeof block.piece.shape === 'object' &&
        Array.isArray(block.piece.shape)
      ) {
        let shape = block.piece.shape as number[][]

        shape = transformBlockShape(shape,
          block.transformation,
          props.penta.borderWidth,
          true, // doTranslation
          props.penta.columns)

        for (let row = 0; row < shape.length; row++) {
          // * these exceptions to the typing are the pain from storing JSON
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

    const croppedBoard = Array2D.crop(
      board,
      props.penta.borderWidth,
      props.penta.borderWidth,
      board[0].length - (props.penta.borderWidth * 2),
      board.length - (props.penta.borderWidth * 2)
    )

    let complete = true
    for (let rows = 0; rows < croppedBoard.length; rows++) {
      for (let columns = 0; columns < croppedBoard[rows].length; columns++) {
        if (croppedBoard[rows][columns][0] !== '#') {
          complete = false
        }
      }
    }
    if (complete) {
      // ! This will cause your linter to want to put props in the dependency array 💀
      props.completed?.()
    }

    if (props.noBorder ?? false) {
      board = croppedBoard
    }

    // * render `board` into the `grid` array
    for (let row = 0; row < board.length; row++) {
      for (let column = 0; column < board[row].length; column++) {
        squares.push(<Square key={`${row}-${column}`} color={board[row][column]} size={props.size ?? 50} />)
      }
    }
    setGrid(squares)
  // ! don't put props in the dependency array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.noBorder, props.penta, props.size])

  // * this is quickly overwritten in the following useEffect
  const [classes, setClasses] = useState(['grid'])
  useEffect(() => {
    const boardColumns = (props.penta.columns ?? 12) + ((props.noBorder ?? false) ? 0 : props.penta.borderWidth * 2)

    let width = 61
    if (props.size === 12) width = 13
    if (props.size === 35) width = 36

    const newClasses = ['grid']
    const widthClass = `grid-cols-[repeat(${boardColumns},_${width}px)]`
    newClasses.push(widthClass)
    setClasses(newClasses)
  }, [props.noBorder, props.penta, props.size])

  return (
    <>
      <div className='w-fit m-auto'>
        {(props.fire ?? false) && <Fire visible={props.penta.completed}></Fire>}
        <div className={classes.join(' ')}>
          {grid}
        </div>
      </div>
    </>
  )
}
