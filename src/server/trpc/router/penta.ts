import { t, authedProcedure } from "../trpc";
import { z } from "zod";

export const pentaRouter = t.router({
  list: authedProcedure
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.penta.findMany({
        include: {
          blocks:  {
            include: {
              piece:   {
                include: {
                  color: true
                }
              }
            }
          }
        },
      });
    }),

  get: authedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("input: ", input)
      const penta = await ctx.prisma.penta.findUnique({
        where: {
          id: input.id,
        },
        include: {
          blocks: {
            include: {
              piece: {
                include: {
                  color: true
                }
              }
            }
          }
        }

      });
      return penta;
    }),

  create: authedProcedure
    .input(z.object({ blocks: z.string().array(), columns: z.number() }).nullish())
    .mutation(async ({ ctx, input }) => {
      const penta = await ctx.prisma.penta.create({
        data: {
          columns: input.columns,
          userId: ctx.session.user.id,
          blocks: {
            create: input.blocks.map((block) => {
              return {
                pieceId: block,
                translation: { up: 0, right: 0 },
                rotation: {clockwise: 0},
                reflection: {x: false, y: false},
              }
            }),
          },
        },
      });
      return penta;
    }),

});
