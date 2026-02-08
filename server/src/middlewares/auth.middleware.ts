import { Response, NextFunction } from "express";
import AuthService, { User } from "../services/auth.services";
import { queryOne } from "../config/db";
import { AuthRequest } from "../controller/auth.controller";

const authService = new AuthService();

export const verifyJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
      return;
    }

    const decoded = authService.verifyAccessToken(token);

    console.log(decoded);

    const user = await queryOne<User>(
      `SELECT id, first_name, last_name, email, phone, dob, gender, address, role, created_at 
             FROM users WHERE id = $1`,
      [decoded.id],
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
