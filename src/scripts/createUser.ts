// src/scripts/createUser.ts
import { AuthConstants } from "../constants/auth.js";
import { UserModel } from "../models/user.js"; // adjust path if needed
import bcrypt from "bcrypt";

/**
 * Create a new user
 * @param email - User email (unique)
 * @param password - Plain text password
 * @param name - Optional display name
 */
export async function createUser(
  email: string,
  password: string,
  isAdmin: boolean,
  name?: string,
) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, AuthConstants.SALT_ROUNDS);

    // Create the user
    const user = await UserModel.create({
      email,
      passwordHash: hashedPassword,
      isAdmin: isAdmin,
      name: name || email.split("@")[0], // default name from email
    });

    console.log(`✅ User created: ID=${user.id}, Email=${user.email}, Admin=${isAdmin}`);
    return user;
  } catch (err: any) {
    if (err.name === "SequelizeUniqueConstraintError") {
      console.error("❌ Error: Email already exists");
    } else {
      console.error("❌ Error creating user:", err);
    }
    throw err;
  }
}
