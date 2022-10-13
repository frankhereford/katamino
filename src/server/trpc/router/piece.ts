import { t, authedProcedure } from "../trpc";
import { z } from "zod";
import nj from "numjs"


export const pieceRouter = t.router({
  list: authedProcedure
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.piece.findMany({});
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
    .input(z.object({ color: z.string().nullish(), shape: z.any() }).nullish())
    .mutation(async ({ ctx, input }) => {
      //console.log(ctx)
      console.log(input)
      const shape = nj.zeros([5,5])
      const piece = await ctx.prisma.piece.create({
        data: {
          color: input.color,
          shape: input.shape,
          userId: ctx.session.user.id,
        },
      });
      return piece;
    }),

  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.piece.findMany();
  }),

});
