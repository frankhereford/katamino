import { t } from "../trpc";
import { z } from "zod";

export const colorRouter = t.router({
  list: t.procedure
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.color.findMany({});
    }),
});
