#!/bin/sh
set -e
if [ "${SKIP_DB_PUSH:-}" != "1" ]; then
  echo "Applying Prisma schema to database (db push)..."
  npx prisma db push --skip-generate
fi
exec "$@"
