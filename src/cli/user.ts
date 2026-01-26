#!/usr/bin/env node
import { Command } from "commander";
import { createUser } from "../scripts/createUser.js";
import { deleteUser } from "../scripts/deleteUser.js";
import UserModel from "../models/user.js";

const program = new Command();

program.name("user-cli").description("User management CLI").version("0.1.0");

// Create user
program
  .command("create")
  .description("Create a new user")
  .requiredOption("-e, --email <email>", "User email")
  .requiredOption("-p, --password <password>", "User password")
  .option("-n, --name <name>", "User name")
  .option("--admin", "Set user as admin") // <- added isAdmin option
  .action(async (opts) => {
    const isAdmin = !!opts.admin; // convert to boolean
    await createUser(opts.email, opts.password, isAdmin, opts.name);
  });

// Delete user
program
  .command("delete")
  .description("Delete a user by email or ID")
  .requiredOption("-i, --identifier <identifier>", "User email or ID")
  .action(async (opts) => {
    const idOrEmail = isNaN(Number(opts.identifier))
      ? opts.identifier
      : Number(opts.identifier);
    await deleteUser(idOrEmail);
  });

// List all users
program
  .command("lists")
  .description("List all users")
  .action(async () => {
    const users = await UserModel.findAll();
    if (users.length === 0) {
      console.log("No users found.");
      return;
    }
    console.table(
      users.map((u) => ({
        ID: u.id,
        Email: u.email,
        Name: u.name,
        IsAdmin: u.isAdmin, // <- show admin status
        CreatedAt: u.createdAt.toISOString(),
      })),
    );
  });

program.parse(process.argv);
