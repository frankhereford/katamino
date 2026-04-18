FROM node:20-slim AS base

FROM base AS deps
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV SKIP_ENV_VALIDATION=1
RUN npx prisma generate
RUN echo '{"compilerOptions":{"module":"commonjs","esModuleInterop":true,"resolveJsonModule":true,"skipLibCheck":true,"target":"es2017","moduleResolution":"node","outDir":"prisma/compiled"},"files":["prisma/seed.ts"]}' > tsconfig.seed.json && npx tsc --project tsconfig.seed.json
RUN npm run build

FROM base AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma/compiled/seed.js ./prisma/seed.js
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Prisma CLI needed for migrate deploy at runtime
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
RUN mkdir -p ./node_modules/.bin && ln -s ../prisma/build/index.js ./node_modules/.bin/prisma
COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT ["./entrypoint.sh"]
