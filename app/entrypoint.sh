#!/bin/sh
set -e

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Checking if database needs seeding..."
NEEDS_SEED=$(node -e "
const { PrismaClient } = require('.prisma/client');
const p = new PrismaClient();
p.color.count()
  .then(c => { console.log(c === 0 ? 'yes' : 'no'); p.\$disconnect(); })
  .catch(() => { console.log('yes'); p.\$disconnect(); });
")

if [ "$NEEDS_SEED" = "yes" ]; then
  echo "Seeding database..."
  node prisma/seed.js
  echo "Seeding complete."
else
  echo "Database already seeded, skipping."
fi

echo "Starting Next.js..."
exec node server.js
