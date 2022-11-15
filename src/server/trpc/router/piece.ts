import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const pieceRouter = router({

  randomPiece: publicProcedure
    .query(async ({ ctx }) => {
      const pieces = await ctx.prisma.piece.findMany({ include: { color: true } })
      // select a random piece from pieces array
      const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
      return randomPiece
    }),

  getPiece: publicProcedure
    .input(z.object({ id: z.string().optional() }).nullish())
    .query(async ({ ctx, input }) => {
      const piece = await ctx.prisma.piece.findUnique({
        where: {
          id: input?.id
        },
        include: {
          color: true
        }
      })
      return piece
    }),

});