/* eslint-disable @typescript-eslint/no-unused-vars */ // take me out after all the icon imports are used

import { useContext } from 'react'
import Link from 'next/link'
import { type Prisma } from '@prisma/client'
import { useKeyBindings } from 'rooks'
import ControlButton from '../components/ControlButton'
import { pentaContext } from '../pentas/[id]'

// icons
import { BsArrowLeft, BsArrowRight, BsArrowBarDown, BsArrowBarUp, BsArrowBarLeft, BsArrowBarRight, BsPlay } from 'react-icons/bs'
import { TbFlipHorizontal, TbFlipVertical } from 'react-icons/tb'
import { RiFilePaperLine } from 'react-icons/ri'
import { BiHide, BiShow } from 'react-icons/bi'
import { AiOutlineRotateRight } from 'react-icons/ai'
import { ImExit } from 'react-icons/im'
import { MdReplay } from 'react-icons/md'

export default function Controls (props: {
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
  const gameContext = useContext(pentaContext)
  useKeyBindings({
    q: keyQ,
    e: keyE
    /*
    w: keyW,
    a: keyA,
    s: keyS,
    d: keyD,
    r: keyR,
    Tab: keyTab,
    ArrowUp: keyUp,
    ArrowDown: keyDown,
    ArrowLeft: keyLeft,
    ArrowRight: keyRight,
    */
  })

  function keyQ () {
    // if it's not set, set it to the rightmost
    if (props.activeBlock == null && props.activeBlock !== 0) {
      gameContext.setActiveBlock(props.penta?.blocks.length - 1)
    // if it's zero, set it to the right most
    } else if (props.activeBlock === 0) {
      gameContext.setActiveBlock(props.penta?.blocks.length - 1)
    // otherwise, move it to the left one
    } else { gameContext.setActiveBlock(props.activeBlock - 1) }
  }

  function keyE () {
    // if it's not set, set it to the leftmost
    if (props.activeBlock == null && props.activeBlock !== 0) {
      gameContext.setActiveBlock(0)
    // if it's the rightmost, set it to the leftmost
    } else if (props.activeBlock === props.penta?.blocks.length - 1) {
      gameContext.setActiveBlock(0)
    // otherwise, move it to the right one
    } else { gameContext.setActiveBlock(props.activeBlock + 1) }
  }

  return (
    <>
      <div className='relative m-auto w-fit h-[100px]'>
        <div className="absolute left-[-270px] top-[8px] drop-shadow-lg">
          <Link href='/pentas' className='btn btn-circle btn-md btn-primary'>
            <ImExit size={20} style={{ color: '#ffffff' }} />
          </Link>
        </div>

        <ControlButton
          position="absolute right-[150px] top-[0px] drop-shadow-lg"
          classes="btn gap-2 m-2 btn-primary text-white"
          clickHandler={keyQ}
          icon={<BsArrowLeft size={20} style={{ color: '#ffffff' }} />}
          letter="Q"
        ></ControlButton>

        <ControlButton
          position="absolute right-[30px] top-[0px] drop-shadow-lg"
          classes="btn gap-2 m-2 btn-primary text-white"
          clickHandler={keyE}
          icon={<BsArrowRight size={20} style={{ color: "#ffffff" }} />}
          letter="E"
        ></ControlButton>

      </div>
    </>
  )
}
