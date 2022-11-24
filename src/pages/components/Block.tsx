import React, { useState, useEffect } from 'react'
import type { Prisma } from '@prisma/client'
import Square from './Square'
import { transformBlockShape } from '../../utils/transformations'
import { BsSlashLg } from 'react-icons/bs'

interface BlockProps {
  size?: number
  hideVisibilityIndicator?: boolean
  block: Prisma.BlockGetPayload<{
    include: {
      piece: {
        include: {
          color: true
        }
      }
      transformation: true
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
      let shape = props.block.piece.shape as number[][]
      shape = transformBlockShape(shape, props.block.transformation, 0, false)

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

  const [gridClasses, setGridClasses] = useState(['z-0', 'm-1', 'grid', 'grid-cols-5', 'outline', 'outline-1', 'outline-slate-400', 'p-0.5', 'bg-slate-100'])

  useEffect(() => {
    console.log('Size: ', props.size)
    const gridClasses = ['z-0', 'm-1', 'grid', 'grid-cols-5', 'outline', 'outline-1', 'outline-slate-400', 'p-0.5', 'bg-slate-100']
    if (!(props.hideVisibilityIndicator ?? false) && !props.block.transformation.visible) {
      gridClasses.push('opacity-30')
    }
    if (props.size === 8) {
      gridClasses.push('grid-cols-[repeat(5,_9px)]')
    } else if (props.size === 20) {
      gridClasses.push('grid-cols-[repeat(5,_21px)]')
    }
    setGridClasses(gridClasses)
  }, [props.block, props.hideVisibilityIndicator])

  return (
    <>
      <div className=''>
        {props.hideVisibilityIndicator == null &&
          <div className="absolute z-10">
            {!props.block?.transformation.visible &&
              <BsSlashLg size={112} style={{ color: '#00000066' }} />
            }
          </div>
        }
        <div className={gridClasses.join(' ')}>
          {grid}
        </div>
      </div>
    </>
  )
}
