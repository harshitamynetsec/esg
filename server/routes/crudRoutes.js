import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';
import { validate } from '../middleware/validate.js';
import { idParamValidator, paginationValidator } from '../validators/commonValidators.js';

export const crudRoutes = (controller, permissions) => {
  const router = Router();

  router.use(authenticate);
  router
    .route('/')
    .get(authorize(permissions.read), paginationValidator, validate, controller.list)
    .post(authorize(permissions.create), auditAction('create', permissions.resource), controller.create);

  router
    .route('/:id')
    .get(authorize(permissions.read), idParamValidator, validate, controller.get)
    .put(authorize(permissions.update), idParamValidator, validate, auditAction('update', permissions.resource), controller.update)
    .delete(
      authorize(permissions.delete),
      idParamValidator,
      validate,
      auditAction('delete', permissions.resource),
      controller.remove,
    );

  return router;
};
