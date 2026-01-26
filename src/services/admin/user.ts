import bcrypt from "bcrypt";
import UserModel from "../../models/user.js";
import { NotFoundError } from "../../utils/handler.js";
import { AuthConstants } from "../../constants/auth.js";
import logger from "../../logger.js"; // your Pino logger instance
import type { IPagination } from "../../00_types/requests/requests.js";

class AdminUserService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminUserService.getById called");

    const user = await UserModel.findByPk(id, {
      attributes: ["id", "name", "email", "isAdmin", "createdAt", "updatedAt"],
    });

    if (!user) {
      logger.debug({ id }, "User not found in getById");
      throw new NotFoundError();
    }

    logger.debug(
      { id, user: { name: user.name, email: user.email } },
      "User found in getById",
    );
    return user;
  }

  public async getAll({ page = 1, pageSize = 20 }: IPagination = {}) {
    const offset = (page - 1) * pageSize;

    logger.debug(
      { page, pageSize, offset },
      "AdminUserService.getAll called with pagination",
    );

    const { rows: users, count: total } = await UserModel.findAndCountAll({
      attributes: ["id", "name", "email", "isAdmin", "createdAt", "updatedAt"],
      limit: pageSize,
      offset,
      order: [["id", "ASC"]],
    });

    logger.debug(
      { page, pageSize, returned: users.length, total },
      "AdminUserService.getAll completed with pagination",
    );

    return {
      users,
      pagination: {
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  // ===== CREATE =====
  public async create(data: {
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
  }) {
    logger.debug(
      { email: data.email, name: data.name },
      "AdminUserService.create called",
    );

    const passwordHash = await bcrypt.hash(
      data.password,
      AuthConstants.SALT_ROUNDS,
    );

    const user = await UserModel.create({
      name: data.name,
      email: data.email,
      passwordHash,
      isAdmin: data.isAdmin ?? false,
    });

    logger.debug({ id: user.id }, "AdminUserService.create completed");
    return user;
  }

  // ===== UPDATE =====
  public async update(
    id: number,
    data: Partial<{
      name: string;
      email: string;
      password: string;
      isAdmin: boolean;
    }>,
  ) {
    logger.debug({ id, data }, "AdminUserService.update called");

    const user = await UserModel.findByPk(id);
    if (!user) {
      logger.debug({ id }, "User not found in update");
      throw new NotFoundError();
    }

    const updateData: any = { ...data };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(
        data.password,
        AuthConstants.SALT_ROUNDS,
      );
      delete updateData.password;
    }

    await user.update(updateData);

    logger.debug({ id }, "AdminUserService.update completed");
    return user;
  }

  // ===== DELETE =====
  public async delete(id: number) {
    logger.debug({ id }, "AdminUserService.delete called");

    const user = await UserModel.findByPk(id);
    if (!user) {
      logger.debug({ id }, "User not found in delete");
      throw new NotFoundError();
    }

    await user.destroy();
    logger.debug({ id }, "AdminUserService.delete completed");

    return { success: true };
  }
}

const adminUserService = new AdminUserService();
export default adminUserService;
