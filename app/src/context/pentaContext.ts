import { createContext } from 'react'
import { type Prisma } from '@prisma/client'

export interface PentaContextType {
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

/* eslint-disable @typescript-eslint/no-empty-function */
export const pentaContext = createContext<PentaContextType>({
  setActiveBlock: () => {},
  refetchPenta: () => {},
  setPenta: () => {},
  isReplay: false,
  setIsReplay: () => {}
})
/* eslint-enable @typescript-eslint/no-empty-function */
