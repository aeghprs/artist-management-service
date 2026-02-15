import { query, queryOne } from "../config/db";
import { ILoginUser, IRegisterUser } from "../schemas/auth.schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { normalizeDate } from "../utils/formatDate";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "super_admin" | "artist_manager" | "artist";
  created_at?: string;
  dob: string | undefined;
}

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
  private readonly ACCESS_TOKEN_EXPIRY = "15m";
  private readonly REFRESH_TOKEN_EXPIRY = "1d";

  private generateAccessToken(payload: {
    id: number;
    email: string;
    role: string;
  }): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    });
  }

  private generateRefreshToken(payload: {
    id: number;
    email: string;
    role: string;
  }): string {
    const tokenPayload = {
      payload,
      tokenId: crypto.randomBytes(16).toString("hex"),
    };
    return jwt.sign(tokenPayload, this.JWT_REFRESH_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    });
  }

  public async registerUser(
    userData: IRegisterUser,
  ): Promise<{ id: number; email: string }> {
    const existingUser = await queryOne<User>(
      "SELECT id FROM users WHERE email = $1",
      [userData.email],
    );

    if (existingUser) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const formattedDateOfBirth = normalizeDate(userData.dob, "date");

    const sql = `
      INSERT INTO users 
      (first_name, last_name, email, password, phone, dob, gender, address, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;

    const result = await queryOne<{ id: number }>(sql, [
      userData.first_name,
      userData.last_name,
      userData.email,
      hashedPassword,
      userData.phone || null,
      formattedDateOfBirth || null,
      userData.gender || "o",
      userData.address || null,
      userData.role,
    ]);

    return {
      id: result!.id,
      email: userData.email,
    };
  }

  public async loginUser(userCredentials: ILoginUser) {
    const { email, password } = userCredentials;

    const user = await queryOne<User>(
      "SELECT id, first_name, last_name, email, password, role, created_at FROM users WHERE email = $1",
      [email],
    );

    if (!user) throw new Error("INVALID_CREDENTIALS");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("INVALID_CREDENTIALS");

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      user: payload,
      accessToken,
      refreshToken,
    };
  }

  public async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    newRefreshToken: string;
  }> {
    try {
      const decoded = jwt.verify(refreshToken, this.JWT_REFRESH_SECRET) as {
        payload: {
          id: number;
          email: string;
          role: User["role"];
        };
      };

      const accessToken = this.generateAccessToken({
        id: decoded.payload.id,
        email: decoded.payload.email,
        role: decoded.payload.role,
      });
      const newRefreshToken = this.generateRefreshToken({
        id: decoded.payload.id,
        email: decoded.payload.email,
        role: decoded.payload.role,
      });

      return { accessToken, newRefreshToken };
    } catch (err) {
      throw new Error("Invalid refresh token");
    }
  }

  public async getCurrentUser(id: number): Promise<User | null> {
    const user = await queryOne<User>(
      `SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at 
             FROM users WHERE id = $1`,
      [id],
    );

    if (!user) {
      throw new Error("Failed to get user information");
    }

    const userResponse = {
      ...user,
      dob: normalizeDate(user.dob, "date"),
    };
    return userResponse;
  }

  public verifyAccessToken(token: string): any | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as any;
    } catch {
      return null;
    }
  }
}

export default AuthService;
