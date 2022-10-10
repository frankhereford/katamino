import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const pieceRouter = t.router({
  get: authedProcedure
    .input(z.object({ id: z.number().nullish() }).nullish())
    .query(({ input }) => {
      return {
        shape: `Hello ${input?.id ?? "world"}`,
      };
    }),
});
