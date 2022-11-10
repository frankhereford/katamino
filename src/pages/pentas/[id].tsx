import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { type NextPage } from "next";
import Head from "next/head";
import Penta from "../components/Penta";
import Block from "../components/Block";
import { useKeyBindings} from "rooks";
import { trpc } from "../../utils/trpc";
import { type Prisma } from '@prisma/client';
import _ from "lodash";
import { useDebounceCallback } from '@react-hook/debounce'
import RingLoader from "react-spinners/RingLoader";
import type { CSSProperties } from "react";

import { BsArrowLeft, BsArrowRight, BsArrowBarDown, BsArrowBarUp, BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import { TbFlipHorizontal, TbFlipVertical } from 'react-icons/tb';
import { RiFilePaperLine, } from 'react-icons/ri';
import { BiHide, BiShow } from 'react-icons/bi';
import { AiOutlineRotateRight } from 'react-icons/ai';

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const PentaPage: NextPage = () => {
  const { query, isReady: routerReady} = useRouter()
  const { data: pentaRecord, refetch: pentaRefetch } = trpc.penta.get.useQuery({
    id: String(query.id)
  }, {
    enabled: routerReady
  },);

  const debouncedPentaRefetch = useDebounceCallback(pentaRefetch, 4000, false)

  const set_rotation = trpc.block.set_rotation.useMutation({ });
  const set_reflection = trpc.block.set_reflection.useMutation({ });
  const set_translation = trpc.block.set_translation.useMutation({ });
  const set_visibility = trpc.block.set_visibility.useMutation({ });

  const [penta, setPenta] = useState(pentaRecord)
  const [activeBlock, setActiveBlock] = useState<number>()

  useEffect(() => {
    if (!pentaRecord) { return }
    setPenta(pentaRecord)
  }, [pentaRecord])

  const [flipIcon, setFlipIcon] = useState(<TbFlipHorizontal size={20} style={{ color: "#ffffff" }} />)
  const [visibilityIcon, setVisibilityIcon] = useState(<BiShow size={20} style={{ color: "#ffffff" }} />)

  useEffect(() => {
    if (!activeBlock && activeBlock !== 0) { return }
    if (
      penta?.blocks[activeBlock]?.rotation &&
      typeof penta?.blocks[activeBlock]?.rotation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.rotation)
    ) {
      const rotation = penta?.blocks[activeBlock]?.rotation as Prisma.JsonObject
      const clockwise: number = Number(rotation.clockwise) || 0    
      if (clockwise % 2 == 0) {
        setFlipIcon(<TbFlipHorizontal size={20} style={{ color: "#ffffff" }} />)
      }
      else {
        setFlipIcon(<TbFlipVertical size={20} style={{ color: "#ffffff" }} />)
      }
    }

    if (penta?.blocks[activeBlock]?.visible) {
      setVisibilityIcon(<BiHide size={20} style={{ color: "#ffffff" }} />)
    }
    else {
      setVisibilityIcon(<BiShow size={20} style={{ color: "#ffffff" }} />)
    }

  }, [penta, activeBlock])

  const [initialShow, setInitialShow] = useState(false)

  useEffect(() => {
    if (!penta) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    const visibleCount = penta.blocks.filter(block => block.visible).length
    if (visibleCount == 0 && activeBlock == 0 && !initialShow) {
      setInitialShow(true)
      keyS()
    }
    setInitialShow(true)
  }, [penta, activeBlock])

  useKeyBindings({
    q: keyQ,
    w: keyW,
    e: keyE,
    a: keyA,
    s: keyS,
    d: keyD,
    Tab: keyTab,
    ArrowUp: keyUp,
    ArrowDown: keyDown,
    ArrowLeft: keyLeft,
    ArrowRight: keyRight,
  })

  function keyQ() {
    if (!penta?.blocks) { return }
    else if (!activeBlock && activeBlock !== 0) {
      setActiveBlock(penta?.blocks.length - 1)
    }
    else if (activeBlock === 0) {
      setActiveBlock(penta?.blocks.length - 1)
    }
    else { setActiveBlock(activeBlock - 1)}
  }

  function keyE() {
    if (!penta?.blocks) { return }
    else if (!activeBlock && activeBlock !== 0) {
      setActiveBlock(0)
    }
    else if (activeBlock == penta?.blocks.length - 1) {
      setActiveBlock(0)
    }
    else { setActiveBlock(activeBlock + 1) }
  }

  function keyW() {
    if (!penta?.blocks) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }
    if (!penta?.blocks[activeBlock]?.id) { return }

    if (!penta) { return }
    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.reflection = !pentaCopy?.blocks?.[activeBlock]?.reflection
    setPenta(pentaCopy)

    set_reflection.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      reflection: penta?.blocks[activeBlock]?.reflection ? false : true
    })
    debouncedPentaRefetch()
  }

  function keyD() {
    if (!penta?.blocks) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }
    if (
      penta?.blocks[activeBlock]?.rotation &&
      typeof penta?.blocks[activeBlock]?.rotation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.rotation)
    ) {
      const rotation = penta?.blocks[activeBlock]?.rotation as Prisma.JsonObject
      const clockwise: number = Number(rotation.clockwise) || 0
      
      if (!penta) { return }
      const pentaCopy = _.cloneDeep(penta);
      pentaCopy.blocks[activeBlock]!.rotation = {
        clockwise: (clockwise + 1) % 4
      }
      setPenta(pentaCopy)

      set_rotation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        clockwise: (clockwise + 1) % 4
      })
    }
    debouncedPentaRefetch()
  }

  function keyTab(event: KeyboardEvent) {
    event.preventDefault();
    if (!penta?.blocks) { return }
    else if (!activeBlock && activeBlock !== 0 && event.shiftKey) {
      setActiveBlock(penta?.blocks.length - 1)
    }
    else if (!activeBlock && activeBlock !== 0) {
      setActiveBlock(0)
    }
    else if (activeBlock == penta?.blocks.length - 1 && event.shiftKey) {
      setActiveBlock(activeBlock - 1)
     }
    else if (activeBlock == penta?.blocks.length - 1) {
      setActiveBlock(0)
     }
    else if (event.shiftKey && activeBlock === 0) {
      setActiveBlock(penta?.blocks.length - 1)
    }
    else if (event.shiftKey) {
      setActiveBlock(activeBlock - 1)
    }
    else {setActiveBlock(activeBlock + 1)}
  }

  function keyUp() {
    if (!penta) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }
    if (!penta?.blocks[activeBlock]?.id) { return }

    if (
      penta?.blocks[activeBlock]?.translation &&
      typeof penta?.blocks[activeBlock]?.translation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.translation)
    ) {
      const translation = penta?.blocks[activeBlock]?.translation as Prisma.JsonObject
      const up: number = Number(translation.up) || 0
      const right: number = Number(translation.right) || 0

      if (!penta) { return }
      const pentaCopy = _.cloneDeep(penta);
      pentaCopy.blocks[activeBlock]!.translation = {
        up: up + 1,
        right: right,
      }
      setPenta(pentaCopy)

      set_translation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        translation: {
          up: up + 1,
          right: right,
        }
      })
    }
    debouncedPentaRefetch()
  }

  function keyDown() {
    if (!penta) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }
    if (!penta?.blocks[activeBlock]?.id) { return }

    if (
      penta?.blocks[activeBlock]?.translation &&
      typeof penta?.blocks[activeBlock]?.translation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.translation)
    ) {
      const translation = penta?.blocks[activeBlock]?.translation as Prisma.JsonObject
      const up: number = Number(translation.up) || 0
      const right: number = Number(translation.right) || 0

      if (!penta) { return }
      const pentaCopy = _.cloneDeep(penta);
      pentaCopy.blocks[activeBlock]!.translation = {
        up: up - 1,
        right: right,
      }
      setPenta(pentaCopy)

      set_translation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        translation: {
          up: up - 1,
          right: right,
        }
      })
    }
    debouncedPentaRefetch()
  }

  function keyLeft() {
    if (!penta) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }
    if (!penta?.blocks[activeBlock]?.id) { return }

    if (
      penta?.blocks[activeBlock]?.translation &&
      typeof penta?.blocks[activeBlock]?.translation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.translation)
    ) {
      const translation = penta?.blocks[activeBlock]?.translation as Prisma.JsonObject
      const up: number = Number(translation.up) || 0
      const right: number = Number(translation.right) || 0

      if (!penta) { return }
      const pentaCopy = _.cloneDeep(penta);
      pentaCopy.blocks[activeBlock]!.translation = {
        up: up,
        right: right - 1,
      }
      setPenta(pentaCopy)

      set_translation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        translation: {
          up: up,
          right: right - 1,
        }
      })
    }
    debouncedPentaRefetch()
  }

  function keyRight() {
    if (!penta) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }
    if (!penta?.blocks[activeBlock]?.id) { return }

    if (
      penta?.blocks[activeBlock]?.translation &&
      typeof penta?.blocks[activeBlock]?.translation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.translation)
    ) {
      const translation = penta?.blocks[activeBlock]?.translation as Prisma.JsonObject
      const up: number = Number(translation.up) || 0
      const right: number = Number(translation.right) || 0

      if (!penta) { return }
      const pentaCopy = _.cloneDeep(penta);
      pentaCopy.blocks[activeBlock]!.translation = {
        up: up,
        right: right + 1,
      }
      setPenta(pentaCopy)

      set_translation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        translation: {
          up: up,
          right: right + 1,
        }
      })
    }
    debouncedPentaRefetch()
  }

  function keyA() {
    if (!penta) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }

    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.translation = { up: 0, right: 0, }
    pentaCopy.blocks[activeBlock]!.rotation = { clockwise: 0 }
    pentaCopy.blocks[activeBlock]!.reflection = false
    setPenta(pentaCopy)

    set_translation.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      translation: {
        up: 0,
        right: 0
      }
    })
    set_rotation.mutate({ id: penta?.blocks[activeBlock]?.id || '', clockwise: 0 })
    set_reflection.mutate({ id: penta?.blocks[activeBlock]?.id || '', reflection: false })
    debouncedPentaRefetch()
  }

  function keyS() {
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta) { return }
    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.visible = !pentaCopy.blocks[activeBlock]!.visible
    setPenta(pentaCopy)

    set_visibility.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      visible: penta?.blocks[activeBlock]?.visible ? false : true
    })
    debouncedPentaRefetch()
  }

  let columnClass = null
  if      (penta?.blocks.length === 3)  { columnClass = 'grid-cols-3'  }
  else if (penta?.blocks.length === 4)  { columnClass = 'grid-cols-4'  }
  else if (penta?.blocks.length === 5)  { columnClass = 'grid-cols-5'  }
  else if (penta?.blocks.length === 6)  { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 7)  { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 8)  { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 9)  { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 10) { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 11) { columnClass = 'grid-cols-6'  }
  else if (penta?.blocks.length === 12) { columnClass = 'grid-cols-6'  }

  const classes = ["mt-10", "grid", "items-center", "justify-center", columnClass]

  function blockClickHandler(block: string) {
    const index = penta?.blocks.findIndex((b) => b.id === block)
    setActiveBlock(index)
  }

  return (
    <>
      <Head>
        <title>Katamino</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
        </div>
        <div>
          <Penta penta={penta} confetti={true}></Penta>
        </div>
        
        {penta &&
          <div className="w-screen">
            <div className="m-auto relative w-fit h-[100px]">
              <div className="absolute right-[150px] top-[0px]">
                <button
                  className="btn gap-2 m-2 btn-primary text-white"
                  onClick={keyQ}>
                  <BsArrowLeft size={20} style={{ color: "#ffffff" }} />
                  Q
                </button>
              </div>
              <div className="absolute right-[90px] top-[0px]">
                <button
                  className={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                  onClick={keyW}>
                  {flipIcon}
                  W
                </button>
              </div>
              <div className="absolute right-[30px] top-[0px]">
                <button
                  className="btn gap-2 m-2 btn-primary text-white"
                  onClick={keyE}>
                  <BsArrowRight size={20} style={{ color: "#ffffff" }} />
                  E
                </button>
              </div>
              <div className="absolute right-[135px] top-[55px]">
                <button
                  className={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                  onClick={keyA}>
                  <RiFilePaperLine size={20} style={{ color: "#ffffff" }} />
                  A
                </button>
              </div>
              <div className="absolute right-[75px] top-[55px]">
                <button
                  className={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined ? "" : " btn-disabled")}
                  onClick={keyS}>
                  {visibilityIcon}
                  S
                </button>
              </div>
              <div className="absolute right-[15px] top-[55px]">
                <button
                  className={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                  onClick={keyD}>
                  <AiOutlineRotateRight size={20} style={{ color: "#ffffff" }} />
                  D
                </button>
              </div>
              <div className="absolute left-[80px] top-[0px]">
                <button
                  className={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                  onClick={keyUp}
                >
                  <BsArrowBarUp size={20} style={{ color: "#ffffff" }} />
                </button>
              </div>
              <div className="absolute left-[20px] top-[55px]">
                <button
                  className={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                  onClick={keyLeft}
                >
                  <BsArrowBarLeft size={20} style={{ color: "#ffffff" }} />
                </button>
              </div>
              <div className="absolute left-[80px] top-[55px]">
                <button
                  className={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                  onClick={keyDown}
                >
                  <BsArrowBarDown size={20} style={{ color: "#ffffff" }} />
                </button>
              </div>
              <div className="absolute left-[140px] top-[55px]">
                <button
                  className={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                  onClick={keyRight}
                >
                  <BsArrowBarRight size={20} style={{ color: "#ffffff" }} />
                </button>
              </div>
            </div>
          </div>
        }
        {!penta && 
          <RingLoader
            color={"hsl(var(--pf))"}
            cssOverride={override}
            size={75}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        }

        <div className={classes.join(" ")}>
          {penta?.blocks.map((block, index) => {
            let classes: string[] = []
            if (index === activeBlock) {
              classes = ["outline-dashed", "w-fit", "mx-auto", "mt-2", "outline-4", "outline-cyan-500"]
            }
            else {
              classes = ["w-fit", "mx-auto", "mt-2"]
            }
            return (
              <div key={block.id}>
                <div className={classes.join(" ")}>
                  <Block blockClickHandler={blockClickHandler}  block={block}></Block>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

export default PentaPage