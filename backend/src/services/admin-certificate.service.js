import mongoose from 'mongoose';
import Certificate from '../models/Certificate.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { buildCertificatePdf } from './certificate.service.js';

const SORTS = { newest: { issueDate: -1 }, oldest: { issueDate: 1 }, studentAsc: { studentName: 1 }, studentDesc: { studentName: -1 }, courseAsc: { courseTitle: 1 } };
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const assertId = (id) => { if (!mongoose.isValidObjectId(id)) throw new ApiError(400, 'Invalid certificate ID'); };

const relationStages = [
  { $lookup: { from: User.collection.name, localField: 'user', foreignField: '_id', as: 'studentDoc' } },
  { $lookup: { from: Course.collection.name, localField: 'course', foreignField: '_id', as: 'courseDoc' } },
  { $set: { studentDoc: { $arrayElemAt: ['$studentDoc', 0] }, courseDoc: { $arrayElemAt: ['$courseDoc', 0] } } },
  { $set: { studentName: { $ifNull: ['$studentDoc.name', 'Student unavailable'] }, studentEmail: { $ifNull: ['$studentDoc.email', 'Email unavailable'] }, courseTitle: { $ifNull: ['$courseDoc.title', 'Course unavailable'] } } },
];

export const getCertificates = async (query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1); const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50); const initial = {};
  if (query.course) initial.course = new mongoose.Types.ObjectId(query.course); if (query.status) initial.status = query.status;
  const later = {}; if (query.search) { const pattern = new RegExp(escapeRegex(query.search), 'i'); later.$or = [{ certificateNumber: pattern }, { verificationCode: pattern }, { studentName: pattern }, { studentEmail: pattern }, { courseTitle: pattern }]; }
  const [result, summary, courses] = await Promise.all([
    Certificate.aggregate([{ $match: initial }, ...relationStages, ...(Object.keys(later).length ? [{ $match: later }] : []), { $facet: { certificates: [{ $sort: SORTS[query.sort] ?? SORTS.newest }, { $skip: (page - 1) * limit }, { $limit: limit }, { $project: { studentDoc: 0, courseDoc: 0, __v: 0 } }], total: [{ $count: 'value' }] } }]),
    Certificate.aggregate([{ $group: { _id: null, total: { $sum: 1 }, valid: { $sum: { $cond: [{ $eq: ['$status', 'valid'] }, 1, 0] } }, revoked: { $sum: { $cond: [{ $eq: ['$status', 'revoked'] }, 1, 0] } }, students: { $addToSet: '$user' }, courses: { $addToSet: '$course' } } }, { $project: { total: 1, valid: 1, revoked: 1, uniqueStudents: { $size: '$students' }, uniqueCourses: { $size: '$courses' } } }]),
    Certificate.aggregate([{ $group: { _id: '$course' } }, { $lookup: { from: Course.collection.name, localField: '_id', foreignField: '_id', as: 'course' } }, { $set: { course: { $arrayElemAt: ['$course', 0] } } }, { $match: { 'course._id': { $exists: true } } }, { $project: { _id: '$course._id', title: '$course.title' } }, { $sort: { title: 1 } }]),
  ]);
  const facet = result[0] ?? { certificates: [], total: [] }; const total = facet.total[0]?.value ?? 0;
  return { certificates: facet.certificates, pagination: { total, page, pages: Math.ceil(total / limit) || 1, limit }, summary: summary[0] ?? { total: 0, valid: 0, revoked: 0, uniqueStudents: 0, uniqueCourses: 0 }, courses };
};

export const getCertificate = async (id) => {
  assertId(id); const certificate = await Certificate.findById(id).populate('user', 'name email').populate('course', 'title instructor category').populate('enrollment', 'progress percentageCompleted completedAt enrolledAt order').lean(); if (!certificate) throw new ApiError(404, 'Certificate not found'); return certificate;
};

export const updateCertificateStatus = async (id, status) => { assertId(id); const certificate = await Certificate.findById(id); if (!certificate) throw new ApiError(404, 'Certificate not found'); certificate.status = status; await certificate.save(); return certificate; };

export const getCertificatePdf = async (id) => { const certificate = await getCertificate(id); return { certificate, pdf: await buildCertificatePdf(certificate) }; };
