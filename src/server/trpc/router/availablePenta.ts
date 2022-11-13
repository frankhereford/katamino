import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

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
            },
          }
        },

      });
    
      if (!availablePentaObject) { return false }
    
      const penta = await ctx.prisma.penta.create({
        data: {
          userId: ctx.session.user.id,
          columns: availablePentaObject.columns,
          blocks: {
            create: availablePentaObject.availableBlocks.map((availableBlock) => {
              return {
                piece: { connect: { id: availableBlock.pieceId }, },
                translation: {
                  up: 0,
                  right: 0
                },
                rotation: {
                  clockwise: 0
                },
                reflection: false
              }
            })
          }
        }
      })

      return penta

    }),

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
      orderBy: [{
        slamName: 'desc' // gonna need an order-by column in here as more slams come in
      }, {
        rowName: "asc"
      }, {
        columns: "asc"
      } ]
    });
  }),

});