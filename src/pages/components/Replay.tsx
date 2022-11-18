import React, { useState, useEffect, useMemo } from 'react'
import { trpc } from "../../utils/trpc";
import Square from "./Square";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Array2D = require('array2d')
import _ from "lodash";

import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
extend([mixPlugin]);

import { transformBlockShape } from "../../utils/transformations";

import useWindowSize from 'react-use/lib/useWindowSize'

// A given puzzle with blocks made out of pieces

interface PentaProps {
  penta: any;
  size?: number;
  trimBorder?: boolean;
}

export default function Replay(props: PentaProps) {
  const { data: pentaMoves } = trpc.move.get.useQuery({
    where: {
      pentaId: props.penta?.id,
    }
  })
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { data: colorLookup } = trpc.color.getColorLookup.useQuery();
  const boardHeight = 5
  // easier than typing an old library
  const genericBoard = Array2D.build(12 + (props.penta?.borderWidth * 2), boardHeight + (props.penta?.borderWidth * 2))
  const [board, setBoard] = useState(genericBoard);
  const boardColor = "lightGrey"

  useEffect(() => {
    const boardHeight = 5
    let board = Array2D.build((props.penta?.columns || 12) + (props.penta?.borderWidth * 2), boardHeight + (props.penta?.borderWidth * 2), boardColor)

    if (!props.penta?.blocks) {
      setBoard(board)
      return
    }

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (row < props.penta?.borderWidth || row >= (board.length - props.penta?.borderWidth) || col < props.penta?.borderWidth || col >= (board[row].length - props.penta?.borderWidth)) {
          board[row][col] = "#bbbbbb" // this should be a color in the database
        }
      }
    }

    const blocks = _.cloneDeep(props.penta?.blocks);
    // im letting my lazy typing come in here with this old code
    const sortedBlocks = blocks.sort((a: any, b: any) => a.lastUpdate - b.lastUpdate)
    sortedBlocks.forEach((block: any) => {
      if (!block.visible) { return }
      const shape = transformBlockShape(block, props.penta?.borderWidth, true, props.penta?.columns)
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < (shape[row] || []).length; col++) {
          if (shape?.[row]?.[col] && board?.[row]?.[col]) {
            if (board[row][col] === boardColor) { // first piece to apply a color to this square
              board[row][col] = block.piece.color.name
            } else {
              let squareColor = board[row][col]
              if (board[row][col][0] !== "#") {
                squareColor = colorLookup?.[board[row][col]]?.hexCode || '#ffffff'
              }
              const pieceColor = colorLookup?.[block.piece.color.name]?.hexCode || '#ffffff'
              const mixedColor = colord(squareColor).mix(colord(pieceColor), .5).darken(.05).toHex()
              board[row][col] = mixedColor
            }
          }
        }
      }
    })

    if (props.trimBorder) {
      board = Array2D.crop(
        board,
        props.penta?.borderWidth,
        props.penta?.borderWidth,
        board[0].length - (props.penta?.borderWidth * 2),
        board.length - (props.penta?.borderWidth * 2),
      )
    }

    setBoard(board)
  }, [props.penta?.borderWidth, props.penta, props.trimBorder, colorLookup])

  const [currentMove, setCurrentMove] = useState(0)
  const [replayIndex, setReplayIndex ] = useState(0)

  const eventHandler = (event: any) => {
    if (!pentaMoves) { return }
    if (event.deltaY > 0 && currentMove < pentaMoves.length - 1) {
      setCurrentMove(currentMove + 1)
    }
    else if (event.deltaY < 0 && currentMove > 0) {
      setCurrentMove(currentMove - 1)
    }
    const index = pentaMoves.length - currentMove - 1
    setReplayIndex(index)
    //setBoardState(pentaMoves[index])
  }

  const debouncedWheelHandler = useMemo(
    () => _.throttle(eventHandler, 150)
    , [currentMove, eventHandler]);

  useEffect(() => {
    console.log(replayIndex)
    if (!pentaMoves) { return }
    const move = pentaMoves[replayIndex]
  }, [pentaMoves, replayIndex])

  const squares = []
  for (let row = 0; row < board?.length || 0; row++) {
    for (let col = 0; col < board?.[row].length || 0; col++) {
      const key = `${row}-${col}`
      const color = board?.[row][col]
      squares.push(<Square key={key} color={color} size={props.size}></Square>)
    }
  }

  if (!props.penta) { return <div></div> }

  const classes = ["grid", "gap-0"]

  let columns = props.penta?.columns + (props.penta?.borderWidth * 2) || 12;
  if (props.trimBorder) {
    columns = props.penta?.columns
  }

  if (columns > 16 || columns < 0) { columns = 5; }
  if (columns == 0) { classes.push("grid-cols-none") }
  if (columns == 1) { classes.push("grid-cols-1") }
  if (columns == 2) { classes.push("grid-cols-2") }
  if (columns == 3) { classes.push("grid-cols-3") }
  if (columns == 4) { classes.push("grid-cols-4") }
  if (columns == 5) { classes.push("grid-cols-5") }
  if (columns == 6) { classes.push("grid-cols-6") }
  if (columns == 7) { classes.push("grid-cols-7") }
  if (columns == 8) { classes.push("grid-cols-8") }
  if (columns == 9) { classes.push("grid-cols-9") }
  if (columns == 10) { classes.push("grid-cols-10") }
  if (columns == 11) { classes.push("grid-cols-11") }
  if (columns == 12) { classes.push("grid-cols-12") }
  if (columns == 13) { classes.push("grid-cols-13") }
  if (columns == 14) { classes.push("grid-cols-14") }
  if (columns == 15) { classes.push("grid-cols-15") }
  if (columns == 16) { classes.push("grid-cols-16") }

  return (
    <>
      <div onWheel={debouncedWheelHandler} className="grid items-center justify-center">
        <div className={classes.join(' ')}>
          {squares}
        </div>
      </div>
    </>
  );
}