* vercel lambda, no middleware to deploy, like none
* auth0 wildcard domain login, works on every step, same pool of users
* Dev DB per Developer, not local
  * back to just running `npx next dev` or `npm start dev`
  * db operations are `npx prisma db seed` or `npx prisma db push`
* CI new deploy preview per PR
  * Railway DB per PR
    * With cleanup
* Debugging with VSCode


* CI
* Migrations
* Lambdas
* Vercel (optimization, cdn, etc)
* Auth0
* TypeScript
* NextJS
* tRPC
* Railway DBs
* 