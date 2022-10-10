// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { pieceRouter } from "./piece";
import { authRouter } from "./auth";

export const appRouter = t.router({
  piece: pieceRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
