import fs from 'node:fs/promises';
import Assignment from '../models/Assignment.js';
import AssignmentSubmission from '../models/AssignmentSubmission.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { buildAssignmentsForCourse } from '../utils/assignmentFactory.js';
import { createEvent } from './notification.service.js';

const ensureEnrollment = async (student, course) => {
  if (!await CourseEnrollment.exists({ user: student, course })) throw new ApiError(403, 'You must enroll in this course to access assignments');
};

const ensureAssignments = async (course) => {
  const definitions = buildAssignmentsForCourse(course);
  if (definitions.length) await Assignment.bulkWrite(definitions.map((assignment) => ({ updateOne: { filter: { course: course._id, lessonId: assignment.lessonId }, update: { $setOnInsert: assignment }, upsert: true } })));
};

export const getAssignment = async (student, lessonId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course || !course.modules.some((module) => module.lessons.some((lesson) => lesson.lessonId === lessonId))) throw new ApiError(404, 'Assignment not found');
  await ensureEnrollment(student, course._id);
  await ensureAssignments(course);
  const assignment = await Assignment.findOne({ course: course._id, lessonId, isPublished: true }).lean();
  if (!assignment) return { assignment: null, submission: null };
  const submission = await AssignmentSubmission.findOne({ student, assignment: assignment._id }).lean();
  return { assignment, submission };
};

export const submitAssignment = async (student, assignmentId, file, remarks = '') => {
  if (!file) throw new ApiError(400, 'Choose a PDF, DOC, DOCX, or ZIP solution file');
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment || !assignment.isPublished) throw new ApiError(404, 'Assignment not found');
    await ensureEnrollment(student, assignment.course);
    const safeRemarks = String(remarks || '').trim();
    if (safeRemarks.length > 2000) throw new ApiError(400, 'Remarks must not exceed 2000 characters');
    let submission = await AssignmentSubmission.findOne({ student, assignment: assignment._id });
    if (submission) {
      submission.versions.push({ submittedFile: submission.submittedFile.toObject(), submittedAt: submission.submittedAt, remarks: submission.remarks, marks: submission.marks, status: submission.status });
      submission.course = assignment.course;
      submission.submittedFile = { originalName: file.originalname, filename: file.filename, url: `/uploads/assignments/${file.filename}`, mimeType: file.mimetype, size: file.size };
      submission.submittedAt = new Date();
      submission.remarks = safeRemarks;
      submission.marks = null;
      submission.status = 'submitted';
      await submission.save();
    } else {
      submission = await AssignmentSubmission.create({ student, assignment: assignment._id, course: assignment.course, submittedFile: { originalName: file.originalname, filename: file.filename, url: `/uploads/assignments/${file.filename}`, mimeType: file.mimetype, size: file.size }, submittedAt: new Date(), remarks: safeRemarks });
    }
    const count = await AssignmentSubmission.countDocuments({ student });
    const user = await User.findByIdAndUpdate(student, { $set: { 'stats.assignmentsSubmitted': count } }, { returnDocument: 'after' }).select('stats').lean();
    await createEvent({
      userId: student,
      notification: { title: 'Assignment submitted', message: `${assignment.title} was submitted successfully.`, type: 'assignment', actionUrl: `/learn/${assignment.course}?lesson=${assignment.lessonId}` },
      activity: { type: 'assignment', title: 'Submitted assignment', message: `Submitted ${assignment.title}.`, actionUrl: `/learn/${assignment.course}?lesson=${assignment.lessonId}` },
    });
    return { submission: submission.toObject(), stats: user.stats };
  } catch (error) {
    await fs.unlink(file.path).catch(() => {});
    throw error;
  }
};

export const getHistory = async (student) => {
  const submissions = await AssignmentSubmission.find({ student }).sort({ submittedAt: -1 }).populate('assignment', 'title dueDate maxMarks lessonId').populate('course', 'title imageType').lean();
  return { submissions };
};
