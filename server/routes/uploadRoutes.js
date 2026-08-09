import { Router } from 'express';
import { createUpload } from '../controllers/uploadController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', authenticate, authorize('policies:create', 'kpis:update', 'reports:create'), upload.single('file'), createUpload);

export default router;
