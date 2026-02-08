import { Request, Response } from "express";
import z from "zod";
import AuthService from "../services/auth.services";
import { ILoginUser, IRegisterUser } from "../schemas/auth.schemas";

const authService = new AuthService();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: "super_admin" | "artist_manager" | "artist";
  };
}

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: IRegisterUser = req.body;

      const user = await authService.registerUser(userData);

      res.status(201).json({
        success: true,
        message: "Registration successful. Please login.",
        data: user,
      });
    } catch (error: any) {
      if (error.message === "USER_ALREADY_EXISTS") {
        res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
        return;
      }

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: ILoginUser = req.body;

      const { user, accessToken, refreshToken } =
        await authService.loginUser(credentials);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user,
          accessToken,
        },
      });
    } catch (error: any) {
      if (error.message === "INVALID_CREDENTIALS") {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
        return;
      }

      res.status(500).json({ success: false, message: "Login failed" });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res
          .status(401)
          .json({ success: false, message: "Refresh token missing" });
        return;
      }

      const accessToken = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ success: false, error: "Server error" });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      const user = await authService.getCurrentUser(req.user!.id);
      res.status(200).json({ success: true, data: user });
    } catch (err: any) {
      res
        .status(500)
        .json({ success: false, message: "Failed to get user information" });
    }
  }
}

export default AuthController;
