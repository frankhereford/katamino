import { router, protectedProcedure } from "../trpc";
import { z } from "zod";


export const moveRouter = router({

  get: protectedProcedure
    .input(z.object({  }))
    .query(async ({ ctx, input }) => {

      const moves = await ctx.prisma.move.findMany({
      })

      return moves;
    }),

});