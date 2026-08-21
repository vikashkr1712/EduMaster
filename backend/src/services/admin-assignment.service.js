import path from 'node:path';
import mongoose from 'mongoose';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const SORTS = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, titleAsc: { title: 1 }, titleDesc: { title: -1 }, dueAsc: { dueDate: 1 }, dueDesc: { dueDate: -1 }, submissionsDesc: { submissionCount: -1, title: 1 } };
const SUBMISSION_SORTS = { newest: { submittedAt: -1 }, oldest: { submittedAt: 1 }, studentAsc: { 'studentDoc.name': 1 }, marksAsc: { marks: 1 }, marksDesc: { marks: -1 } };
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const assertId = (id, label) => { if (!mongoose.isValidObjectId(id)) throw new ApiError(400, `Invalid ${label.toLowerCase()} ID`); };
const duplicateAttachment = (error) => error?.code === 11000 && (error?.keyPattern?.lessonId || error?.keyValue?.lessonId);
const hasSubmissions = (assignmentId) => AssignmentSubmission.exists({ assignment: assignmentId });

const assertAttachment = async (courseId, moduleId, lessonId) => {
  assertId(courseId, 'Course');
  const course = await Course.findById(courseId).select('_id title modules').lean();
  if (!course) throw new ApiError(404, 'Course not found');
  const module = course.modules?.find((item) => item.moduleId === moduleId);
  if (!module) throw new ApiError(404, 'Module does not belong to the selected course');
  const lesson = module.lessons?.find((item) => item.lessonId === lessonId);
  if (!lesson) throw new ApiError(404, 'Lesson does not belong to the selected module');
  return { course, module, lesson };
};

const safeFile = (file) => {
  if (!file) return null;
  const filename = String(file.filename || '');
  const expected = `/uploads/assignments/${filename}`;
  const safe = filename && path.basename(filename) === filename && file.url === expected;
  return { originalName: file.originalName, mimeType: file.mimeType, size: file.size, downloadUrl: safe ? expected : null };
};

const relationStages = [
  { $lookup: { from: Course.collection.name, localField: 'course', foreignField: '_id', as: 'courseDoc' } },
  { $set: { courseDoc: { $arrayElemAt: ['$courseDoc', 0] } } },
  { $set: { moduleDoc: { $arrayElemAt: [{ $filter: { input: { $ifNull: ['$courseDoc.modules', []] }, as: 'module', cond: { $eq: ['$$module.moduleId', '$moduleId'] } } }, 0] } } },
  { $set: { lessonDoc: { $arrayElemAt: [{ $filter: { input: { $ifNull: ['$moduleDoc.lessons', []] }, as: 'lesson', cond: { $eq: ['$$lesson.lessonId', '$lessonId'] } } }, 0] } } },
  { $lookup: { from: AssignmentSubmission.collection.name, let: { assignmentId: '$_id' }, pipeline: [{ $match: { $expr: { $eq: ['$assignment', '$$assignmentId'] } } }, { $group: { _id: null, submissionCount: { $sum: 1 }, gradedCount: { $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] } } } }], as: 'submissionStats' } },
  { $set: { submissionStats: { $ifNull: [{ $arrayElemAt: ['$submissionStats', 0] }, { submissionCount: 0, gradedCount: 0 }] } } },
  { $set: { submissionCount: '$submissionStats.submissionCount', gradedCount: '$submissionStats.gradedCount' } },
];

