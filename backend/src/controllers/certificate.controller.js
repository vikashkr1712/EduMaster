import * as certificateService from '../services/certificate.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createActivity } from '../services/notification.service.js';

export const listCertificates = asyncHandler(async (req, res) => {
  const certificates = await certificateService.getCertificates(req.user.id);
  const response = new ApiResponse(200, 'Certificates retrieved successfully', { certificates });
  res.status(response.statusCode).json(response);
});

export const getCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.getCertificate(req.user.id, req.params.id);
  const response = new ApiResponse(200, 'Certificate retrieved successfully', { certificate });
  res.status(response.statusCode).json(response);
});

export const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.verifyCertificate(req.params.code);
  const response = new ApiResponse(200, certificate.status === 'valid' ? 'Certificate is valid' : 'Certificate has been revoked', { certificate });
  res.status(response.statusCode).json(response);
});

export const generateCertificate = asyncHandler(async (req, res) => {
  const data = await certificateService.generateCertificate(req.user.id, req.body.courseId);
  const response = new ApiResponse(data.generated ? 201 : 200, data.generated ? 'Certificate generated successfully' : 'Certificate already exists', data);
  res.status(response.statusCode).json(response);
});

export const downloadCertificate = asyncHandler(async (req, res) => {
  const certificate = await certificateService.getCertificate(req.user.id, req.params.id);
  const pdf = await certificateService.buildCertificatePdf(certificate);
  await createActivity(req.user.id, { type: 'download', title: 'Downloaded certificate', message: `Downloaded the certificate for ${certificate.course.title}.`, actionUrl: `/profile/certificates/${certificate._id}` });
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${certificate.certificateNumber}.pdf"`,
    'Content-Length': pdf.length,
  });
  res.status(200).send(pdf);
});
