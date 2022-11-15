import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

import { isBlockOwner } from "../../../utils/database";

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
      return block;
    }),


});