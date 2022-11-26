/* eslint-disable padded-blocks */
/* eslint-disable no-multiple-empty-lines */
import React, { useState, createContext, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import Penta from '../components/Penta'
import { type Prisma } from '@prisma/client'
import { type NextPage } from 'next'
import { useDebounceCallback } from '@react-hook/debounce'
import Confetti from 'react-confetti'
import { useTimeoutWhen } from 'rooks'
import useWindowSize from 'react-use/lib/useWindowSize'
import _ from 'lodash'

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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setActiveBlock: () => {}, // these are not types, they are non-op functions
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refetchPenta: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPenta: () => {},
  isReplay: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsReplay: () => {}

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
    { id: String(query.id) }, // what we're looking for
    { enabled: isReplay } // when we're to look for it
  )

  // In an ideal world, you'd check to see that the DB state and the app state match after every mutation.
  // Instead, we call on this debouncedPentaRefetch every time we make a mutation, but then debounce it.
  // This will cause our state to get checked against the DB 4 seconds after the last move and reset that
  // timer if the user moves again.
  //
  // ! 💀 😢
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const debouncedPentaRefetch = useDebounceCallback(pentaRefetch, 4000, false)

  const [penta, setPenta] = useState(pentaRecord)

  useEffect(() => {
    setPenta(pentaRecord)
  }, [pentaRecord])

  const [activeBlock, setActiveBlock] = useState<number | undefined>()
  const gameContext = { setActiveBlock, setPenta, refetchPenta: debouncedPentaRefetch, isReplay, setIsReplay }

  useEffect(() => {
    console.log('isReplay: ', isReplay)
    if (isReplay) {
      pentaHistoryRefetch().catch((err) => console.error(err))
    }
  }, [isReplay, pentaHistoryRefetch])



  const [historyIndex, setHistoryIndex] = useState(0)
  const [previousHistoryIndex, setPrevHistoryIndex] = useState<number | undefined>()

  useEffect(() => {
    if (pentaHistoryRecord == null) return
    const workingPenta = _.cloneDeep(penta)
    if (workingPenta == null) return
    console.log('📚 historyIndex: ', historyIndex)
    console.log('📚 previousHistoryIndex: ', previousHistoryIndex)
    const block = pentaHistoryRecord.moves[historyIndex]?.block.id
    let move = pentaHistoryRecord.moves[historyIndex]?.outgoingTransformation
    // if ((previousHistoryIndex != null) && previousHistoryIndex > historyIndex) { move = pentaHistoryRecord.moves[historyIndex]?.incomingTransformation }
    if (move == null) return
    const blockIndex = workingPenta?.blocks.findIndex((workingBlock) => workingBlock.id === block)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    workingPenta.blocks[blockIndex]!.transformation = move
    setPenta(workingPenta)
    setPrevHistoryIndex(historyIndex)
  }, [historyIndex, pentaHistoryRecord])

  useEffect(() => {
    if (pentaHistoryRecord == null) return
    console.log('pentaHistoryRecord: ', pentaHistoryRecord)
  }, [pentaHistoryRecord])

  const throttledWheelHandler = useMemo(
    () => _.throttle((event: React.WheelEvent) => {
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
    , [historyIndex, pentaHistoryRecord])







  if (penta == null) {
    return <></>
  }

  function completed () {
    if (penta == null) { return }
    setShowConfetti(true)
    setComplete.mutate({ id: penta.id })
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
            <Penta penta={penta} completed={completed}></Penta>
          </div>
          <Controls penta={penta} activeBlock={activeBlock}></Controls>
          <Blocks penta={penta} activeBlock={activeBlock}></Blocks>
        </div>
      </pentaContext.Provider>
    </>
  )
}

export default PentaPage
