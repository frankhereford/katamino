import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const pentaRouter = router({

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
    return await ctx.prisma.penta.findFirst({
      where: {
        user: ctx.session.user,
        id: input.id
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