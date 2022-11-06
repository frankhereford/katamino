import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const pentaRouter = router({

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.penta.findMany({
      where: {
        user: ctx.session.user
      },
      include: {
        blocks: {
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