# Stuff I learned

* 🌼 Daisy UI
  * [Extendable](https://github.com/frankhereford/katamino/blob/main/tailwind.config.cjs#L5-L10)
* 💨 Tailwind CSS
  * Bootstrap but mega-🍄
  * Closely watch the animation on https://tailwindcss.com/, it's not an exaggeration
* 🌈 Prisma
  * TypeScript Safe Apollo but with [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery)
  * prisma schema language
  * prototyping `prisma db push`
  * migrations
* 🌱 Database Seeding
  * ♻️ Idempotent seeding operation
* 🚀 CI
  * CI new deploy preview per PR
    * Railway DB per PR
      * With cleanup
  * GitHub PR comments from actions
    * Includes link to deploy & DB connection credentials
  * 1-2 minute deploys
  * All the check marks, build tests & now environments
* 🧩 Migrations
* 🏂 Lambdas
  * https://vercel.com/docs/concepts/functions/serverless-functions
    * ♾️ Infinitely scalable, z-e-r-o work
  * No middleware, no `graphql-engine`
    * No query languages (graphql, SQL)
* 🤖 Vercel (optimization, CDN, etc)
  * 📈 Meaningful analytics
* 🔑 Auth0
  * auth0 wildcard domain login, works on every step, same pool of users (or not!, just as easy)
* ⌨️ TypeScript
* 🔺 NextJS
* 🔭 tRPC
  * The backend is functions you write in javascript
    * They take arguments and return something, just like normal
    * The type of the arguments and the return value are type inferred
      * The /function/ defines the api, no extra work
* 🚄 Railway DBs
  * Dev DB per Developer, not local
    * back to just running `npx next dev` or `npm start dev`
    * just need a `.env` file with your `DATABASE_URL` configured it in
* 🤑 Cheap!  
  * Free tier is generous, pay-per-compute after that
* 🐛 VSCode debugging