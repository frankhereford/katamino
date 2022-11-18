import { router, protectedProcedure } from "../trpc";
import { z } from "zod";


export const moveRouter = router({

  get: protectedProcedure
    .input(z.object({ pentaId: z.string() }))
    .query(async ({ ctx, input }) => {

      const moves = await ctx.prisma.move.findMany({
        where: {
          pentaId: input.pentaId,
        },
        orderBy: {
          moveDate: "asc",
        }
      })

      return moves;
    }),

});