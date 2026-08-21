import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import Certificate from '../models/Certificate.js';
import CertificateCounter from '../models/CertificateCounter.js';
import Achievement from '../models/Achievement.js';
import Course from '../models/Course.js';
import CourseEnrollment from '../models/CourseEnrollment.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { buildCertificateEmail } from '../utils/certificateEmail.js';
import { unlockCompletionAchievements } from './achievement.service.js';
import { createEvent } from './notification.service.js';

const APP_ORIGIN = process.env.CLIENT_URL?.split(',')[0]?.trim() || 'http://localhost:5173';

const findCourse = async (value, session = null) => {
  const id = String(value ?? '').trim();
  let query = mongoose.isValidObjectId(id) ? Course.findById(id) : null;
  let course = query ? await query.session(session) : null;
  if (!course && Number.isInteger(Number(id))) course = await Course.findOne({ sourceId: Number(id) }).session(session);
  if (!course) throw new ApiError(404, 'Course not found');
  return course;
};

const nextCertificateNumber = async (session) => {
  const year = new Date().getFullYear();
  const counter = await CertificateCounter.findOneAndUpdate(
    { _id: `certificates-${year}` },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true, session }
  );
  return `CERT-EDU-${year}-${String(counter.sequence).padStart(6, '0')}`;
};

const nextVerificationCode = async (session) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = randomBytes(8).toString('hex').toUpperCase();
    if (!(await Certificate.exists({ verificationCode: code }).session(session))) return code;
  }
  throw new ApiError(500, 'Could not generate a certificate verification code');
};

