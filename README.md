# Stuff I learned

* 🌼 Daisy UI
  * [Extendable](https://github.com/frankhereford/katamino/blob/main/tailwind.config.cjs#L5-L10)
* 💨 Tailwind CSS
  * Bootstrap but mega-🍄
  * Closely watch the animation on https://tailwindcss.com/, it's not an exaggeration
* 🌈 Prisma
  * TypeScript Safe Apollo but with [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery)
  * Prisma schema language
  * Prototyping `prisma db push`
  * Migrations
* 🌱 Database Seeding
  * ♻️ Idempotent seeding operation
* 🚀 CI
  * CI new deploy preview per PR
    * Railway DB per PR
      * With cleanup
  * GitHub PR comments from actions
    * Includes link to deploy & DB connection credentials
  * 1-2 minute deploys
  * All the check marks, build-tests & environments ✨
* 🧩 Migrations
* 🏂 Lambdas
  * https://vercel.com/docs/concepts/functions/serverless-functions
    * ♾️ Infinitely scalable, z-e-r-o work
  * No middleware, no `graphql-engine`
    * No query languages (graphql, SQL)
* 🤖 Vercel (optimization, CDN, etc)
  * 📈 Meaningful analytics
* 🔑 Auth0
  * Wildcard domain login, works on every step, same pool of users (or not!, just as easy)
* ⌨️ TypeScript
* 🔺 NextJS
* 🔭 tRPC
  * The backend is a set of functions you write in javascript
    * They take arguments and return something, just like normal
    * The type of the arguments and the return value are type inferred
      * 🪄 The /functions/ define the API, no extra work
* 🚄 Railway DBs
  * Dev DB per Developer, not local
    * Back to just running `npx next dev` or `npm start dev`
    * Just need a `.env` file with your `DATABASE_URL` configured it in
* 🤑 Cheap!  
  * Free tiers are generous (Vercel & Railway), pay-per-compute after that
* 🐛 VSCode debugging