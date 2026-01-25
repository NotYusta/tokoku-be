#!/usr/bin/env node
import { Command } from "commander";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { AuthConstants } from "../constants/auth.js";

const program = new Command();

program
  .name("generate-cli")
  .description("CLI to generate secrets like bcrypt hashes or JWT secrets")
  .version("0.1.0");

// ----------------------
// JWT secret generator
// ----------------------
program
  .command("jwt")
  .description("Generate a random JWT secret")
  .option("-l, --length <number>", "Length in bytes of the secret", "32")
  .action((opts) => {
    const length = parseInt(opts.length, 10);
    const secret = crypto.randomBytes(length).toString("hex");
    console.log("JWT secret:", secret);
  });

// ----------------------
// Bcrypt hash generator
// ----------------------
program
  .command("bcrypt")
  .description("Generate a bcrypt hash of a string")
  .requiredOption("-s, --string <string>", "String to hash")
  .option("-r, --rounds <number>", "Number of salt rounds", "10")
  .action((opts) => {
    const rounds = parseInt(opts.rounds, AuthConstants.SALT_ROUNDS);
    const hash = bcrypt.hashSync(opts.string, rounds);
    console.log("Bcrypt hash:", hash);
  });

program.parse(process.argv);
