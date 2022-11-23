import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const blockRouter = router({

  saveMove: protectedProcedure
    .input(z.object({
      blockId: z.string(),
      currentTransformation: z.object(
        {
          // key-value pairs not included here are NOT available below, which is actually
          // useful for fields which have a default like 'createdAt' or 'id'
          reflection: z.boolean(),
          rotation: z.number(),
          translationUp: z.number(),
          translationRight: z.number(),
          visible: z.boolean()
        }
      )
    }))
    .mutation(async ({ ctx, input }) => {
      // create a new transformation
      // update the block to point to it
      // create a new move
      const block = await ctx.prisma.block.findUnique({
        where: {
          id: input.blockId
        }
      })

      if (block == null) { return }

      const newTransformation = await ctx.prisma.transformation.create({
        data: input.currentTransformation
      })

      await ctx.prisma.block.update({
        where: {
          id: input.blockId
        },
        data: {
          transformation: { connect: { id: newTransformation.id } }
        }
      })

      await ctx.prisma.move.create({
        data: {
          penta: { connect: { id: block.pentaId } },
          block: { connect: { id: block.id } },
          incomingTransformation: { connect: { id: block.transformationId } },
          outgoingTransformation: { connect: { id: newTransformation.id } }
        }
      })
    })
})
