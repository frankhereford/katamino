// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { pieceRouter } from "./piece";
import { colorRouter } from "./color";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";

export const appRouter = t.router({
  piece: pieceRouter,
  color: colorRouter,
  auth: authRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
