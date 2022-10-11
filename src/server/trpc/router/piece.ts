import { t, authedProcedure } from "../trpc";
import { z } from "zod";
import nj from "numjs"

export const pieceRouter = t.router({
  list: authedProcedure
    .query(async ({ ctx, input }) => {
      const pieces = await ctx.prisma.piece.findMany({ });
      return pieces;
    }),

  get: authedProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      const piece = await ctx.prisma.piece.findUnique({
        where: {
          id: input.id,
        }
      });
      return piece;
    }),
  set: authedProcedure
    .input(z.object({ color: z.string().nullish() }).nullish())
    .mutation(async ({ ctx, input }) => {
      //console.log(ctx)
      //console.log(input)
      shape = nj.zeros([5,5])
      const piece = await ctx.prisma.piece.create({
        data: {
          color: input.color,
          shape: shape,
          userId: ctx.session.user.id,
        },
      });
      return piece;
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.piece.findMany();
  }),
});
