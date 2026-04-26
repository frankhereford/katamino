import { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { type Prisma } from '@prisma/client'
import { useKeyBindings } from 'rooks'
import ControlButton from '../components/ControlButton'
import { pentaContext } from '../../context/pentaContext'
import _ from 'lodash'
import { trpc } from '../../utils/trpc'

// * icons
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
  const saveMove = trpc.block.saveMove.useMutation({})

  const [visibilityIcon, setVisibilityIcon] = useState(<BiShow size={20} style={{ color: '#ffffff' }} />)
  const [reflectionIcon, setReflectionIcon] = useState(<TbFlipHorizontal size={20} style={{ color: '#ffffff' }} />)
  const [rotationIcon, setRotationIcon] = useState(<AiOutlineRotateRight size={20} style={{ color: '#ffffff' }} />)
  const [replayIcon, setReplayIcon] = useState(<MdReplay size={20} style={{ color: '#ffffff' }} />)

  // * handle setting the visibility icon
  useEffect(() => {
    if (props.activeBlock == null) { return }
    if ((props.penta.blocks[props.activeBlock]?.transformation.visible) ?? false) {
      setVisibilityIcon(<BiHide size={20} style={{ color: '#ffffff' }} />)
    } else {
      setVisibilityIcon(<BiShow size={20} style={{ color: '#ffffff' }} />)
    }
  }, [props.penta, props.activeBlock])

  // * handle setting the reflection icon
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

  // * handle setting the rotation icon
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

  // * handle setting the replay icon
  useEffect(() => {
    if (gameContext.isReplay) {
      setReplayIcon(<BsPlay size={20} style={{ color: '#ffffff' }} />)
    } else {
      setReplayIcon(<MdReplay size={20} style={{ color: '#ffffff' }} />)
    }
  }, [gameContext.isReplay])

  // eslint-disable-next-line @typescript-eslint/ban-types
  function transmitMove (newTransformation: Prisma.TransformationGetPayload<{}>) {
    if (props.activeBlock == null) { return }
    saveMove.mutate({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      blockId: props.penta.blocks[props.activeBlock]!.id,
      currentTransformation: newTransformation,
      now: new Date() // * these dates can be used to truly serialize moves
    })
    gameContext.refetchPenta()
  }

  useKeyBindings({
    Tab: keyTab,
    q: keyQ,
    w: keyW,
    e: keyE,
    r: keyR,
    a: keyA,
    s: keyS,
    d: keyD,
    ArrowUp: keyUp,
    ArrowDown: keyDown,
    ArrowLeft: keyLeft,
    ArrowRight: keyRight
  })

  function isVisible () {
    if (props.activeBlock == null) { return }
    if ((props.penta.blocks[props.activeBlock]?.transformation.visible) ?? false) {
      return true
    } else {
      return false
    }
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

  function keyQ () {
    // * if it's not set, set it to the rightmost
    if (props.activeBlock == null && props.activeBlock !== 0) {
      gameContext.setActiveBlock(props.penta?.blocks.length - 1)
    // * if it's zero, set it to the right most
    } else if (props.activeBlock === 0) {
      gameContext.setActiveBlock(props.penta?.blocks.length - 1)
    // otherwise, move it to the left one
    } else { gameContext.setActiveBlock(props.activeBlock - 1) }
  }

  function keyW () {
    if (!(isVisible() ?? false)) { return }
    if (gameContext.isReplay) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentReflection = props.penta.blocks[props.activeBlock]?.transformation.reflection
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.reflection = !(currentReflection ?? false)
    gameContext.setPenta(penta)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    transmitMove(penta.blocks[props.activeBlock]!.transformation)
  }

  function keyE () {
    // * if it's not set, set it to the leftmost
    if (props.activeBlock == null && props.activeBlock !== 0) {
      gameContext.setActiveBlock(0)
    // * if it's the rightmost, set it to the leftmost
    } else if (props.activeBlock === props.penta?.blocks.length - 1) {
      gameContext.setActiveBlock(0)
    // * otherwise, move it to the right one
    } else { gameContext.setActiveBlock(props.activeBlock + 1) }
  }

  function keyR () {
    // * replay mode
    gameContext.setIsReplay(!gameContext.isReplay)
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    transmitMove(penta.blocks[props.activeBlock]!.transformation)
  }

  function keyS () {
    const penta = _.cloneDeep(props.penta)
    if (gameContext.isReplay) { return }
    if (props.activeBlock == null) { return }
    const currentVisibility = props.penta.blocks[props.activeBlock]?.transformation.visible
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.visible = !(currentVisibility ?? false)
    gameContext.setPenta(penta)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    transmitMove(penta.blocks[props.activeBlock]!.transformation)
  }

  function keyD () {
    if (!(isVisible() ?? false)) { return }
    if (gameContext.isReplay) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentRotation = props.penta.blocks[props.activeBlock]?.transformation.rotation ?? 0
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.rotation = (currentRotation + 1) % 4
    gameContext.setPenta(penta)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    transmitMove(penta.blocks[props.activeBlock]!.transformation)
  }

  function keyUp () {
    if (!(isVisible() ?? false)) { return }
    if (gameContext.isReplay) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentTranslationUp = props.penta.blocks[props.activeBlock]?.transformation.translationUp
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.translationUp = (currentTranslationUp ?? 0) + 1
    gameContext.setPenta(penta)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    transmitMove(penta.blocks[props.activeBlock]!.transformation)
  }

  function keyDown () {
    if (!(isVisible() ?? false)) { return }
    if (gameContext.isReplay) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentTranslationUp = props.penta.blocks[props.activeBlock]?.transformation.translationUp
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.translationUp = (currentTranslationUp ?? 0) - 1
    gameContext.setPenta(penta)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    transmitMove(penta.blocks[props.activeBlock]!.transformation)
  }

  function keyRight () {
    if (!(isVisible() ?? false)) { return }
    if (gameContext.isReplay) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentTranslationRight = props.penta.blocks[props.activeBlock]?.transformation.translationRight
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.translationRight = (currentTranslationRight ?? 0) + 1
    gameContext.setPenta(penta)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    transmitMove(penta.blocks[props.activeBlock]!.transformation)
  }

  function keyLeft () {
    if (!(isVisible() ?? false)) { return }
    if (gameContext.isReplay) { return }
    const penta = _.cloneDeep(props.penta)
    if (props.activeBlock == null) { return }
    const currentTranslationRight = props.penta.blocks[props.activeBlock]?.transformation.translationRight
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    penta.blocks[props.activeBlock]!.transformation.translationRight = (currentTranslationRight ?? 0) - 1
    gameContext.setPenta(penta)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    transmitMove(penta.blocks[props.activeBlock]!.transformation)
  }

  const blockVisible = props.activeBlock !== undefined &&
    ((props.penta.blocks[props.activeBlock]?.transformation.visible) ?? false)
  const canTranslate = blockVisible && !gameContext.isReplay
  const canToggleVisibility = props.activeBlock !== undefined && !gameContext.isReplay
  const notReplay = !gameContext.isReplay

  const btn = 'btn btn-primary text-white drop-shadow-md'
  const dis = ' btn-disabled'

  return (
    <div className='m-auto w-fit mt-[20px]'>
      <div className='flex items-center gap-3'>

        <Link href='/pentas' className='btn btn-circle btn-primary drop-shadow-md'>
          <ImExit size={20} style={{ color: '#ffffff' }} />
        </Link>

        {/* Arrow keys: ↑ above, ← ↓ → in a row */}
        <div className='flex flex-col items-center gap-1'>
          <ControlButton
            classes={btn + (canTranslate ? '' : dis)}
            clickHandler={keyUp}
            icon={<BsArrowBarUp size={20} style={{ color: '#ffffff' }} />}
          />
          <div className='flex gap-1'>
            <ControlButton
              classes={btn + (canTranslate ? '' : dis)}
              clickHandler={keyLeft}
              icon={<BsArrowBarLeft size={20} style={{ color: '#ffffff' }} />}
            />
            <ControlButton
              classes={btn + (canTranslate ? '' : dis)}
              clickHandler={keyDown}
              icon={<BsArrowBarDown size={20} style={{ color: '#ffffff' }} />}
            />
            <ControlButton
              classes={btn + (canTranslate ? '' : dis)}
              clickHandler={keyRight}
              icon={<BsArrowBarRight size={20} style={{ color: '#ffffff' }} />}
            />
          </div>
        </div>

        {/* QWER row / ASD row */}
        <div className='flex flex-col gap-1'>
          <div className='flex gap-1'>
            <ControlButton classes={btn + (notReplay ? '' : dis)} clickHandler={keyQ} icon={<BsArrowLeft size={20} style={{ color: '#ffffff' }} />} letter="Q" />
            <ControlButton classes={btn + (blockVisible && notReplay ? '' : dis)} clickHandler={keyW} icon={reflectionIcon} letter="W" />
            <ControlButton classes={btn + (notReplay ? '' : dis)} clickHandler={keyE} icon={<BsArrowRight size={20} style={{ color: '#ffffff' }} />} letter="E" />
            <ControlButton classes={btn} clickHandler={keyR} icon={replayIcon} letter="R" />
          </div>
          <div className='flex gap-1'>
            <ControlButton classes={btn + (blockVisible && notReplay ? '' : dis)} clickHandler={keyA} icon={<RiFilePaperLine size={20} style={{ color: '#ffffff' }} />} letter="A" />
            <ControlButton classes={btn + (canToggleVisibility ? '' : dis)} clickHandler={keyS} icon={visibilityIcon} letter="S" />
            <ControlButton classes={btn + (blockVisible && notReplay ? '' : dis)} clickHandler={keyD} icon={rotationIcon} letter="D" />
          </div>
        </div>

      </div>
    </div>
  )
}
