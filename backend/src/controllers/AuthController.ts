import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth/AuthService';
import { ApiResponse } from '../responses/ApiResponse';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  registerBuyer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.registerBuyer(req.body);
      res.status(201).json(ApiResponse.success(result, 'Buyer registered successfully'));
    } catch (error) {
      next(error);
    }
  };

  loginBuyer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.loginBuyer(email, password);
      res.status(200).json(ApiResponse.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  };

  registerSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.registerSupplier(req.body);
      res.status(201).json(ApiResponse.success(result, 'Supplier registered successfully'));
    } catch (error) {
      next(error);
    }
  };

  loginSupplier = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.loginSupplier(email, password);
      res.status(200).json(ApiResponse.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const result = await this.authService.refresh(refreshToken);
      res.status(200).json(ApiResponse.success(result, 'Token refreshed'));
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        await this.authService.logout(req.user.id, req.user.role);
      }
      res.status(200).json(ApiResponse.success(null, 'Logged out successfully'));
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In a full implementation, you'd fetch fresh user data from the DB here
      res.status(200).json(ApiResponse.success({ user: req.user }, 'Current user profile'));
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Scaffold for future change password logic
      res.status(200).json(ApiResponse.success(null, 'Password changed successfully'));
    } catch (error) {
      next(error);
    }
  };
}
