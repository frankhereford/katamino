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
  set: authedProcedure
    .input(z.object({ color: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      console.log(ctx)
      console.log(input)
      const piece = await ctx.prisma.piece.create({
        data: {
          color: input.color,
          shape: 'this is my shape',
          userId: ctx.session.user.id
        },
      })
      var shape = ['taco', 'beef']
      console.log(piece)
      return { shape: shape }
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.piece.findMany();
  }),
});
