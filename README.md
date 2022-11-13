# Stuff I learned
### ... (and I'm super stoked about)

* 🌼 Daisy UI
  * [Extendable](https://github.com/frankhereford/katamino/blob/main/tailwind.config.cjs#L5-L10)
* 💨 Tailwind CSS
  * Bootstrap but mega-🍄
  * Closely watch the animation on https://tailwindcss.com/, it's not an exaggeration
* 🌈 Prisma
  * migrations
  * prototyping `prisma db push`
* 🌱 Database Seeding
  * Idempotent seeding operation
* 🚀 CI
  * CI new deploy preview per PR
    * Railway DB per PR
      * With cleanup
  * GitHub PR comments from actions
  * 1-2 minute deploys
* 🧩 Migrations
* 🏂 Lambdas
  * https://vercel.com/docs/concepts/functions/serverless-functions
    * Infinitely scalable, zero conf
* 🤖 Vercel (optimization, CDN, etc)
* 🔑 Auth0
  * auth0 wildcard domain login, works on every step, same pool of users (or not!, just as easy)
* ⌨️ TypeScript
* 🔺 NextJS
  * vercel lambda, no middleware to deploy, like none
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
* 🐛 VSCode debugging