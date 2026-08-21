import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import * as adminCourseController from '../controllers/admin-course.controller.js';
import { validate } from '../middleware/validate.js';
import { createCourseSchema, updateCourseSchema } from '../validations/course.validation.js';
import * as adminUserController from '../controllers/admin-user.controller.js';
import {
  updateAdminUserRoleSchema,
  updateAdminUserSchema,
  updateAdminUserStatusSchema,
} from '../validations/admin-user.validation.js';
import * as adminOrderController from '../controllers/admin-order.controller.js';
import * as adminCurriculumController from '../controllers/admin-curriculum.controller.js';
import {
  createAdminLessonSchema,
  createAdminModuleSchema,
  reorderAdminCurriculumSchema,
  updateAdminLessonSchema,
  updateAdminModuleSchema,
} from '../validations/admin-curriculum.validation.js';
import * as adminQuizController from '../controllers/admin-quiz.controller.js';
import {
  adminQuizListQuerySchema,
  adminQuizQuestionSchema,
  createAdminQuizSchema,
  reorderAdminQuizQuestionsSchema,
  updateAdminQuizQuestionSchema,
  updateAdminQuizSchema,
} from '../validations/admin-quiz.validation.js';
import * as adminAssignmentController from '../controllers/admin-assignment.controller.js';
import { adminAssignmentListQuerySchema, adminSubmissionListQuerySchema, createAdminAssignmentSchema, gradeAdminSubmissionSchema, updateAdminAssignmentSchema } from '../validations/admin-assignment.validation.js';
import * as adminCertificateController from '../controllers/admin-certificate.controller.js';
import { adminCertificateListQuerySchema, updateAdminCertificateStatusSchema } from '../validations/admin-certificate.validation.js';
import * as adminDiscussionController from '../controllers/admin-discussion.controller.js';
import { adminDiscussionListQuerySchema } from '../validations/admin-discussion.validation.js';
import * as adminNotificationController from '../controllers/admin-notification.controller.js';
import { adminNotificationDetailQuerySchema, adminNotificationListQuerySchema, adminNotificationOptionsQuerySchema, createAdminNotificationSchema } from '../validations/admin-notification.validation.js';
import * as adminReportController from '../controllers/admin-report.controller.js';
import { adminReportQuerySchema } from '../validations/admin-report.validation.js';
import * as adminSettingController from '../controllers/admin-setting.controller.js';
import { updateAdminSettingsSchema } from '../validations/admin-setting.validation.js';

const router = Router();

