import { type SyntheticEvent, useContext } from 'react'
import { type Prisma } from '@prisma/client'
import Block from './Block'
import { pentaContext } from '../pentas/[id]'

export default function Blocks (props: {
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
  activeBlock: number | undefined
}) {
  const pentaGame = useContext(pentaContext)

  function handleClick (e: SyntheticEvent) {
    pentaGame.setActiveBlock(Number(e.currentTarget.getAttribute('data-index')))
  }

  if (props.penta == null) {
    return <></>
  }

  return (
    <>
      <div className='flex flex-wrap place-content-center mt-[10px] mr-10 ml-10'>
        {props.penta.blocks.map((block, index) => {
          let classes = ['w-fit', 'm-3']
          if (index === props.activeBlock) {
            classes = classes.concat(['outline', 'outline-dashed', 'outline-primary', 'outline-4'])
          }
          return (
            <div onClick={handleClick} data-index={index} key={block.id} className={classes.join(' ')}>
              <Block size={20} block={block}></Block>
            </div>
          )
        })}
      </div>
    </>
  )
}
