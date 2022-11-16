import { router, protectedProcedure } from "../trpc";
import { z } from "zod";


export const moveRouter = router({

  get: protectedProcedure
    .input(z.object({ id: z.string(), clockwise: z.number() }))
    .mutation(async ({ ctx, input }) => {

      const moves = await ctx.prisma.move.findMany({
        where: {
          id: input.id
        },
      })

      return moves;
    }),

});