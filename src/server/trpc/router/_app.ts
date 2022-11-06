import { router } from "../trpc";
import { authRouter } from "./auth";
import { colorRouter } from "./color";
import { pieceRouter } from "./piece";
import { pentaRouter } from "./penta";

export const appRouter = router({
  penta: pentaRouter,
  piece: pieceRouter,
  color: colorRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
