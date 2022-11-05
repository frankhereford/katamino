import { Color } from '@prisma/client'
import { router, publicProcedure } from "../trpc";

export const colorRouter = router({

  randomColor: publicProcedure
    //.input(z.object({ text: z.string().nullish() }).nullish())
    .query(async ({ ctx }) => {
      const randomColors = await ctx.prisma.$queryRaw<Color[]>`SELECT * FROM colors order by random() limit 1;`;
      return randomColors[0]
    }),

});