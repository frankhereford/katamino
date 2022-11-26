import React, { useState, createContext, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import { type Prisma } from '@prisma/client'
import { type NextPage } from 'next'
import { useDebounceCallback } from '@react-hook/debounce'
import Confetti from 'react-confetti'
import { useTimeoutWhen } from 'rooks'
import useWindowSize from 'react-use/lib/useWindowSize'
import _ from 'lodash'

import Penta from '../components/Penta'
import Controls from '../components/Controls'
import Blocks from '../components/Blocks'

interface pentaContextType {
  setActiveBlock: (block: number) => void
  refetchPenta: () => void
  setPenta: (penta: Prisma.PentaGetPayload<{
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
  }>) => void
  isReplay: boolean
  setIsReplay: (isReplay: boolean) => void
}

export const pentaContext = createContext<pentaContextType>({
  /* eslint-disable @typescript-eslint/no-empty-function */
  setActiveBlock: () => {}, // these are not types, they are non-op functions
  refetchPenta: () => {},
  setPenta: () => {},
  isReplay: false,
  setIsReplay: () => {}
  /* eslint-enable @typescript-eslint/no-empty-function */
})

// * React is cool and all, but I dare someone to read this and know what it does
// * without boatloads of comments.
// TODO: Comments, so many comments
const PentaPage: NextPage = () => {
  const [showConfetti, setShowConfetti] = useState(false)
  // * set the solved state (the confetti state) false after 5 seconds
  useTimeoutWhen(() => setShowConfetti(false), 5000, showConfetti)
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  const setComplete = trpc.penta.setComplete.useMutation({})

  // * access to the router to get the ID out of the URL
  const { query, isReady: routerReady } = useRouter()

  // * query the penta in question and grab a function to trigger a refetch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: pentaRecord, refetch: pentaRefetch } = trpc.penta.get.useQuery(
    { id: String(query.id) }, // what we're looking for
    { enabled: routerReady } // when we're to look for it
  )

  const [isReplay, setIsReplay] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: pentaHistoryRecord, refetch: pentaHistoryRefetch, isLoading: pentaHistoryIsLoading } = trpc.penta.getHistory.useQuery(
    { id: String(query.id) }, // * what we're looking for
    { enabled: isReplay } // * when we're to look for it
  )

  // * In an ideal world, you'd check to see that the DB state and the app state match after every mutation.
  // * Instead, we call on this debouncedPentaRefetch every time we make a mutation, but then debounce it.
  // * This will cause our state to get checked against the DB 4 seconds after the last move and reset that
  // * timer if the user moves again.
  // *
  // ! 💀 😢
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const debouncedPentaRefetch = useDebounceCallback(pentaRefetch, 4000, false)

  const [penta, setPenta] = useState(pentaRecord)

  useEffect(() => {
    setPenta(pentaRecord)
  }, [pentaRecord])

  const [activeBlock, setActiveBlock] = useState<number | undefined>()
  const gameContext = { setActiveBlock, setPenta, refetchPenta: debouncedPentaRefetch, isReplay, setIsReplay }

  // * 👇 Replay handling
  // ? This feels like it could be pulled into its own hook maybe?
  const [historyIndex, setHistoryIndex] = useState(0)
  const [previousHistoryIndex, setPrevHistoryIndex] = useState<number | undefined>()

  useEffect(() => {
    console.log('isReplay: ', isReplay)
    if (isReplay) {
      pentaHistoryRefetch().catch((err) => console.error(err))
      setHistoryIndex(0)
      setActiveBlock(undefined)
    } else {
      pentaRefetch().catch((err) => console.error(err))
    }
  }, [isReplay, pentaHistoryRecord?.moves.length, pentaHistoryRefetch, pentaRefetch])

  useEffect(() => {
    if (pentaHistoryRecord == null) return
    const workingPenta = _.cloneDeep(penta)
    if (workingPenta == null) return

    const antiHistoryIndex = pentaHistoryRecord.moves.length - historyIndex - 1
    const block = pentaHistoryRecord.moves[antiHistoryIndex]?.block.id

    let move = pentaHistoryRecord.moves[antiHistoryIndex]?.outgoingTransformation
    if ((previousHistoryIndex ?? 0) < historyIndex) { move = pentaHistoryRecord.moves[antiHistoryIndex]?.incomingTransformation }

    if (move == null) return

    const blockIndex = workingPenta?.blocks.findIndex((workingBlock) => workingBlock.id === block)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    workingPenta.blocks[blockIndex]!.transformation = move
    setPenta(workingPenta)
    setPrevHistoryIndex(historyIndex)
  // ! don't put penta in this dependency array because we take a deepClone of it
  }, [historyIndex, pentaHistoryRecord])

  const throttledWheelHandler = useMemo(
    () => _.throttle((event: React.WheelEvent) => {
      if (!isReplay) return
      if (pentaHistoryRecord == null) return
      let forward = true
      if (event.deltaY < 0) {
        forward = false
      }

      // * Put bounds on what is the valid scroll interval
      if (!forward && historyIndex === 0) return
      if (forward && historyIndex >= pentaHistoryRecord.moves.length - 1) return

      if (forward) {
        setHistoryIndex(historyIndex + 1)
      } else {
        setHistoryIndex(historyIndex - 1)
      }
    }, 250)
    // * the items in this dependency array are what are operated on or from for
    // * the wheelHandler function.
    , [historyIndex, isReplay, pentaHistoryRecord])
  // * 👆 Replay handling

  function completed () {
    if (penta == null) { return }
    // * bail out if we've already completed this penta
    if (penta.completed) { return }

    // * set our local copy of the penta to completed
    const workingPenta = _.cloneDeep(penta)
    if (workingPenta == null) return
    workingPenta.completed = true
    setPenta(workingPenta)

    setShowConfetti(true)
    setComplete.mutate({ id: penta.id })
  }

  if (penta == null) {
    return <></>
  }

  return (
    <>
      {showConfetti &&
        <Confetti
          width={windowWidth}
          height={windowHeight}
          opacity={0.5}
        />
      }
      <pentaContext.Provider value={gameContext}>
        <div onWheel={throttledWheelHandler}>
          <div className='mt-[30px]'>
            <Penta penta={penta} completed={completed} fire={penta.completed}></Penta>
          </div>
          <Controls penta={penta} activeBlock={activeBlock}></Controls>
          <Blocks penta={penta} activeBlock={activeBlock}></Blocks>
        </div>
      </pentaContext.Provider>
    </>
  )
}

export default PentaPage
