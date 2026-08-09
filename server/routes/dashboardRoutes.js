import { Router } from 'express';
import { getAnalytics, getDashboard } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.get('/', authorize('kpis:read'), getDashboard);
router.get('/analytics', authorize('kpis:read'), getAnalytics);

export default router;
