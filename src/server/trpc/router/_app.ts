import { router } from '../trpc'
import { authRouter } from './auth'
// import { exampleRouter } from './example'
import { colorRouter } from './color'

export const appRouter = router({
  color: colorRouter,
  auth: authRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
