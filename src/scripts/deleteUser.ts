// src/scripts/deleteUser.ts
import { UserModel } from "../models/user.js"; // adjust path if needed

/**
 * Delete a user by email or ID
 * @param identifier - Email or ID of the user to delete
 */
export async function deleteUser(identifier: string | number) {
  try {
    let user;

    if (typeof identifier === "number") {
      user = await UserModel.findByPk(identifier);
    } else {
      user = await UserModel.findOne({ where: { email: identifier } });
    }

    if (!user) {
      console.error("❌ User not found");
      return null;
    }

    await user.destroy();
    console.log(`✅ User deleted: ID=${user.id}, Email=${user.email}`);
    return user;
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    throw err;
  }
}
