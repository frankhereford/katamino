import { type Color } from '@prisma/client'
import { router, publicProcedure } from "../trpc";

export const colorRouter = router({

  randomColor: publicProcedure
    .query(async ({ ctx }) => {
      const randomColors = await ctx.prisma.$queryRaw<Color[]>`SELECT * FROM colors order by random() limit 1;`
      return randomColors[0]
    }),

  getColorLookup: publicProcedure
    .query(async ({ ctx }) => {
      const colors = await ctx.prisma.color.findMany()

      const colorLookup = colors.reduce((acc, color) => {
        acc[color.name] = color
        return acc
      }, {} as Record<string, Color>)

      return colorLookup
    }),


});