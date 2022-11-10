import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const availablePentaRouter = router({

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.availablePenta.findMany({
      include: {
        availableBlocks: {
          include: {
            piece: {
              include: {
                color: true
              }
            }
          },
        }
      },
      orderBy: {
        id: "asc"
      }
    });
  }),

});