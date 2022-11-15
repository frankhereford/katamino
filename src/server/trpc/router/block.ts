import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

import { isBlockOwner } from "../../../utils/database";

async function saveMove(ctx: any, block: any) {
  const move = await ctx.prisma.move.create({
    data: {
      block: {
        connect: {
          id: block.id
        }
      },
      penta: {
        connect: {
          id: block.pentaId
        }
      },
      visible: block.visible,
      translation: block.translation || {},
      rotation: block.rotation || {},
      reflection: block.reflection
    }
  })
  return move
}

export const blockRouter = router({

  set_rotation: protectedProcedure
    .input(z.object({ id: z.string(), clockwise: z.number() }))
    .mutation(async ({ ctx, input }) => {

      const blockOriginal = await ctx.prisma.block.findUnique({
        where: {
          id: input.id
        },
        include: {
          penta: true
        } 
      })

      if (!isBlockOwner(blockOriginal, ctx.session.user.id)) { return false }

      const block = await ctx.prisma.block.update({
        where: {
          id: input.id
        },
        data: {
          rotation: {
            clockwise: input.clockwise ? input.clockwise : 0
          }
        }
      });

      await saveMove(ctx, block)

      return block;
    }),

  set_reflection: protectedProcedure
    .input(z.object({ id: z.string(), reflection: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      
      const blockOriginal = await ctx.prisma.block.findUnique({
        where: {
          id: input.id
        },
        include: {
          penta: true
        }
      })

      if (!isBlockOwner(blockOriginal, ctx.session.user.id)) { return false }

      const block = await ctx.prisma.block.update({
        where: {
          id: input.id
        },
        data: {
          reflection: input.reflection
        }
      });
      await saveMove(ctx, block)
      return block;
    }),

  set_translation: protectedProcedure
    .input(z.object({ id: z.string(), translation: z.any() }))
    .mutation(async ({ ctx, input }) => {
      
      const blockOriginal = await ctx.prisma.block.findUnique({
        where: {
          id: input.id
        },
        include: {
          penta: true
        }
      })

      if (!isBlockOwner(blockOriginal, ctx.session.user.id)) { return false }

      const block = await ctx.prisma.block.update({
        where: {
          id: input.id
        },
        data: {
          translation: input.translation
        }
      });
      await saveMove(ctx, block)
      return block;
    }),

  set_visibility: protectedProcedure
    .input(z.object({ id: z.string(), visible: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      
      const blockOriginal = await ctx.prisma.block.findUnique({
        where: {
          id: input.id
        },
        include: {
          penta: true
        }
      })

      if (!isBlockOwner(blockOriginal, ctx.session.user.id)) { return false }

      const block = await ctx.prisma.block.update({
        where: {
          id: input.id
        },
        data: {
          visible: input.visible ? input.visible : false
        }
      });
      await saveMove(ctx, block)
      return block;
    }),


});