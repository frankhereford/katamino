import { t } from "../trpc";
import { z } from "zod";

export const colorRouter = t.router({
  
  list: t.procedure
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.color.findMany({});
    }),

  get: t.procedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      const color = await ctx.prisma.color.findUnique({
        where: {
          id: input.id,
        }
      });
      return color;
    }),

});
