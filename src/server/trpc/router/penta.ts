import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const pentaRouter = t.router({
  list: authedProcedure
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.penta.findMany({
      });
    }),

  get: authedProcedure
    .input(z.object({ id: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      const penta = await ctx.prisma.penta.findUnique({
        where: {
          id: input.id,
        }
      });
      return penta;
    }),

  create: authedProcedure
    .input(z.object({ blocks: z.any(), columns: z.number() }).nullish())
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const penta = await ctx.prisma.penta.create({
        data: {
          columns: input.columns,
          userId: ctx.session.user.id,
          blocks: {
            create: input.blocks.map((block) => {
              return {
                pieceId: block,
                translation: {},
                rotation: {},
                reflection: false,
              }
            }),
          },
        },
      });
      return penta;
    }),

});
