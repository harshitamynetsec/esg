import { Router } from 'express';
import { body } from 'express-validator';
import { createCrudController } from '../controllers/crudController.js';
import { downloadReportPdf, generateReport, getReportDetail } from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';
import { validate } from '../middleware/validate.js';
import { idParamValidator } from '../validators/commonValidators.js';
import { Report } from '../models/index.js';
import { crudRoutes } from './crudRoutes.js';

const router = Router();
const controller = createCrudController(Report, {
  resourceName: 'Report',
  searchFields: ['title', 'type'],
});

router.post(
  '/generate',
  authenticate,
  authorize('reports:generate'),
  body('title').trim().isLength({ min: 2, max: 180 }),
  body('type').isIn(['esg_summary', 'sdg_alignment', 'kpi_performance', 'policy_compliance']),
  body('periodStart').isISO8601(),
  body('periodEnd').isISO8601(),
  validate,
  auditAction('generate', 'reports'),
  generateReport,
);

router.get('/:id/detail', authenticate, authorize('reports:read'), idParamValidator, validate, getReportDetail);
router.get('/:id/pdf', authenticate, authorize('reports:read'), idParamValidator, validate, downloadReportPdf);

router.use(
  '/',
  crudRoutes(controller, {
    resource: 'reports',
    read: 'reports:read',
    create: 'reports:create',
    update: 'reports:create',
    delete: 'reports:delete',
  }),
);

export default router;
