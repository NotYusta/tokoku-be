#!/bin/ash
yarn
yarn migrate:up
npx tsx src/index.ts