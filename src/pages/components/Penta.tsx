import React, { useState, useEffect } from 'react'
import { type Prisma } from '@prisma/client'
import Square from './Square'

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
  const [grid, setGrid] = useState<JSX.Element[]>([])

  useEffect(() => {
    const squares = []
    for (let i = 0; i < props.penta.columns; i++) {
      for (let j = 0; j < 5; j++) {
        squares.push(<Square key={`${i}-${j}`} color="lightGrey"></Square>)
      }
    }
    setGrid(squares)
    /*
    props.penta.blocks.map((block, index) => {
      console.log(block)
      return true
    })
    setGrid([
      <Square key='index' color={'red'}></Square>
    ])
    */
  }, [props.penta])

  const classes = ['grid', 'w-fit']
  if (props.penta.columns > 16 || props.penta.columns < 0) { props.penta.columns = 5 }
  if (props.penta.columns === 0) { classes.push('grid-cols-none') }
  if (props.penta.columns === 1) { classes.push('grid-cols-1') }
  if (props.penta.columns === 2) { classes.push('grid-cols-2') }
  if (props.penta.columns === 3) { classes.push('grid-cols-3') }
  if (props.penta.columns === 4) { classes.push('grid-cols-4') }
  if (props.penta.columns === 5) { classes.push('grid-cols-5') }
  if (props.penta.columns === 6) { classes.push('grid-cols-6') }
  if (props.penta.columns === 7) { classes.push('grid-cols-7') }
  if (props.penta.columns === 8) { classes.push('grid-cols-8') }
  if (props.penta.columns === 9) { classes.push('grid-cols-9') }
  if (props.penta.columns === 10) { classes.push('grid-cols-10') }
  if (props.penta.columns === 11) { classes.push('grid-cols-11') }
  if (props.penta.columns === 12) { classes.push('grid-cols-12') }
  if (props.penta.columns === 13) { classes.push('grid-cols-13') }
  if (props.penta.columns === 14) { classes.push('grid-cols-14') }
  if (props.penta.columns === 15) { classes.push('grid-cols-15') }
  if (props.penta.columns === 16) { classes.push('grid-cols-16') }

  return (
    <>
      <div className={classes.join(' ')}>
        {grid}
      </div>
    </>
  )
}
