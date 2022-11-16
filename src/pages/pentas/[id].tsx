// next
import { type NextPage } from "next";
import { useRouter } from 'next/router'
import Link from "next/link";

// react
import { useState, useEffect } from 'react'
import type { CSSProperties } from "react";

// libs
import _ from "lodash";
import { useSession} from 'next-auth/react'
import { type Prisma } from '@prisma/client';
import { trpc } from "../../utils/trpc";
import { useDebounceCallback } from '@react-hook/debounce'
import RingLoader from "react-spinners/RingLoader";
import { useKeyBindings} from "rooks"
//import { useFavicon } from "react-usefavicon"
// components
import Penta from "../components/Penta";
import Block from "../components/Block";
import ControlButton from "../components/ControlButton";
import HeaderContent from "../components/HeaderContent";

// icons
import { BsArrowLeft, BsArrowRight, BsArrowBarDown, BsArrowBarUp, BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import { TbFlipHorizontal, TbFlipVertical } from 'react-icons/tb';
import { RiFilePaperLine, } from 'react-icons/ri';
import { BiHide, BiShow } from 'react-icons/bi';
import { AiOutlineRotateRight } from 'react-icons/ai';
import { ImExit } from 'react-icons/im';


// style used for the Ring Loader component
const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const PentaPage: NextPage = () => {

    // ! why is this not resolvable?!?
    //const [
      //faviconHref,
      //{
        //restoreFavicon,
        //drawOnFavicon,
        //setEmojiFavicon,
        //setFaviconHref,
        //jsxToFavicon,
      //},
    //] = useFavicon();

  // access to the router to get the ID out of the URL
  const { query, isReady: routerReady} = useRouter()

  // query the penta in question and grab a function to trigger a refetch
  const { data: pentaRecord, refetch: pentaRefetch } = trpc.penta.get.useQuery({
    id: String(query.id)
  }, {
    enabled: routerReady
  },);

  const { data: pentaMoves } = trpc.move.get.useQuery({})

  // user session, but only interested in the state of auth
  const { status:sessionStatus } = useSession();

  // get a method to "redirect" the user 👋
  const nextRouter = useRouter();
  
  // when we find the user to be unauthenticated (there is a loading state, btw), send them to the login screen
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      nextRouter.push('/')
    }
  }, [nextRouter, sessionStatus])


  // In an ideal world, you'd check to see that the DB state and the app state match after every mutation.
  // Instead, we call on this debouncedPentaRefetch every time we make a mutation, but then debounce it.
  // This will cause our state to get checked against the DB 4 seconds after the last move and reset that
  // timer if the user moves again.
  const debouncedPentaRefetch = useDebounceCallback(pentaRefetch, 4000, false)

  // setup some mutations we'll use as the user interacts with the activePiece
  const setRotation = trpc.block.set_rotation.useMutation({ })
  const setReflection = trpc.block.set_reflection.useMutation({ })
  const setTranslation = trpc.block.set_translation.useMutation({ })
  const setVisibility = trpc.block.set_visibility.useMutation({ })
  const setCompletion = trpc.penta.setComplete.useMutation({ })


  // setup state to hold the game state and a pointer to the activePiece
  const [penta, setPenta] = useState(pentaRecord)
  const [activeBlock, setActiveBlock] = useState<number>()

  // when the pentaRecord changes after we get an update, overwrite the state.
  // the database's state is the authority
  useEffect(() => {
    if (!pentaRecord) { return }
    setPenta(pentaRecord)
  }, [pentaRecord])

  // a pair of the controls need dynamic icons based on the state of the activePiece.
  // store them here.
  const [flipIcon, setFlipIcon] = useState(<TbFlipHorizontal size={20} style={{ color: "#ffffff" }} />)
  const [visibilityIcon, setVisibilityIcon] = useState(<BiShow size={20} style={{ color: "#ffffff" }} />)

  // monitor the penta and the active block and update the icons based on the state of the activePiece
  useEffect(() => {
    // This check ensures we have meaningful data loaded from the backend
    if (!activeBlock && activeBlock !== 0) { return }

    // This looks to make sure the specific block has the attributes we're going to monitor and act on
    if (
      penta?.blocks[activeBlock]?.rotation &&
      typeof penta?.blocks[activeBlock]?.rotation == 'object' &&
      !Array.isArray(penta?.blocks[activeBlock]?.rotation)
    ) {

      const rotation = penta?.blocks[activeBlock]?.rotation as Prisma.JsonObject
      const clockwise: number = Number(rotation.clockwise) || 0    

      // set rotation control icon
      if (clockwise % 2 == 0) {
        setFlipIcon(<TbFlipHorizontal size={20} style={{ color: "#ffffff" }} />)
      }
      else {
        setFlipIcon(<TbFlipVertical size={20} style={{ color: "#ffffff" }} />)
      }
    }

    // set visibility control icon
    if (penta?.blocks[activeBlock]?.visible) {
      setVisibilityIcon(<BiHide size={20} style={{ color: "#ffffff" }} />)
    }
    else {
      setVisibilityIcon(<BiShow size={20} style={{ color: "#ffffff" }} />)
    }
  }, [penta, activeBlock])

  // we handle the first activeBlock with a special case: to show the block if not visible
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
  }, [penta, activeBlock, initialShow, keyS])

  // keyboard controls
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

  // move activePiece to the left
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

  // move activePiece to the right. 
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

  // reflect the activeBlock
  function keyW() {
    if (!penta?.blocks) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }
    if (!penta?.blocks[activeBlock]?.id) { return }

    if (!penta) { return }
    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.reflection = !pentaCopy?.blocks?.[activeBlock]?.reflection
    setPenta(pentaCopy)

    setReflection.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      reflection: penta?.blocks[activeBlock]?.reflection ? false : true
    })
    debouncedPentaRefetch()
  }

  // rotate the activeBlock clockwise
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

      setRotation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        clockwise: (clockwise + 1) % 4
      })
    }
    debouncedPentaRefetch()
  }

  // handle the tab key, including with the shift modifier to move activeBlock left or right
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

  // ? I wonder if these very similar movement key handlers could be DRY'd up somehow

  // move the block up
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

      setTranslation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        translation: {
          up: up + 1,
          right: right,
        }
      })
    }
    debouncedPentaRefetch()
  }

  // move the block down
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

      setTranslation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        translation: {
          up: up - 1,
          right: right,
        }
      })
    }
    debouncedPentaRefetch()
  }

  // move the block left
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

      setTranslation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        translation: {
          up: up,
          right: right - 1,
        }
      })
    }
    debouncedPentaRefetch()
  }

  // move the block right
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

      setTranslation.mutate({
        id: penta?.blocks[activeBlock]?.id || '',
        translation: {
          up: up,
          right: right + 1,
        }
      })
    }
    debouncedPentaRefetch()
  }

  // reset the block's position
  function keyA() {
    if (!penta) { return }
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta?.blocks[activeBlock]!.visible) { return }

    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.translation = { up: 0, right: 0, }
    pentaCopy.blocks[activeBlock]!.rotation = { clockwise: 0 }
    pentaCopy.blocks[activeBlock]!.reflection = false
    setPenta(pentaCopy)

    setTranslation.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      translation: {
        up: 0,
        right: 0
      }
    })
    setRotation.mutate({ id: penta?.blocks[activeBlock]?.id || '', clockwise: 0 })
    setReflection.mutate({ id: penta?.blocks[activeBlock]?.id || '', reflection: false })
    debouncedPentaRefetch()
  }

  // ? this linting exception is based on this sort of needing to be inside the useEffect that also uses it?
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function keyS() {
    if (!activeBlock && activeBlock !== 0) { return }
    if (!penta) { return }
    const pentaCopy = _.cloneDeep(penta);
    pentaCopy.blocks[activeBlock]!.visible = !pentaCopy.blocks[activeBlock]!.visible
    setPenta(pentaCopy)

    setVisibility.mutate({
      id: penta?.blocks[activeBlock]?.id || '',
      visible: penta?.blocks[activeBlock]?.visible ? false : true
    })
    debouncedPentaRefetch()
  }

  // This excessively explicit case statement is to use the class names without interpolation
  // so the build process knows to include the CSS rules
  let columnClass = null
  if      (penta?.blocks.length === 3)  { columnClass = 'grid-cols-3' }
  else if (penta?.blocks.length === 4)  { columnClass = 'grid-cols-4' }
  else if (penta?.blocks.length === 5)  { columnClass = 'grid-cols-5' }
  else if (penta?.blocks.length === 6)  { columnClass = 'grid-cols-6' }
  else if (penta?.blocks.length === 7)  { columnClass = 'grid-cols-6' }
  else if (penta?.blocks.length === 8)  { columnClass = 'grid-cols-6' }
  else if (penta?.blocks.length === 9)  { columnClass = 'grid-cols-6' }
  else if (penta?.blocks.length === 10) { columnClass = 'grid-cols-6' }
  else if (penta?.blocks.length === 11) { columnClass = 'grid-cols-6' }
  else if (penta?.blocks.length === 12) { columnClass = 'grid-cols-6' }

  const classes = ["mt-10", "grid", "items-center", "justify-center", columnClass]

  // a handler to allow for clicking a block to make it the activeBlock
  function blockClickHandler(block: string) {
    const index = penta?.blocks.findIndex((b) => b.id === block)
    setActiveBlock(index)
  }


  function solvedCallback() {
    if (!penta) { return }
    setCompletion.mutate({
      id: penta?.id || '',
    })
  }


  const returnClasses = ["btn", "btn-circle", "btn-md", penta?.completed ? "btn-secondary" : "btn-primary"]

  return (
    <>

      <main>
        <HeaderContent />
        <div>
          <Penta solvedCallback={solvedCallback} penta={penta} confetti={true}></Penta>
        </div>
        
        {penta &&
          <div className="w-screen">
            <div className="m-auto relative w-fit h-[100px]">
              <div className="absolute left-[-270px] top-[8px] drop-shadow-lg">
                <Link href='/pentas' className={returnClasses.join(" ")}>
                    <ImExit size={20} style={{ color: "#ffffff" }} />
                </Link>
              </div>

              <ControlButton
                position="absolute right-[150px] top-[0px] drop-shadow-lg"
                classes="btn gap-2 m-2 btn-primary text-white"
                clickHandler={keyQ}
                icon={<BsArrowLeft size={20} style={{ color: "#ffffff" }} />}
                letter="Q"
                ></ControlButton>

              <ControlButton
                position="absolute right-[90px] top-[0px] drop-shadow-lg"
                classes={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                clickHandler={keyW}
                icon={flipIcon}
                letter="W"
              ></ControlButton>

              <ControlButton
                position="absolute right-[30px] top-[0px] drop-shadow-lg"
                classes="btn gap-2 m-2 btn-primary text-white"
                clickHandler={keyE}
                icon={<BsArrowRight size={20} style={{ color: "#ffffff" }} />}
                letter="E"
              ></ControlButton>

              <ControlButton
                position="absolute right-[135px] top-[55px] drop-shadow-lg"
                classes={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                clickHandler={keyA}
                icon={<RiFilePaperLine size={20} style={{ color: "#ffffff" }} />}
                letter="A"
              ></ControlButton>

              <ControlButton
                position="absolute right-[75px] top-[55px] drop-shadow-lg"
                classes={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined ? "" : " btn-disabled")}
                clickHandler={keyS}
                icon={visibilityIcon}
                letter="S"
              ></ControlButton>

              <ControlButton
                position="absolute right-[15px] top-[55px] drop-shadow-lg"
                classes={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                clickHandler={keyD}
                icon={<AiOutlineRotateRight size={20} style={{ color: "#ffffff" }} />}
                letter="D"
              ></ControlButton>

              <ControlButton
                position="absolute left-[80px] top-[0px] drop-shadow-lg"
                classes={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                clickHandler={keyUp}
                icon={<BsArrowBarUp size={20} style={{ color: "#ffffff" }} />}
              ></ControlButton>

              <ControlButton
                position="absolute left-[20px] top-[55px] drop-shadow-lg"
                classes={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                clickHandler={keyLeft}
                icon={<BsArrowBarLeft size={20} style={{ color: "#ffffff" }} />}
              ></ControlButton>

              <ControlButton
                position="absolute left-[80px] top-[55px] drop-shadow-lg"
                classes={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                clickHandler={keyDown}
                icon={<BsArrowBarDown size={20} style={{ color: "#ffffff" }} />}
              ></ControlButton>

              <ControlButton
                position="absolute left-[140px] top-[55px] drop-shadow-lg"
                classes={"btn gap-2 m-2 btn-primary text-white" + (activeBlock !== undefined && penta?.blocks[activeBlock]!.visible ? "" : " btn-disabled")}
                clickHandler={keyRight}
                icon={<BsArrowBarRight size={20} style={{ color: "#ffffff" }} />}
              ></ControlButton>

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