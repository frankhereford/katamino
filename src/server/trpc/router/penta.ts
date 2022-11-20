import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { isPentaOwner } from '../../../utils/database'

export const pentaRouter = router({

  setComplete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pentaOriginal = await ctx.prisma.penta.findUnique({
        where: {
          id: input.id
        }
      })

      if (!isPentaOwner(pentaOriginal, ctx.session.user.id)) { return false }

      const penta = await ctx.prisma.penta.update({
        where: {
          id: input.id
        },
        data: {
          completed: true
        }
      })
      return penta
    }),

  // 🔥 This is a powerful pattern
  getCompleted: protectedProcedure
    .query(async ({ ctx }) => {
      const pentas = await ctx.prisma.penta.findMany({
        include: {
          availablePenta: true
        },
        where: {
          completed: true,
          userId: ctx.session.user.id
        }
      })
      return pentas.map((penta) => penta.availablePenta.id)
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
              id: 'asc'
            }
          }
        },
        orderBy: {
          id: 'asc'
        }
      })
    }),

  count: protectedProcedure.query(async ({ ctx }) => {
    const pentas = await ctx.prisma.penta.findMany({
      where: {
        user: ctx.session.user
      }
    })
    return pentas.length
  }),

  getAll: protectedProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.penta.findMany({
        skip: (input.page) * input.perPage,
        take: input.perPage,
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
            }
          }
        },
        orderBy: {
          id: 'asc'
        }
      })
    })

})
