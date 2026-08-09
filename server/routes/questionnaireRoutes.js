import { Router } from 'express';
import { body, query } from 'express-validator';
import { getQuestionnaire, submitQuestionnaire } from '../controllers/questionnaireController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', query('type').optional().isIn(['compass', 'onboarding', 'annual']), validate, getQuestionnaire);
router.post(
  '/',
  body('questionnaire').isMongoId(),
  body('answers').isArray({ min: 1 }),
  body('answers.*.questionId').isMongoId(),
  body('answers.*').custom((answer) => answer.value !== undefined || answer.selectedValue !== undefined)
    .withMessage('Each answer must include value or selectedValue'),
  validate,
  submitQuestionnaire,
);
router.put(
  '/responses',
  body('questionnaire').isMongoId(),
  body('answers').isArray({ min: 1 }),
  body('answers.*.questionId').isMongoId(),
  body('answers.*').custom((answer) => answer.value !== undefined || answer.selectedValue !== undefined)
    .withMessage('Each answer must include value or selectedValue'),
  validate,
  submitQuestionnaire,
);

export default router;
