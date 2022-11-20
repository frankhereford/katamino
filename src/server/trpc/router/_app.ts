import { router } from '../trpc'
import { authRouter } from './auth'
// import { exampleRouter } from './example'
import { colorRouter } from './color'
import { pieceRouter } from './piece'

export const appRouter = router({
  piece: pieceRouter,
  color: colorRouter,
  auth: authRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
