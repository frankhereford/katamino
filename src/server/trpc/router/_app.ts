import { router } from '../trpc'
import { authRouter } from './auth'
// import { exampleRouter } from './example'
import { blockRouter } from './block'
import { colorRouter } from './color'
import { pieceRouter } from './piece'
import { availablePentaRouter } from './availablePenta'
import { pentaRouter } from './penta'

export const appRouter = router({
  piece: pieceRouter,
  color: colorRouter,
  block: blockRouter,
  availablePenta: availablePentaRouter,
  penta: pentaRouter,
  auth: authRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
