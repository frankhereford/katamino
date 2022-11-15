import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const pentaRouter = router({

  setComplete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const penta = await ctx.prisma.penta.update({
        where: {
          id: input.id
        },
        data: {
          completed: true
        }
      });
      return penta;
    }),

  getCompleted: protectedProcedure
    .query(async ({ ctx }) => {
      const pentas = await ctx.prisma.penta.findMany({
        select: {
          id: true,
        },
        where: {
          completed: true
        }
      });
      return pentas;
    }),

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
          orderBy: {
            id: "asc"
          }
        }
      },
      orderBy: {
        id: "asc"
      }
    })
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