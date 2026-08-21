import * as service from '../services/admin-certificate.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCertificates = asyncHandler(async (req, res) => { const response = new ApiResponse(200, 'Admin certificates fetched successfully', await service.getCertificates(req.query)); res.status(200).json(response); });
export const getCertificate = asyncHandler(async (req, res) => { const response = new ApiResponse(200, 'Admin certificate fetched successfully', { certificate: await service.getCertificate(req.params.id) }); res.status(200).json(response); });
export const updateStatus = asyncHandler(async (req, res) => { const certificate = await service.updateCertificateStatus(req.params.id, req.body.status); const response = new ApiResponse(200, certificate.status === 'revoked' ? 'Certificate revoked successfully' : 'Certificate restored successfully', { certificate }); res.status(200).json(response); });
export const getPdf = asyncHandler(async (req, res) => { const { certificate, pdf } = await service.getCertificatePdf(req.params.id); res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="${certificate.certificateNumber}.pdf"`, 'Content-Length': pdf.length }); res.status(200).send(pdf); });
