import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const colorRouter = router({

  randomColor: publicProcedure
    //.input(z.object({ text: z.string().nullish() }).nullish())
    .query(async ({ }) => {
      return await prisma.$queryRaw`SELECT * FROM colors order by random() limit 1;`;
      //const randomColor = await prisma.$queryRaw`SELECT * FROM colors order by random() limit 1;`;
      //console.log(randomColor)
      //return randomColor
    }),

});