/* eslint-disable @typescript-eslint/no-unused-vars */ // take me out after all the icon imports are used

import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { type Prisma } from '@prisma/client'
import { useKeyBindings } from 'rooks'
import ControlButton from '../components/ControlButton'
import { pentaContext } from '../pentas/[id]'
import _ from 'lodash'

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
  const [visibilityIcon, setVisibilityIcon] = useState(<BiShow size={20} style={{ color: '#ffffff' }} />)
  const [reflectionIcon, setReflectionIcon] = useState(<TbFlipHorizontal size={20} style={{ color: '#ffffff' }} />)
  const [rotationIcon, setRotationIcon] = useState(<AiOutlineRotateRight size={20} style={{ color: '#ffffff' }} />)

  // handle setting the visibility icon
  useEffect(() => {
    if (props.activeBlock == null) { return }
    if ((props.penta.blocks[props.activeBlock]?.transformation.visible) ?? false) {
      setVisibilityIcon(<BiHide size={20} style={{ color: '#ffffff' }} />)
    } else {
      setVisibilityIcon(<BiShow size={20} style={{ color: '#ffffff' }} />)
    }
  }, [props.penta, props.activeBlock])

  // handle setting the reflection icon
  useEffect(() => {
    if (props.activeBlock == null) { return }
    if (props.penta.blocks[props.activeBlock]?.transformation.rotation === 0) {
      setReflectionIcon(<TbFlipHorizontal size={20} style={{ color: '#ffffff' }} />)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-non-null-assertion
    } else if (props.penta.blocks[props.activeBlock]!.transformation.rotation % 2) {
      setReflectionIcon(<TbFlipVertical size={20} style={{ color: '#ffffff' }} />)
    } else {
      setReflectionIcon(<TbFlipHorizontal size={20} style={{ color: '#ffffff' }} />)
    }
  }, [props.penta, props.activeBlock])

  // handle setting the rotation icon
  useEffect(() => {
    if (props.activeBlock == null) { return }
    const currentRotation = props.penta.blocks[props.activeBlock]?.transformation.rotation ?? 0
    if (currentRotation === 0) {
      setRotationIcon(<AiOutlineRotateRight size={20} style={{ color: '#ffffff' }} />)
    } else {
      setRotationIcon(<AiOutlineRotateRight size={20} style={{ color: '#ffffff', rotate: `${currentRotation * 90}deg` }} />)
    }
  }, [props.penta, props.activeBlock])

  const gameContext = useContext(pentaContext)
  useKeyBindings({
    Tab: keyTab,
    q: keyQ,
    w: keyW,
    e: keyE,
    a: keyA,
    s: keyS,
    d: keyD
    /*
    r: keyR,
    ArrowUp: keyUp,
    ArrowDown: keyDown,
    ArrowLeft: keyLeft,
    ArrowRight: keyRight,
    */
  })

  function isVisible () {
    if (props.activeBlock == null) { return }
    if ((props.penta.blocks[props.activeBlock]?.transformation.visible) ?? false) {
      return true
    } else {
      return false
    }
  }

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

  function keyW () {
    if (!(isVisible() ?? false)) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentReflection = props.penta.blocks[props.activeBlock]?.transformation.reflection
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.reflection = !(currentReflection ?? false)
    gameContext.setPenta(penta)
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

  function keyTab (event: KeyboardEvent) {
    event.preventDefault()
    if (props.activeBlock == null && !event.shiftKey) {
      gameContext.setActiveBlock(0)
    } else if (props.activeBlock == null && event.shiftKey) {
      gameContext.setActiveBlock(props.penta?.blocks.length - 1)
    } else if ((props.activeBlock === props.penta?.blocks.length - 1) && !event.shiftKey) {
      gameContext.setActiveBlock(0)
    } else if ((props.activeBlock === props.penta?.blocks.length - 1) && event.shiftKey) {
      gameContext.setActiveBlock(props.activeBlock - 1)
    } else if (props.activeBlock === 0 && event.shiftKey) {
      gameContext.setActiveBlock(props.penta?.blocks.length - 1)
    } else if (props.activeBlock != null && !event.shiftKey) {
      gameContext.setActiveBlock(props.activeBlock + 1)
    } else if (props.activeBlock != null && event.shiftKey) {
      gameContext.setActiveBlock(props.activeBlock - 1)
    }
  }

  function keyA () {
    if (!(isVisible() ?? false)) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    // ? 💀 typescript pain zone. How do you do this correctly?
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.reflection = false
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.visible = false
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.rotation = 0
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.translationUp = 0
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.translationRight = 0
    gameContext.setPenta(penta)
  }

  function keyS () {
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentVisibility = props.penta.blocks[props.activeBlock]?.transformation.visible
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.visible = !(currentVisibility ?? false)
    gameContext.setPenta(penta)
  }

  function keyD () {
    if (!(isVisible() ?? false)) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentRotation = props.penta.blocks[props.activeBlock]?.transformation.rotation ?? 0
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.rotation = (currentRotation + 1) % 4
    gameContext.setPenta(penta)
  }

  return (
    <>
      <div className='relative m-auto w-fit h-[120px]'>
        <div className="absolute left-[-270px] top-[8px] drop-shadow-lg">
          <Link href='/pentas' className='btn btn-circle btn-md btn-primary'>
            <ImExit size={20} style={{ color: '#ffffff' }} />
          </Link>
        </div>

        <ControlButton
          position="absolute right-[150px] top-[0px] drop-shadow-lg"
          classes="btn gap-0 m-2 btn-primary text-white"
          clickHandler={keyQ}
          icon={<BsArrowLeft size={20} style={{ color: '#ffffff' }} />}
          letter="Q"
        ></ControlButton>

        <ControlButton
          position="absolute right-[90px] top-[0px] drop-shadow-lg"
          classes={'btn gap-0 m-2 btn-primary text-white' + (props.activeBlock !== undefined && ((props.penta.blocks[props.activeBlock]?.transformation.visible) ?? false) ? '' : ' btn-disabled')}
          clickHandler={keyW}
          icon={reflectionIcon}
          letter="W"
        ></ControlButton>

        <ControlButton
          position="absolute right-[30px] top-[0px] drop-shadow-lg"
          classes="btn gap-0 m-2 btn-primary text-white"
          clickHandler={keyE}
          icon={<BsArrowRight size={20} style={{ color: '#ffffff' }} />}
          letter="E"
        ></ControlButton>

        <ControlButton
          position="absolute right-[135px] top-[55px] drop-shadow-lg"
          classes={'btn gap-2 m-2 btn-primary text-white' + (props.activeBlock !== undefined && ((props.penta.blocks[props.activeBlock]?.transformation.visible) ?? false) ? '' : ' btn-disabled')}
          clickHandler={keyA}
          icon={<RiFilePaperLine size={20} style={{ color: '#ffffff' }} />}
          letter="A"
        ></ControlButton>

        <ControlButton
          position="absolute right-[75px] top-[55px] drop-shadow-lg"
          classes={'btn gap-0 m-2 btn-primary text-white' + (props.activeBlock !== undefined ? '' : ' btn-disabled')}
          clickHandler={keyS}
          icon={visibilityIcon}
          letter="S"
        ></ControlButton>

        <ControlButton
          position="absolute right-[15px] top-[55px] drop-shadow-lg"
          classes={'btn gap-0 m-2 btn-primary text-white' + (props.activeBlock !== undefined && ((props.penta.blocks[props.activeBlock]?.transformation.visible) ?? false) ? '' : ' btn-disabled')}
          clickHandler={keyD}
          icon={rotationIcon}
          letter="D"
        ></ControlButton>

      </div>
    </>
  )
}
