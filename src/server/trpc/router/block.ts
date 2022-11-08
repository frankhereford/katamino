import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const blockRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return await ctx.prisma.block.findMany({ // this should filter on user id - any many other places!
      include: {
        piece: {
          include: {
            color: true
          }
        }
      }
    });
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const block = await ctx.prisma.block.findUnique({
        where: {
          id: input.id
        }
      });
      return block;
    }),

  set_rotation: protectedProcedure
    .input(z.object({ id: z.string(), clockwise: z.number() }))
    .mutation(async ({ ctx, input }) => {
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