import React, { useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import Penta from '../components/Penta'
import { type Prisma } from '@prisma/client'
import { type NextPage } from 'next'
import { useDebounceCallback } from '@react-hook/debounce'
import Confetti from 'react-confetti'
import { useTimeoutWhen } from 'rooks'
import useWindowSize from 'react-use/lib/useWindowSize'

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
    console.log('pentaHistoryRecord: ', pentaHistoryRecord)
  }, [isReplay, pentaHistoryIsLoading, pentaHistoryRecord])

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
        <div className='mt-[30px]'>
          <Penta penta={penta} completed={completed}></Penta>
        </div>
        <Controls penta={penta} activeBlock={activeBlock}></Controls>
        <Blocks penta={penta} activeBlock={activeBlock}></Blocks>
      </pentaContext.Provider>
    </>
  )
}

export default PentaPage
