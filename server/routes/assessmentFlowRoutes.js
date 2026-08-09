import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  generateReport,
  getDashboardAnalytics,
  listMaterialTopics,
  startAssessment,
  submitAssessment,
} from '../controllers/assessmentFlowController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.get('/material-topics', listMaterialTopics);

router.post(
  '/start',
  body('selectedTopicIds').isArray({ min: 1 }),
  body('selectedTopicIds.*').isMongoId(),
  validate,
  startAssessment,
);

router.post(
  '/submit',
  body('userId').optional().isMongoId(),
  body('selectedTopicIds').optional().isArray(),
  body('selectedTopicIds.*').optional().isMongoId(),
  body('answers').isArray({ min: 1 }),
  body('answers.*.questionId').isMongoId(),
  body('answers.*.selectedValue').isInt({ min: 0, max: 4 }),
  validate,
  submitAssessment,
);

router.get('/analytics', getDashboardAnalytics);
router.get('/analytics/:userId', param('userId').isMongoId(), validate, getDashboardAnalytics);
router.get('/report', generateReport);
router.get('/report/:userId', param('userId').isMongoId(), validate, generateReport);

export default router;
