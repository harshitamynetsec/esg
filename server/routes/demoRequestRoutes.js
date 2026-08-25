import { Router } from 'express';
import { body } from 'express-validator';
import {
  createDemoRequest,
  listDemoRequests,
  updateDemoRequestStatus,
} from '../controllers/demoRequestController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParamValidator, paginationValidator } from '../validators/commonValidators.js';

const router = Router();

router.post(
  '/',
  body('fullName').trim().isLength({ min: 2, max: 160 }).withMessage('Full name is required'),
  body('workEmail').trim().isEmail().withMessage('A valid work email is required'),
  body('company').trim().isLength({ min: 1, max: 160 }).withMessage('Company is required'),
  body('jobTitle').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('companySize').optional({ checkFalsy: true }).trim().isLength({ max: 40 }),
  body('region').optional({ checkFalsy: true }).trim().isLength({ max: 160 }),
  body('frameworks').optional().isArray(),
  body('notes').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  validate,
  createDemoRequest,
);

router.get('/', authenticate, authorize('admin:read'), paginationValidator, validate, listDemoRequests);
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin:update'),
  idParamValidator,
  body('status').isIn(['new', 'contacted', 'scheduled', 'closed']),
  validate,
  updateDemoRequestStatus,
);

export default router;
