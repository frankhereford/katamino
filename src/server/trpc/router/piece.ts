import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const pieceRouter = t.router({
  get: authedProcedure
    .input(z.object({ color: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        shape: [],
      }
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.piece.findMany();
  }),
});
