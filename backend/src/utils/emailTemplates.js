const origin = process.env.CLIENT_URL?.split(',')[0]?.trim() || 'http://localhost:5173';

const templates = {
  welcome: ({ name = 'Learner' }) => ({
    subject: 'Welcome to EduMaster',
    heading: `Welcome, ${name}!`,
    body: 'Your EduMaster account is ready. Explore courses and start learning at your own pace.',
    actionLabel: 'Explore Courses',
    actionUrl: `${origin}/courses`,
  }),
  'purchase-successful': ({ name = 'Learner', courseTitle = 'your course', orderNumber = '' }) => ({
    subject: `Enrollment confirmed: ${courseTitle}`,
    heading: 'Purchase successful',
    body: `${name}, you are now enrolled in ${courseTitle}.${orderNumber ? ` Order ${orderNumber}.` : ''}`,
    actionLabel: 'Start Learning',
    actionUrl: `${origin}/profile/courses`,
  }),
  'certificate-ready': ({ name = 'Learner', courseTitle = 'your course', certificateNumber = '' }) => ({
    subject: `Your ${courseTitle} certificate is ready`,
    heading: 'Certificate ready',
    body: `Congratulations, ${name}! Your certificate${certificateNumber ? ` ${certificateNumber}` : ''} is ready to download.`,
    actionLabel: 'View Certificate',
    actionUrl: `${origin}/profile/certificates`,
  }),
  'password-changed': ({ name = 'Learner' }) => ({
    subject: 'Your EduMaster password was changed',
    heading: 'Password changed',
    body: `${name}, your password was changed successfully. Contact support immediately if this was not you.`,
    actionLabel: 'Review Account',
    actionUrl: `${origin}/profile/settings`,
  }),
  'assignment-reminder': ({ name = 'Learner', assignmentTitle = 'an assignment', dueDate = '' }) => ({
    subject: `Assignment reminder: ${assignmentTitle}`,
    heading: 'Assignment due soon',
    body: `${name}, ${assignmentTitle}${dueDate ? ` is due ${dueDate}` : ' is waiting for your submission'}.`,
    actionLabel: 'Open Assignment',
    actionUrl: `${origin}/profile/courses`,
  }),
  'weekly-progress': ({ name = 'Learner', progress = 0 }) => ({
    subject: 'Your weekly EduMaster progress',
    heading: 'Keep the momentum going',
    body: `${name}, your current learning progress is ${Math.round(Number(progress) || 0)}%.`,
    actionLabel: 'Continue Learning',
    actionUrl: `${origin}/profile/courses`,
  }),
};

export const buildEmailTemplate = (template, payload = {}) => {
  const factory = templates[template];
  if (!factory) throw new Error(`Unknown email template: ${template}`);
  return factory(payload);
};
