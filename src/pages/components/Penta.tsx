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
  size?: 12
  noBorder?: boolean
  completed?: () => void
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
  }, [props.noBorder, props.penta, props.size])

  const defaultClasses = ['grid']

  const [classes, setClasses] = useState(defaultClasses)

  useEffect(() => {
    const boardColumns = (props.penta.columns ?? 12) + ((props.noBorder ?? false) ? 0 : props.penta.borderWidth * 2)

    const newClasses = defaultClasses

    // * this silly construction lets the CSS classes be picked up by the framework
    // ! this is annoying now, figure out how to prevent them from being tree-shaken
    if (props.size == null) {
      if (boardColumns === 0) { newClasses.push('grid-cols-[repeat(0,_61px)]') }
      if (boardColumns === 1) { newClasses.push('grid-cols-[repeat(1,_61px)]') }
      if (boardColumns === 2) { newClasses.push('grid-cols-[repeat(2,_61px)]') }
      if (boardColumns === 3) { newClasses.push('grid-cols-[repeat(3,_61px)]') }
      if (boardColumns === 4) { newClasses.push('grid-cols-[repeat(4,_61px)]') }
      if (boardColumns === 5) { newClasses.push('grid-cols-[repeat(5,_61px)]') }
      if (boardColumns === 6) { newClasses.push('grid-cols-[repeat(6,_61px)]') }
      if (boardColumns === 7) { newClasses.push('grid-cols-[repeat(7,_61px)]') }
      if (boardColumns === 8) { newClasses.push('grid-cols-[repeat(8,_61px)]') }
      if (boardColumns === 9) { newClasses.push('grid-cols-[repeat(9,_61px)]') }
      if (boardColumns === 10) { newClasses.push('grid-cols-[repeat(10,_61px)]') }
      if (boardColumns === 11) { newClasses.push('grid-cols-[repeat(11,_61px)]') }
      if (boardColumns === 12) { newClasses.push('grid-cols-[repeat(12,_61px)]') }
      if (boardColumns === 13) { newClasses.push('grid-cols-[repeat(13,_61px)]') }
      if (boardColumns === 14) { newClasses.push('grid-cols-[repeat(14,_61px)]') }
      if (boardColumns === 15) { newClasses.push('grid-cols-[repeat(15,_61px)]') }
      if (boardColumns === 16) { newClasses.push('grid-cols-[repeat(16,_61px)]') }
    }
    if (props.size === 12) {
      if (boardColumns === 0) { newClasses.push('grid-cols-[repeat(0,_13px)]') }
      if (boardColumns === 1) { newClasses.push('grid-cols-[repeat(1,_13px)]') }
      if (boardColumns === 2) { newClasses.push('grid-cols-[repeat(2,_13px)]') }
      if (boardColumns === 3) { newClasses.push('grid-cols-[repeat(3,_13px)]') }
      if (boardColumns === 4) { newClasses.push('grid-cols-[repeat(4,_13px)]') }
      if (boardColumns === 5) { newClasses.push('grid-cols-[repeat(5,_13px)]') }
      if (boardColumns === 6) { newClasses.push('grid-cols-[repeat(6,_13px)]') }
      if (boardColumns === 7) { newClasses.push('grid-cols-[repeat(7,_13px)]') }
      if (boardColumns === 8) { newClasses.push('grid-cols-[repeat(8,_13px)]') }
      if (boardColumns === 9) { newClasses.push('grid-cols-[repeat(9,_13px)]') }
      if (boardColumns === 10) { newClasses.push('grid-cols-[repeat(10,_13px)]') }
      if (boardColumns === 11) { newClasses.push('grid-cols-[repeat(11,_13px)]') }
      if (boardColumns === 12) { newClasses.push('grid-cols-[repeat(12,_13px)]') }
      if (boardColumns === 13) { newClasses.push('grid-cols-[repeat(13,_13px)]') }
      if (boardColumns === 14) { newClasses.push('grid-cols-[repeat(14,_13px)]') }
      if (boardColumns === 15) { newClasses.push('grid-cols-[repeat(15,_13px)]') }
      if (boardColumns === 16) { newClasses.push('grid-cols-[repeat(16,_13px)]') }
    }

    /*
    if (boardColumns === 0) { newClasses.push('grid-cols-none') }
    if (boardColumns === 1) { newClasses.push('grid-cols-1') }
    if (boardColumns === 2) { newClasses.push('grid-cols-2') }
    if (boardColumns === 3) { newClasses.push('grid-cols-3') }
    if (boardColumns === 4) { newClasses.push('grid-cols-4') }
    if (boardColumns === 5) { newClasses.push('grid-cols-5') }
    if (boardColumns === 6) { newClasses.push('grid-cols-6') }
    if (boardColumns === 7) { newClasses.push('grid-cols-7') }
    if (boardColumns === 8) { newClasses.push('grid-cols-8') }
    if (boardColumns === 9) { newClasses.push('grid-cols-9') }
    if (boardColumns === 10) { newClasses.push('grid-cols-10') }
    if (boardColumns === 11) { newClasses.push('grid-cols-11') }
    if (boardColumns === 12) { newClasses.push('grid-cols-12') }
    if (boardColumns === 13) { newClasses.push('grid-cols-13') }
    if (boardColumns === 14) { newClasses.push('grid-cols-14') }
    if (boardColumns === 15) { newClasses.push('grid-cols-15') }
    if (boardColumns === 16) { newClasses.push('grid-cols-16') }
    */
    setClasses(newClasses)
  }, [props.noBorder, props.penta])

  return (
    <>
      <div className='w-fit m-auto'>
        <div className={classes.join(' ')}>
          {grid}
        </div>
      </div>
    </>
  )
}