export const getAssignments = async (query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1); const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50); const initial = {};
  if (query.course) initial.course = new mongoose.Types.ObjectId(query.course); if (query.status === 'published') initial.isPublished = true; if (query.status === 'draft') initial.isPublished = false;
  if (query.due === 'upcoming') initial.dueDate = { $gte: new Date() }; if (query.due === 'past') initial.dueDate = { $lt: new Date() };
  const later = {}; if (query.search) { const pattern = new RegExp(escapeRegex(query.search), 'i'); later.$or = [{ title: pattern }, { 'courseDoc.title': pattern }, { 'moduleDoc.title': pattern }, { 'lessonDoc.title': pattern }]; } if (query.submissions === 'with') later.submissionCount = { $gt: 0 }; if (query.submissions === 'without') later.submissionCount = 0;
  const [result, assignmentSummary, submissionSummary] = await Promise.all([
    Assignment.aggregate([{ $match: initial }, ...relationStages, ...(Object.keys(later).length ? [{ $match: later }] : []), { $set: { courseTitle: { $ifNull: ['$courseDoc.title', 'Course unavailable'] }, moduleTitle: { $ifNull: ['$moduleDoc.title', 'Module unavailable'] }, lessonTitle: { $ifNull: ['$lessonDoc.title', 'Lesson unavailable'] } } }, { $facet: { assignments: [{ $sort: SORTS[query.sort] ?? SORTS.newest }, { $skip: (page - 1) * limit }, { $limit: limit }, { $project: { courseDoc: 0, moduleDoc: 0, lessonDoc: 0, submissionStats: 0, description: 0, instructions: 0, attachments: 0, __v: 0 } }], total: [{ $count: 'value' }] } }]),
    Assignment.aggregate([{ $group: { _id: null, total: { $sum: 1 } } }]),
    AssignmentSubmission.aggregate([{ $group: { _id: null, total: { $sum: 1 }, pending: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } }, graded: { $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] } } } }]),
  ]);
  const facet = result[0] ?? { assignments: [], total: [] }; const total = facet.total[0]?.value ?? 0; const submissions = submissionSummary[0] ?? { total: 0, pending: 0, graded: 0 };
  return { assignments: facet.assignments, pagination: { total, page, pages: Math.ceil(total / limit) || 1, limit }, summary: { total: assignmentSummary[0]?.total ?? 0, submissions: submissions.total, pending: submissions.pending, graded: submissions.graded } };
};

export const getOptions = () => Course.find({ 'modules.0': { $exists: true } }).select('_id title modules.moduleId modules.title modules.lessons.lessonId modules.lessons.title').sort({ title: 1 }).lean();

export const getAssignment = async (id) => {
  assertId(id, 'Assignment'); const assignment = await Assignment.findById(id).lean(); if (!assignment) throw new ApiError(404, 'Assignment not found');
  const [course, stats] = await Promise.all([Course.findById(assignment.course).select('title modules').lean(), AssignmentSubmission.aggregate([{ $match: { assignment: assignment._id } }, { $group: { _id: null, submissionCount: { $sum: 1 }, gradedCount: { $sum: { $cond: [{ $eq: ['$status', 'reviewed'] }, 1, 0] } }, averageMarks: { $avg: '$marks' } } }])]);
  const module = course?.modules?.find((item) => item.moduleId === assignment.moduleId); const lesson = module?.lessons?.find((item) => item.lessonId === assignment.lessonId);
  return { ...assignment, courseTitle: course?.title ?? 'Course unavailable', moduleTitle: module?.title ?? 'Module unavailable', lessonTitle: lesson?.title ?? 'Lesson unavailable', submissionCount: stats[0]?.submissionCount ?? 0, gradedCount: stats[0]?.gradedCount ?? 0, averageMarks: Math.round((stats[0]?.averageMarks ?? 0) * 10) / 10 };
};

export const createAssignment = async (data) => { await assertAttachment(data.course, data.moduleId, data.lessonId); if (await Assignment.exists({ course: data.course, lessonId: data.lessonId })) throw new ApiError(409, 'An assignment already exists for this lesson'); try { return await Assignment.create(data); } catch (error) { if (duplicateAttachment(error)) throw new ApiError(409, 'An assignment already exists for this lesson'); throw error; } };

export const updateAssignment = async (id, data) => {
  assertId(id, 'Assignment'); const assignment = await Assignment.findById(id); if (!assignment) throw new ApiError(404, 'Assignment not found');
  const relation = { course: data.course ?? assignment.course.toString(), moduleId: data.moduleId ?? assignment.moduleId, lessonId: data.lessonId ?? assignment.lessonId };
  const changed = (field) => data[field] !== undefined && (field === 'dueDate' ? new Date(data[field]).getTime() !== assignment.dueDate.getTime() : field === 'attachments' ? JSON.stringify(data[field]) !== JSON.stringify(assignment.attachments.map((item) => item.toObject())) : String(data[field]) !== String(assignment[field]));
  if (['course', 'moduleId', 'lessonId', 'dueDate', 'maxMarks', 'attachments'].some(changed) && await hasSubmissions(assignment._id)) throw new ApiError(409, 'Attachment, due date, maximum marks, and resources cannot change after submissions exist');
  if (data.course || data.moduleId || data.lessonId) await assertAttachment(relation.course, relation.moduleId, relation.lessonId);
  if ((data.course || data.lessonId) && await Assignment.exists({ course: relation.course, lessonId: relation.lessonId, _id: { $ne: assignment._id } })) throw new ApiError(409, 'An assignment already exists for this lesson');
  Object.assign(assignment, data); try { await assignment.save(); return assignment; } catch (error) { if (duplicateAttachment(error)) throw new ApiError(409, 'An assignment already exists for this lesson'); throw error; }
};

