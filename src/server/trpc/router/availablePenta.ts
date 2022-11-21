import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'

export const availablePentaRouter = router({

  start: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const availablePentaObject = await ctx.prisma.availablePenta.findUnique({
        where: {
          id: input.id
        },
        include: {
          availableBlocks: {
            include: {
              piece: {
                include: {
                  color: true
                }
              }
            }
          }
        }

      })

      if (availablePentaObject == null) { return false }

      await ctx.prisma.penta.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          availablePenta: { connect: { id: availablePentaObject.id } },
          columns: availablePentaObject.columns,
          borderWidth: 2,
          blocks: {
            create: availablePentaObject.availableBlocks.map((availableBlock) => {
              return {
                piece: { connect: { id: availableBlock.piece.id } },
                transformation: {
                  create: {
                    visible: false
                  }
                }
              }
            })
          }
        }
      })
    }),

  count: publicProcedure.query(async ({ ctx }) => {
    const pentas = await ctx.prisma.availablePenta.findMany()
    return pentas.length
  }),

  getAll: publicProcedure
    .input(z.object({ page: z.number(), perPage: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.availablePenta.findMany({
        skip: (input.page) * input.perPage,
        take: input.perPage,
        include: {
          availableBlocks: {
            include: {
              piece: {
                include: {
                  color: true
                }
              }
            }
          },
          slam: true
        },
        orderBy: [{ slam: { slamOrder: 'asc' } }, { rowName: 'asc' }, { columns: 'asc' }]
      })
    })

})
