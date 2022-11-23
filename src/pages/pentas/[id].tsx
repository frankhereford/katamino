import React, { useState, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { trpc } from '../../utils/trpc'
import Penta from '../components/Penta'
import { type Prisma } from '@prisma/client'
import { type NextPage } from 'next'

import Controls from '../components/Controls'
import Blocks from '../components/Blocks'

interface setPentaType {
  setActiveBlock: (block: number) => void
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
}

export const pentaContext = createContext<setPentaType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setActiveBlock: () => {}, // these are not types, they are non-op functions
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPenta: () => {}
})

const PentaPage: NextPage = () => {
  // access to the router to get the ID out of the URL
  const { query, isReady: routerReady } = useRouter()

  // query the penta in question and grab a function to trigger a refetch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: pentaRecord, refetch: pentaRefetch } = trpc.penta.get.useQuery(
    { id: String(query.id) }, // what we're looking for
    { enabled: routerReady } // when we're to look for it
  )

  const [penta, setPenta] = useState(pentaRecord)

  useEffect(() => {
    setPenta(pentaRecord)
  }, [pentaRecord])

  const [activeBlock, setActiveBlock] = useState<number | undefined>()
  const gameContext = { setActiveBlock, setPenta }

  if (penta == null) {
    return <></>
  }

  return (
    <>
      <pentaContext.Provider value={gameContext}>
        <Penta penta={penta}></Penta>
        <Controls penta={penta} activeBlock={activeBlock}></Controls>
        <Blocks penta={penta} activeBlock={activeBlock}></Blocks>
      </pentaContext.Provider>
    </>
  )
}

export default PentaPage
