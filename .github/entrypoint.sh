#!/bin/ash

# Number of retries
MAX_RETRIES=3
WAIT_SECONDS=5
COUNT=0

# Install dependencies
yarn

# Retry migration
until yarn migrate:up; do
  COUNT=$((COUNT + 1))
  if [ "$COUNT" -ge "$MAX_RETRIES" ]; then
    echo "Migration failed after $MAX_RETRIES attempts."
    exit 1
  fi
  echo "Migration failed. Retrying in $WAIT_SECONDS seconds... (Attempt $COUNT/$MAX_RETRIES)"
  sleep $WAIT_SECONDS
done

# Start the app
npx tsx src/index.ts
