import { Router } from 'express';
import { body } from 'express-validator';
import { listCourses, updateProgress } from '../controllers/learningController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);
router.get('/courses', authorize('learning:read'), listCourses);
router.get('/modules', authorize('learning:read'), listCourses);
router.post(
  '/progress',
  authorize('learning:update'),
  body('course').isMongoId(),
  body('module').optional().isMongoId(),
  body('lesson').optional().isMongoId(),
  body('status').isIn(['not_started', 'in_progress', 'completed']),
  body('percentComplete').isInt({ min: 0, max: 100 }),
  validate,
  updateProgress,
);

export default router;
