import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const pieceRouter = t.router({
  list: authedProcedure
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.piece.findMany({
        include: { color: true },
      });
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

  create: authedProcedure
    .input(z.object({ colorId: z.any(), shape: z.any() }).nullish())
    .mutation(async ({ ctx, input }) => {
      console.log("input: ", input)
      const piece = await ctx.prisma.piece.create({
        data: {
          colorId: input.colorId,
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
