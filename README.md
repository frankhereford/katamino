# Stuff I learned

* 🧘 Release to main
  * Works great for this project
  * Is that a comment on a solo project?
* 🤖 GitHub actions
  * dependabot combiner
  * Build prod/pr with respect to migrations
  * dependabot config
  * codeQL analysis
  * default labels on PR
  * label driven automatic versioning 🔥
    * automatic releases
* 🏷️ GitHub release tags; we should bump versions on every PR via PR labels
  * Via: <https://github.com/marketplace/actions/tag-release-on-push-action>
* 🌼 Daisy UI
  * [Extendable](https://github.com/frankhereford/katamino/blob/main/tailwind.config.cjs#L5-L10)
* 💨 Tailwind CSS
  * Bootstrap but mega-🍄
  * Closely watch the animation on <https://tailwindcss.com/>, it's not an exaggeration
* 🌈 Prisma
  * TypeScript Safe Apollo but with [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery)
  * Generated library specific to your schema with all the typing information in it, so your IDE goes brrr. 💪
  * 🔬 `prisma studio`
* 🧩 Migrations
  * Migrations
    * If a change can't be applied (such as adding a non-null constraint on a column with null values, for example), it will walk you through your options
    * Migrations are a file of SQL which explicitly control the change, like usual
    * No down.sql migrations (unless you want them)
    * Non-breaking changes require zero SQL authorship
      * Complex or breaking changes (like the not-null example above), give you SQL and let you decide how to handle it
      * Squash multiple migrations in a feature-branch into one for the merge
    * This is still an unforgiving, complex problem, but it's so helpful to have tooling for it
  * Prisma schema language
    * 😔 Views are [not supported](https://github.com/prisma/prisma/issues/678) out of the box, yet
  * Prototyping `prisma db push`
* 🌱 Database Seeding
  * ♻️ Idempotent seeding operation
* 🚀 CI
  * New deploy preview per PR
    * Railway DB per PR
      * With cleanup
    * Easy to hook up local instance to a PR's database (or staging)
  * GitHub PR comments from actions
    * Includes link to deploy & DB connection credentials
  * 1-2 minute deploys
  * All the check marks, build-tests & environments ✨
* 🏂 Lambdas
  * <https://vercel.com/docs/concepts/functions/serverless-functions>
    * ♾️ Infinitely scalable, z-e-r-o work
  * No middleware, no `graphql-engine`
    * No query languages (GraphQL, SQL)
* 🤖 Vercel (optimization, CDN, etc)
  * 📈 Meaningful analytics
* 🔑 Auth0
  * Wildcard domain login, works on every deployment (prod → local), same pool of users (or not!, just as easy)
* ⌨️ TypeScript
* 🔺 NextJS
* 🔭 tRPC
  * The backend is a set of functions you write in JavaScript
    * They take arguments and return something, just like normal
    * The type of the arguments and the return value are type inferred
      * 🪄 The /functions/ define the API, no extra work
    * 🧙‍♀️ Automagic swagger compliant REST API with [trpc-openapi](https://github.com/jlalmes/trpc-openapi)
* 🚄 Railway DBs
  * Dev DB per Developer, not local
    * Back to just running `npx next dev` or `npm start dev`
    * Just need a `.env` file with your personal `DATABASE_URL` configured it in
  * ☁️ Not a requirement; totally fine to keep production DB on AWS with strong protections
* 💀 Dependabot
  * Has [config](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
* 🤑 Cheap!
  * Free tiers are generous (Vercel & Railway), pay-per-compute after that
* 🐛 VSCode debugging


## Secrets

The repository has the following secrets defined for its actions and
integrations. Notable are the auth related ones (GitHub & Auth0 below) which are
dependent on which OAuth provider you choose to use with NextAuth. I'm not 100%
sure they are all required anymore. The app isn't built on the GitHub action
image, it's on Vercel. Railway generates the secrets, and does not have any
input secrets for itself.

### GitHub Action Secrets

```bash
AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET
AUTH0_ISSUER
DATABASE_URL
GH_FINEGRAIN_TOKEN
GH_ID
GH_PAT
GH_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
RAILWAY_CONFIG
RAILWAY_PROJECT_ID
RAILWAY_TOKEN
VERCEL_CONFIG
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VERCEL_TOKEN
```

### Vercel Deployment Secrets

```bash
DATABASE_URL
GITHUB_SECRET
GITHUB_ID
AUTH0_CLIENT_SECRET
AUTH0_ISSUER
AUTH0_CLIENT_ID
NEXTAUTH_SECRET
```
