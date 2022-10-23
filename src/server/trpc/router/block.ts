import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const blockRouter = t.router({
  list: authedProcedure
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.block.findMany({
        // this should filter on user id - any many other places!
        include: {
          piece:   {
            include: {
              color: true
            }
          }
        }
      });
    }),

  get: authedProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      const block = await ctx.prisma.block.findUnique({
        where: {
          id: input.id,
        }
      });
      return block;
    }),

  set_transformation: authedProcedure
    .input(z.object({ id: z.string(), transformation: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const penta = await ctx.prisma.block.update({
        where: {
          id: input.id,
        },
        data: {
          rotation: { clockwise: input.transformation.rotation.clockwise }
        },
      });
      return penta;
    }),

});
