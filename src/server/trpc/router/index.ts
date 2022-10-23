// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { pieceRouter } from "./piece";
import { colorRouter } from "./color";
import { pentaRouter } from "./penta";
import { blockRouter } from "./block";
import { authRouter } from "./auth";

export const appRouter = t.router({
  piece: pieceRouter,
  color: colorRouter,
  block: blockRouter,
  penta: pentaRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
