import { Router } from 'express';
import {
  getTeamMembers,
  inviteMember,
  resendInvite,
  updateTeamMember,
  updateTeamMemberStatus,
} from '../controllers/teamController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  inviteValidator,
  statusValidator,
  updateMemberValidator,
} from '../validators/teamValidators.js';

const router = Router();

router.post('/invite', authenticate, inviteValidator, validate, inviteMember);
router.get('/', authenticate, getTeamMembers);
router.patch('/:id', authenticate, updateMemberValidator, validate, updateTeamMember);
router.patch('/:id/status', authenticate, statusValidator, validate, updateTeamMemberStatus);
router.post('/:id/resend-invite', authenticate, resendInvite);

export default router;
