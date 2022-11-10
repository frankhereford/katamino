import { router } from "../trpc";
import { authRouter } from "./auth";
import { colorRouter } from "./color";
import { pieceRouter } from "./piece";
import { pentaRouter } from "./penta";
import { availablePentaRouter } from "./availablePenta";
import { blockRouter } from "./block";

export const appRouter = router({
  availablePenta: availablePentaRouter,
  penta: pentaRouter,
  block: blockRouter,
  piece: pieceRouter,
  color: colorRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
