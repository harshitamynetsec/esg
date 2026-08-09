import { AuditLog } from '../models/index.js';
import { logger } from '../utils/logger.js';

export const auditAction = (action, resource) => async (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = async (body) => {
    try {
      await AuditLog.create({
        organization: req.organizationId,
        actor: req.user?._id,
        action,
        resource,
        resourceId: req.params.id,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        after: body?.data,
        outcome: res.statusCode >= 400 ? 'failure' : 'success',
      });
    } catch (error) {
      logger.warn('Audit log write failed', { error: error.message });
    }

    return originalJson(body);
  };

  next();
};