export const generateCertificate = async (userId, courseId) => {
  const course = await findCourse(courseId);
  const existing = await Certificate.findOne({ user: userId, course: course._id })
    .populate('course', 'title instructor category imageType')
    .populate('user', 'name email')
    .lean();
  if (existing) {
    const [achievements, user] = await Promise.all([
      Achievement.find({ user: userId }).sort({ unlockedAt: -1 }).lean(),
      User.findById(userId).select('stats').lean(),
    ]);
    return { certificate: existing, achievements, stats: user?.stats, generated: false };
  }

  const session = await mongoose.startSession();
  let certificateId;
  let achievementIds = [];
  try {
    await session.withTransaction(async () => {
      const enrollment = await CourseEnrollment.findOne({ user: userId, course: course._id }).session(session);
      const user = await User.findById(userId).session(session);
      const completionPercentage = Math.max(
        Number(enrollment?.percentageCompleted) || 0,
        Number(enrollment?.progress) || 0
      );
      if (!enrollment || completionPercentage < 100) throw new ApiError(400, 'Complete the course before generating a certificate');
      if (!user) throw new ApiError(404, 'User not found');

      // Older enrollments may have been marked complete using only `progress`.
      // Normalize both fields so certificate eligibility has one durable source.
      enrollment.progress = 100;
      enrollment.percentageCompleted = 100;
      if (!enrollment.completedAt) enrollment.completedAt = new Date();
      await enrollment.save({ session });

      const alreadyGenerated = await Certificate.findOne({ user: userId, course: course._id }).session(session);
      if (alreadyGenerated) { certificateId = alreadyGenerated._id; return; }

      const certificateNumber = await nextCertificateNumber(session);
      const verificationCode = await nextVerificationCode(session);
      const completionDate = enrollment.completedAt || new Date();
      const [certificate] = await Certificate.create([{
        user: userId,
        course: course._id,
        enrollment: enrollment._id,
        certificateNumber,
        verificationCode,
        issueDate: new Date(),
        completionDate,
        certificateUrl: `/certificate/verify/${verificationCode}`,
        pdfUrl: `/api/v1/certificates/${certificateNumber}/pdf`,
        status: 'valid',
      }], { session });
      certificateId = certificate._id;

      const achievements = await unlockCompletionAchievements(userId, course._id, session);
      achievementIds = achievements.map((achievement) => achievement._id);
      const certificateCount = await Certificate.countDocuments({ user: userId }).session(session);
      const completedCourseCount = await CourseEnrollment.countDocuments({ user: userId, percentageCompleted: 100 }).session(session);
      const achievementCount = await Achievement.countDocuments({ user: userId }).session(session);
      await User.findByIdAndUpdate(userId, {
        $set: {
          'stats.certificates': certificateCount,
          'stats.completedCourses': completedCourseCount,
          'stats.achievements': achievementCount,
        },
      }, { session });
    });
  } catch (error) {
    if (error?.code === 11000) {
      const duplicate = await Certificate.findOne({ user: userId, course: course._id })
        .populate('course', 'title instructor category imageType')
        .populate('user', 'name email')
        .lean();
      if (duplicate) {
        const [achievements, user] = await Promise.all([
          Achievement.find({ user: userId }).sort({ unlockedAt: -1 }).lean(),
          User.findById(userId).select('stats').lean(),
        ]);
        return { certificate: duplicate, achievements, stats: user?.stats, generated: false };
      }
    }
    throw error;
  } finally {
    await session.endSession();
  }

  const [certificate, achievements, user] = await Promise.all([
    Certificate.findById(certificateId).populate('course', 'title instructor category imageType').populate('user', 'name email').lean(),
    Achievement.find({ _id: { $in: achievementIds } }).lean(),
    User.findById(userId).select('stats').lean(),
  ]);
  await createEvent({
    userId,
    notification: { title: 'Certificate ready', message: `Your certificate for ${certificate.course.title} is ready.`, type: 'certificate', actionUrl: `/profile/certificates/${certificate._id}`, metadata: { certificateId: certificate._id } },
    activity: { type: 'certificate', title: 'Earned certificate', message: `Completed ${certificate.course.title} and earned a certificate.`, actionUrl: `/profile/certificates/${certificate._id}`, dedupeKey: `certificate:${certificate._id}` },
    email: { template: 'certificate-ready', payload: { courseTitle: certificate.course.title, certificateNumber: certificate.certificateNumber } },
  });
  return {
    certificate,
    achievements,
    stats: user?.stats,
    generated: true,
    email: buildCertificateEmail({
      studentName: certificate.user.name,
      courseTitle: certificate.course.title,
      certificateNumber: certificate.certificateNumber,
      pdfUrl: certificate.pdfUrl,
    }),
  };
};

export const ensureCompletedCertificates = async (userId) => {
  const [completedEnrollments, existingCourseIds] = await Promise.all([
    CourseEnrollment.find({
      user: userId,
      $or: [{ percentageCompleted: { $gte: 100 } }, { progress: { $gte: 100 } }],
    }).select('course').lean(),
    Certificate.find({ user: userId }).distinct('course'),
  ]);

  const existing = new Set(existingCourseIds.map(String));
  const missingCourseIds = completedEnrollments
    .map((enrollment) => enrollment.course)
    .filter((courseId) => courseId && !existing.has(String(courseId)));

  // Run sequentially so certificate counters and achievement updates remain
  // predictable when several legacy completions are repaired at once.
  for (const courseId of missingCourseIds) {
    await generateCertificate(userId, courseId);
  }

  return missingCourseIds.length;
};

export const getCertificates = async (userId) => {
  await ensureCompletedCertificates(userId);
  return Certificate.find({ user: userId })
    .sort({ issueDate: -1 })
    .populate('course', 'title instructor category imageType')
    .lean();
};

export const getCertificate = async (userId, id) => {
  const query = mongoose.isValidObjectId(id)
    ? { _id: id, user: userId }
    : { certificateNumber: id, user: userId };
  const certificate = await Certificate.findOne(query).populate('course').populate('user', 'name email').lean();
  if (!certificate) throw new ApiError(404, 'Certificate not found');
  return certificate;
};

