import { Router } from 'express';
import * as certificateController from '../controllers/certificate.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { generateCertificateSchema } from '../validations/certificate.validation.js';

const router = Router();

router.get('/verify/:code', certificateController.verifyCertificate);
router.use(authenticate);
router.get('/', certificateController.listCertificates);
router.post('/generate', validate(generateCertificateSchema), certificateController.generateCertificate);
router.get('/:id/pdf', certificateController.downloadCertificate);
router.get('/:id', certificateController.getCertificate);

export default router;
