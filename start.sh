#!/bin/sh
export $(grep -v '^#' .env | xargs)
npm run migrate:up
npm run dev