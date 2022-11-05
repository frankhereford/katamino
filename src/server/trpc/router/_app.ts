import { router } from "../trpc";
import { authRouter } from "./auth";
import { colorRouter } from "./color";

export const appRouter = router({
  //example: exampleRouter,
  color: colorRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
