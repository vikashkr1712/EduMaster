export const buildCertificateEmail = ({ studentName, courseTitle, certificateNumber, pdfUrl }) => ({
  subject: `Congratulations! Your EduMaster certificate for ${courseTitle} is ready`,
  template: 'certificate-ready',
  variables: {
    greeting: `Congratulations, ${studentName}!`,
    message: `You successfully completed ${courseTitle}. Your certificate is attached and available in your EduMaster profile.`,
    certificateNumber,
    pdfUrl,
  },
  attachments: [{ filename: `${certificateNumber}.pdf`, url: pdfUrl }],
});