export const deleteAssignment = async (id) => { assertId(id, 'Assignment'); const assignment = await Assignment.findById(id); if (!assignment) throw new ApiError(404, 'Assignment not found'); if (await hasSubmissions(assignment._id)) throw new ApiError(409, 'Assignment cannot be deleted because learner submissions exist'); await assignment.deleteOne(); };

export const getSubmissions = async (assignmentId, query = {}) => {
  assertId(assignmentId, 'Assignment'); if (!await Assignment.exists({ _id: assignmentId })) throw new ApiError(404, 'Assignment not found'); const page = Math.max(Number.parseInt(query.page, 10) || 1, 1); const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50); const match = { assignment: new mongoose.Types.ObjectId(assignmentId) }; if (query.status) match.status = query.status;
  const later = {}; if (query.search) { const pattern = new RegExp(escapeRegex(query.search), 'i'); later.$or = [{ 'studentDoc.name': pattern }, { 'studentDoc.email': pattern }]; }
  const result = await AssignmentSubmission.aggregate([{ $match: match }, { $lookup: { from: User.collection.name, localField: 'student', foreignField: '_id', as: 'studentDoc' } }, { $set: { studentDoc: { $arrayElemAt: ['$studentDoc', 0] }, versionCount: { $add: [{ $size: { $ifNull: ['$versions', []] } }, 1] } } }, ...(Object.keys(later).length ? [{ $match: later }] : []), { $facet: { submissions: [{ $sort: SUBMISSION_SORTS[query.sort] ?? SUBMISSION_SORTS.newest }, { $skip: (page - 1) * limit }, { $limit: limit }, { $project: { studentName: '$studentDoc.name', studentEmail: '$studentDoc.email', submittedAt: 1, status: 1, marks: 1, submittedFile: 1, versionCount: 1 } }], total: [{ $count: 'value' }] } }]);
  const facet = result[0] ?? { submissions: [], total: [] }; const total = facet.total[0]?.value ?? 0;
  return { submissions: facet.submissions.map((item) => ({ ...item, submittedFile: safeFile(item.submittedFile) })), pagination: { total, page, pages: Math.ceil(total / limit) || 1, limit } };
};

export const getSubmission = async (assignmentId, submissionId) => {
  assertId(assignmentId, 'Assignment'); assertId(submissionId, 'Submission'); const submission = await AssignmentSubmission.findOne({ _id: submissionId, assignment: assignmentId }).populate('student', 'name email').lean(); if (!submission) throw new ApiError(404, 'Submission not found'); const assignment = await Assignment.findById(assignmentId).select('title maxMarks course moduleId lessonId').lean(); if (!assignment) throw new ApiError(404, 'Assignment not found');
  const versions = [...(submission.versions ?? []), { _id: submission._id, submittedFile: submission.submittedFile, submittedAt: submission.submittedAt, remarks: submission.remarks, marks: submission.marks, status: submission.status }].map((version, index, all) => ({ _id: version._id, version: index + 1, latest: index === all.length - 1, submittedFile: safeFile(version.submittedFile), submittedAt: version.submittedAt, remarks: version.remarks, marks: version.marks, status: version.status }));
  return { submission: { ...submission, submittedFile: safeFile(submission.submittedFile), versions }, assignment };
};

export const gradeSubmission = async (assignmentId, submissionId, data) => {
  assertId(assignmentId, 'Assignment'); assertId(submissionId, 'Submission'); const assignment = await Assignment.findById(assignmentId).select('maxMarks').lean(); if (!assignment) throw new ApiError(404, 'Assignment not found'); if (data.marks > assignment.maxMarks) throw new ApiError(400, `Marks cannot exceed the assignment maximum of ${assignment.maxMarks}`);
  const submission = await AssignmentSubmission.findOne({ _id: submissionId, assignment: assignmentId }); if (!submission) throw new ApiError(404, 'Submission not found'); submission.marks = data.marks; submission.remarks = data.remarks; submission.status = 'reviewed'; await submission.save(); return submission;
};
