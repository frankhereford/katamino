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
    * If a change can't be applied (such as adding a non-null constraint on a column with null values, for example), it will walk you through your options
  * Migrations
    * Migrations are a file of SQL which explicitly control the change
    * No down.sql migrations, non-breaking changes require zero SQL authorship
      * Complex or breaking changes (like the not-null example above), give you the SQL to decide how to handle it
* 🌱 Database Seeding
  * ♻️ Idempotent seeding operation
* 🚀 CI
  * New deploy preview per PR
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
  * Wildcard domain login, works on every deployment (prod → local), same pool of users (or not!, just as easy)
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
    * Just need a `.env` file with your personal `DATABASE_URL` configured it in
* 💀 Dependabot
  * Has [config](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
* 🤑 Cheap! 
  * Free tiers are generous (Vercel & Railway), pay-per-compute after that
* 🐛 VSCode debugging