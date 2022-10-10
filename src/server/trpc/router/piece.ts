import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const pieceRouter = t.router({
  get: authedProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      const piece = await ctx.prisma.piece.findUnique({
        where: {
          id: input.id,
        }
      })
      return {
        piece: piece
      }
    }),
  set: authedProcedure
    .input(z.object({ color: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      //console.log(ctx)
      //console.log(input)
      const piece = await ctx.prisma.piece.create({
        data: {
          color: input.color,
          shape: ['one', 'two'],
          userId: ctx.session.user.id
        },
      })
      return { piece: piece}
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.piece.findMany();
  }),
});
