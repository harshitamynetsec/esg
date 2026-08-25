import { Router } from 'express';
import { body } from 'express-validator';
import { createCrudController } from '../controllers/crudController.js';
import {
  AuditLog,
  Goal,
  KPI,
  KPIHistory,
  MaterialTopic,
  Notification,
  Objective,
  Organization,
  Policy,
  Role,
  Subscription,
  User,
} from '../models/index.js';
import { crudRoutes } from './crudRoutes.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { auditAction } from '../middleware/audit.js';
import { activateObjective, listObjectives, quickCreateObjective } from '../controllers/objectiveController.js';
import { quickCreateKPI } from '../controllers/kpiController.js';
import { validate } from '../middleware/validate.js';
import { idParamValidator } from '../validators/commonValidators.js';

const router = Router();

const mount = (path, model, options, permissions) => {
  router.use(path, crudRoutes(createCrudController(model, options), permissions));
};

mount(
  '/users',
  User,
  { resourceName: 'User', searchFields: ['firstName', 'lastName', 'email'], populate: ['organization', 'roles'] },
  { resource: 'users', read: 'users:read', create: 'users:create', update: 'users:update', delete: 'users:delete' },
);
mount(
  '/organizations',
  Organization,
  { resourceName: 'Organization', organizationScoped: false, searchFields: ['name', 'industry', 'contactEmail'] },
  {
    resource: 'organizations',
    read: 'organizations:read',
    create: 'organizations:create',
    update: 'organizations:update',
    delete: 'admin:update',
  },
);
mount(
  '/roles',
  Role,
  { resourceName: 'Role', organizationScoped: false, searchFields: ['name', 'key'] },
  { resource: 'roles', read: 'users:read', create: 'users:create', update: 'users:update', delete: 'users:delete' },
);
mount(
  '/material-topics',
  MaterialTopic,
  { resourceName: 'Material topic', searchFields: ['title', 'description'], populate: ['sdgs', 'owner'] },
  {
    resource: 'material_topics',
    read: 'material_topics:read',
    create: 'material_topics:create',
    update: 'material_topics:update',
    delete: 'material_topics:delete',
  },
);
mount(
  '/objectives',
  Objective,
  {
    resourceName: 'Objective',
    searchFields: ['title', 'description'],
    populate: ['materialTopic', 'owner'],
    listFilter: listObjectives,
  },
  { resource: 'objectives', read: 'goals:read', create: 'goals:create', update: 'goals:update', delete: 'goals:delete' },
);
router.post(
  '/objectives/:id/activate',
  authenticate,
  authorize('goals:create'),
  idParamValidator,
  validate,
  auditAction('create', 'objectives'),
  activateObjective,
);
router.post(
  '/objectives/quick-add',
  authenticate,
  authorize('goals:create'),
  body('title').trim().isLength({ min: 5, max: 160 }).withMessage('Objective must be 5-160 characters'),
  body('materialTopics').optional().isArray(),
  body('materialTopics.*').optional().isMongoId(),
  validate,
  auditAction('create', 'objectives'),
  quickCreateObjective,
);
mount(
  '/goals',
  Goal,
  { resourceName: 'Goal', searchFields: ['title', 'description'], populate: ['objective'] },
  { resource: 'goals', read: 'goals:read', create: 'goals:create', update: 'goals:update', delete: 'goals:delete' },
);
mount(
  '/kpis',
  KPI,
  { resourceName: 'KPI', searchFields: ['name', 'description'], populate: ['materialTopic', 'objective', 'goal', 'owner'] },
  { resource: 'kpis', read: 'kpis:read', create: 'kpis:create', update: 'kpis:update', delete: 'kpis:delete' },
);
router.post(
  '/kpis/quick-add',
  authenticate,
  authorize('kpis:create'),
  body('name').trim().isLength({ min: 2, max: 140 }).withMessage('KPI name must be 2-140 characters'),
  body('trackingStatus').optional().isIn(['not_started', 'in_progress', 'completed']),
  body('progressStage').optional().isIn(['early', 'mid', 'late']),
  body('startDate').optional({ checkFalsy: true }).isISO8601(),
  body('targetDate').optional({ checkFalsy: true }).isISO8601(),
  body('objective').optional({ checkFalsy: true }).isMongoId(),
  validate,
  auditAction('create', 'kpis'),
  quickCreateKPI,
);
mount(
  '/kpi-history',
  KPIHistory,
  { resourceName: 'KPI history', searchFields: ['note'], populate: ['kpi', 'evidenceUpload', 'recordedBy'] },
  { resource: 'kpis', read: 'kpis:read', create: 'kpis:update', update: 'kpis:update', delete: 'kpis:delete' },
);
mount(
  '/policies',
  Policy,
  { resourceName: 'Policy', searchFields: ['title', 'summary', 'content'], populate: ['category', 'owner', 'approver'] },
  {
    resource: 'policies',
    read: 'policies:read',
    create: 'policies:create',
    update: 'policies:update',
    delete: 'policies:delete',
  },
);
mount(
  '/notifications',
  Notification,
  { resourceName: 'Notification', searchFields: ['title', 'message'] },
  { resource: 'notifications', read: 'users:read', create: 'users:update', update: 'users:update', delete: 'users:update' },
);
mount(
  '/subscriptions',
  Subscription,
  { resourceName: 'Subscription', searchFields: ['plan', 'status'] },
  { resource: 'billing', read: 'billing:read', create: 'billing:update', update: 'billing:update', delete: 'billing:update' },
);
mount(
  '/audit-logs',
  AuditLog,
  { resourceName: 'Audit log', searchFields: ['action', 'resource'] },
  { resource: 'audit_logs', read: 'audit_logs:read', create: 'admin:update', update: 'admin:update', delete: 'admin:update' },
);

export default router;
