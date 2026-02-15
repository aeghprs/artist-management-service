import bcrypt from "bcryptjs";
import { query, queryOne } from "../config/db";
import { IUpdateUser } from "../schemas/auth.schemas";
import { PaginatedResponse } from "../types/pagination.types";
import { IUser } from "../types/user.types";
import { AppError } from "../utils/errorHandler";
import { User } from "./auth.services";

class UserService {
  public async getAllUser(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<IUser>> {
    const offset = (page - 1) * limit;

    const countResult = await queryOne<{ total: string }>(
      "SELECT COUNT(*) as total FROM users WHERE is_active = $1",
      [true],
    );

    const total = Number(countResult?.total ?? 0);

    const artists = await query<IUser>(
      `SELECT id, first_name, last_name, email, phone, dob, gender, address, role 
             FROM users
      WHERE is_active = $3
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset, true],
    );

    return {
      data: artists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getUserById(id: string): Promise<User | null> {
    const result = await queryOne<User>(
      `SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at 
           FROM users WHERE id = $1 AND is_active = $2`,
      [id, true],
    );

    if (!result) throw new AppError("User not found for given id", 404);

    return result;
  }

  public async getUserForArtistRole() {
    const result = await query<User>(
      `SELECT u.id, u.first_name, u.last_name
FROM users u
WHERE u.role = 'artist' and is_active = $1
  AND NOT EXISTS (
    SELECT 1
    FROM artists a
    WHERE a.user_id = u.id and is_active = $2
  );`,
      [true, true],
    );

    return result;
  }

  public async updateUser(
    id: string,
    userData: IUpdateUser,
  ): Promise<User | null> {
    const existingUser = await queryOne<User>(
      "SELECT id FROM users WHERE id = $1 AND is_active = $2",
      [id, true],
    );
    if (!existingUser) throw new AppError("User not found for given id", 404);

    if (userData.email) {
      const emailExists = await queryOne<User>(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [userData.email, id],
      );

      if (emailExists)
        throw new AppError("Email already in use by another artist", 400);
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.first_name) {
      updates.push(`first_name = $${paramCount++}`);
      values.push(userData.first_name);
    }
    if (userData.last_name) {
      updates.push(`last_name = $${paramCount++}`);
      values.push(userData.last_name);
    }
    if (userData.email) {
      updates.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      updates.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
    }
    if (userData.phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(userData.phone || null);
    }
    if (userData.dob !== undefined) {
      updates.push(`dob = $${paramCount++}`);
      values.push(userData.dob || null);
    }
    if (userData.gender) {
      updates.push(`gender = $${paramCount++}`);
      values.push(userData.gender);
    }
    if (userData.address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      values.push(userData.address || null);
    }
    if (userData.role) {
      updates.push(`role = $${paramCount++}`);
      values.push(userData.role);
    }

    if (updates.length === 0)
      throw new AppError("No valid fields provided for update", 400);

    values.push(id);
    await query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramCount}`,
      values,
    );

    return this.getUserById(id);
  }

  public async deleteUser(id: string): Promise<boolean> {
    const result = await queryOne<User>(
      "SELECT id FROM users WHERE id = $1 AND is_active = $2",
      [id, true],
    );
    if (!result) throw new AppError("User not found for given id", 404);

    await query("UPDATE users SET is_active = $1 WHERE id = $2", [false, id]);
    return true;
  }
}

export default UserService;
