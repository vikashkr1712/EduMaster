import * as authService from '../services/auth.service.js';
import * as userService from '../services/user.service.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookie.js';

export const register = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);

  setAuthCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user },
  });
};

export const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user },
  });
};

export const refresh = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.refresh(req.cookies?.refreshToken);

  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: { user },
  });
};

export const logout = async (req, res) => {
  clearAuthCookies(res);

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};

export const getMe = async (req, res) => {
  const user = await userService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: { user },
  });
};