export const verifyCertificate = async (code) => {
  const certificate = await Certificate.findOne({ verificationCode: String(code).toUpperCase() })
    .populate('course', 'title instructor category')
    .populate('user', 'name')
    .lean();
  if (!certificate) throw new ApiError(404, 'Certificate not found');
  return certificate;
};

const drawCenteredText = (page, text, y, font, size, color) => {
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: (page.getWidth() - width) / 2, y, size, font, color });
};

export const buildCertificatePdf = async (certificate) => {
  const document = await PDFDocument.create();
  document.setTitle(`EduMaster Certificate - ${certificate.course.title}`);
  document.setAuthor('EduMaster');
  const page = document.addPage([842, 595]);
  const regular = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  const italic = await document.embedFont(StandardFonts.TimesRomanItalic);
  const navy = rgb(0.08, 0.14, 0.29);
  const blue = rgb(0.15, 0.39, 0.92);
  const gold = rgb(0.98, 0.7, 0.2);

  page.drawRectangle({ x: 18, y: 18, width: 806, height: 559, borderColor: navy, borderWidth: 5, color: rgb(0.995, 0.992, 0.975) });
  page.drawRectangle({ x: 30, y: 30, width: 782, height: 535, borderColor: gold, borderWidth: 1.5 });
  page.drawCircle({ x: 74, y: 520, size: 22, color: navy });
  page.drawCircle({ x: 74, y: 510, size: 15, color: gold });
  page.drawText('EDUMASTER', { x: 108, y: 513, size: 22, font: bold, color: navy });
  drawCenteredText(page, 'CERTIFICATE OF COMPLETION', 447, bold, 29, navy);
  drawCenteredText(page, 'This certificate is proudly presented to', 407, regular, 13, rgb(0.35, 0.41, 0.53));
  drawCenteredText(page, certificate.user.name, 356, italic, 32, blue);
  page.drawLine({ start: { x: 220, y: 345 }, end: { x: 622, y: 345 }, thickness: 1, color: rgb(0.72, 0.78, 0.88) });
  drawCenteredText(page, 'for successfully completing', 316, regular, 13, rgb(0.35, 0.41, 0.53));
  drawCenteredText(page, certificate.course.title, 274, bold, 21, navy);
  drawCenteredText(page, `Instructor: ${certificate.course.instructor}`, 240, regular, 12, rgb(0.35, 0.41, 0.53));

  const verificationUrl = `${APP_ORIGIN}/certificate/verify/${certificate.verificationCode}`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 1, width: 180, color: { dark: '#14213D', light: '#FFFFFF' } });
  const qrImage = await document.embedPng(Buffer.from(qrDataUrl.split(',')[1], 'base64'));
  page.drawImage(qrImage, { x: 674, y: 63, width: 100, height: 100 });
  page.drawText('Scan to verify', { x: 687, y: 49, size: 9, font: regular, color: navy });

  const date = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(certificate.issueDate));
  page.drawText(certificate.course.instructor, { x: 88, y: 120, size: 13, font: italic, color: navy });
  page.drawLine({ start: { x: 72, y: 112 }, end: { x: 242, y: 112 }, thickness: 1, color: navy });
  page.drawText('Instructor Signature', { x: 103, y: 94, size: 9, font: regular, color: rgb(0.4, 0.45, 0.55) });
  page.drawText(date, { x: 333, y: 120, size: 12, font: bold, color: navy });
  page.drawLine({ start: { x: 315, y: 112 }, end: { x: 492, y: 112 }, thickness: 1, color: navy });
  page.drawText('Issue Date', { x: 373, y: 94, size: 9, font: regular, color: rgb(0.4, 0.45, 0.55) });
  page.drawText(certificate.certificateNumber, { x: 72, y: 57, size: 9, font: bold, color: navy });
  page.drawText(`Verification: ${certificate.verificationCode}`, { x: 300, y: 57, size: 9, font: regular, color: navy });
  return Buffer.from(await document.save());
};
