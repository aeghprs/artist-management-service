import { Request, Response } from "express";
import AuthService from "../services/auth.services";
import { IRegisterUser } from "../schemas/auth.schemas";
import UserService from "../services/user.services";
import { AppError } from "../utils/errorHandler";

const authService = new AuthService();
const userService = new UserService();

class UserController {
  public async registerUser(req: Request, res: Response) {
    try {
      const userData: IRegisterUser = req.body;

      const user = await authService.registerUser(userData);

      res.status(201).json({
        success: true,
        message: "User registration successful.",
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

      res.status(500).json({
        success: false,
        message: "User Registration failed",
      });
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await userService.getAllUser(page, limit);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve users",
      });
    }
  }

  public async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to retrieve user",
        error: error.message,
      });
    }
  }

  public async updateUser(req: Request, res: Response) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to update user",
        error: error.message,
      });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      await userService.deleteUser(req.params.id);

      res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to delete user",
        error: error.message,
      });
    }
  }

  public async getUserWithArtistRole(req: Request, res: Response) {
    try{
      const result = await userService.getUserForArtistRole();

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve users",
      });
    }
  }
}

export default UserController;
