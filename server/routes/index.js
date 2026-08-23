import { Router } from 'express';
import authRoutes from './authRoutes.js';
import assessmentFlowRoutes from './assessmentFlowRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import learningRoutes from './learningRoutes.js';
import questionnaireRoutes from './questionnaireRoutes.js';
import reportRoutes from './reportRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import teamRoutes from './teamRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ESG-NSS API healthy', data: { uptime: process.uptime() } });
});

router.use('/auth', authRoutes);
router.use('/team', teamRoutes);
router.use('/assessment-flow', assessmentFlowRoutes);
router.use('/questionnaire', questionnaireRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', dashboardRoutes);
router.use('/learning', learningRoutes);
router.use('/reports', reportRoutes);
router.use('/uploads', uploadRoutes);
router.use(resourceRoutes);

export default router;