router.use(authenticate, authorize('admin'));
router.get('/dashboard', adminController.getDashboard);
router.get('/courses', adminCourseController.getCourses);
router.post('/courses', validate(createCourseSchema), adminCourseController.createCourse);
router.get('/courses/:courseId/curriculum', adminCurriculumController.getCurriculum);
router.post('/courses/:courseId/modules', validate(createAdminModuleSchema), adminCurriculumController.createModule);
router.patch('/courses/:courseId/modules/reorder', validate(reorderAdminCurriculumSchema), adminCurriculumController.reorderModules);
router.patch('/courses/:courseId/modules/:moduleId', validate(updateAdminModuleSchema), adminCurriculumController.updateModule);
router.delete('/courses/:courseId/modules/:moduleId', adminCurriculumController.deleteModule);
router.post('/courses/:courseId/modules/:moduleId/lessons', validate(createAdminLessonSchema), adminCurriculumController.createLesson);
router.patch('/courses/:courseId/modules/:moduleId/lessons/reorder', validate(reorderAdminCurriculumSchema), adminCurriculumController.reorderLessons);
router.patch('/courses/:courseId/modules/:moduleId/lessons/:lessonId', validate(updateAdminLessonSchema), adminCurriculumController.updateLesson);
router.delete('/courses/:courseId/modules/:moduleId/lessons/:lessonId', adminCurriculumController.deleteLesson);
router.get('/courses/:id', adminCourseController.getCourse);
router.patch('/courses/:id/publish', adminCourseController.toggleCoursePublish);
router.patch('/courses/:id', validate(updateCourseSchema), adminCourseController.updateCourse);
router.delete('/courses/:id', adminCourseController.deleteCourse);
router.get('/users', adminUserController.getUsers);
router.get('/users/:id', adminUserController.getUser);
router.patch('/users/:id/role', validate(updateAdminUserRoleSchema), adminUserController.updateUserRole);
router.patch('/users/:id/status', validate(updateAdminUserStatusSchema), adminUserController.updateUserStatus);
router.patch('/users/:id', validate(updateAdminUserSchema), adminUserController.updateUser);
router.delete('/users/:id', adminUserController.deleteUser);
router.get('/orders', adminOrderController.getOrders);
router.get('/orders/:id', adminOrderController.getOrder);
router.get('/enrollments', adminOrderController.getEnrollments);
router.get('/enrollments/:id', adminOrderController.getEnrollment);
router.get('/quizzes', validate(adminQuizListQuerySchema, 'query'), adminQuizController.getQuizzes);
router.get('/quizzes/options', adminQuizController.getQuizOptions);
router.post('/quizzes', validate(createAdminQuizSchema), adminQuizController.createQuiz);
router.get('/quizzes/:id', adminQuizController.getQuiz);
router.patch('/quizzes/:id', validate(updateAdminQuizSchema), adminQuizController.updateQuiz);
router.delete('/quizzes/:id', adminQuizController.deleteQuiz);
router.post('/quizzes/:id/questions', validate(adminQuizQuestionSchema), adminQuizController.createQuestion);
router.patch('/quizzes/:id/questions/reorder', validate(reorderAdminQuizQuestionsSchema), adminQuizController.reorderQuestions);
router.patch('/quizzes/:id/questions/:questionId', validate(updateAdminQuizQuestionSchema), adminQuizController.updateQuestion);
router.delete('/quizzes/:id/questions/:questionId', adminQuizController.deleteQuestion);
router.get('/assignments', validate(adminAssignmentListQuerySchema, 'query'), adminAssignmentController.getAssignments);
router.get('/assignments/options', adminAssignmentController.getOptions);
router.post('/assignments', validate(createAdminAssignmentSchema), adminAssignmentController.createAssignment);
router.get('/assignments/:id', adminAssignmentController.getAssignment);
router.patch('/assignments/:id', validate(updateAdminAssignmentSchema), adminAssignmentController.updateAssignment);
router.delete('/assignments/:id', adminAssignmentController.deleteAssignment);
router.get('/assignments/:id/submissions', validate(adminSubmissionListQuerySchema, 'query'), adminAssignmentController.getSubmissions);
router.get('/assignments/:id/submissions/:submissionId', adminAssignmentController.getSubmission);
router.patch('/assignments/:id/submissions/:submissionId', validate(gradeAdminSubmissionSchema), adminAssignmentController.gradeSubmission);
router.get('/certificates', validate(adminCertificateListQuerySchema, 'query'), adminCertificateController.getCertificates);
router.get('/certificates/:id/pdf', adminCertificateController.getPdf);
router.get('/certificates/:id', adminCertificateController.getCertificate);
router.patch('/certificates/:id/status', validate(updateAdminCertificateStatusSchema), adminCertificateController.updateStatus);
router.get('/discussions', validate(adminDiscussionListQuerySchema, 'query'), adminDiscussionController.getDiscussions);
router.get('/discussions/:id', adminDiscussionController.getDiscussion);
router.delete('/discussions/:id/replies/:replyId', adminDiscussionController.removeReply);
router.delete('/discussions/:id', adminDiscussionController.removeDiscussion);
router.get('/notifications', validate(adminNotificationListQuerySchema, 'query'), adminNotificationController.getNotifications);
router.get('/notifications/options', validate(adminNotificationOptionsQuerySchema, 'query'), adminNotificationController.getOptions);
router.post('/notifications', validate(createAdminNotificationSchema), adminNotificationController.createNotification);
router.get('/notifications/:id', validate(adminNotificationDetailQuerySchema, 'query'), adminNotificationController.getNotification);
router.get('/reports', validate(adminReportQuerySchema, 'query'), adminReportController.getReport);
router.get('/settings', adminSettingController.getSettings);
router.patch('/settings', validate(updateAdminSettingsSchema), adminSettingController.updateSettings);

export default router;
