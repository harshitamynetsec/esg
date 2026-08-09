import { Router } from 'express';
import { login, logout, me, refresh, register } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginValidator, refreshValidator, registerValidator } from '../validators/authValidators.js';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh', refreshValidator, validate, refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;
