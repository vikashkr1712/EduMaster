import * as adminService from '../services/admin.service.js';

export const getDashboard = async (req, res) => {
  const dashboard = await adminService.getDashboard();

  res.status(200).json({
    success: true,
    message: 'Admin dashboard retrieved successfully',
    data: dashboard,
  });
};
