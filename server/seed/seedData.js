import {
  Course,
  Lesson,
  Module,
  Permission,
  PolicyCategory,
  Questionnaire,
  Role,
  SDG,
} from '../models/index.js';
import { learningHubCourse, learningModules } from './learningModules.js';

const permissionGroups = {
  auth: ['read', 'create', 'update', 'delete'],
  users: ['read', 'create', 'update', 'delete'],
  organizations: ['read', 'create', 'update'],
  questionnaire: ['read', 'create', 'update'],
  material_topics: ['read', 'create', 'update', 'delete'],
  goals: ['read', 'create', 'update', 'delete'],
  kpis: ['read', 'create', 'update', 'delete'],
  policies: ['read', 'create', 'update', 'delete'],
  reports: ['read', 'create', 'generate', 'delete'],
  learning: ['read', 'update'],
  billing: ['read', 'update'],
  audit_logs: ['read'],
  admin: ['read', 'update'],
};

const sdgs = [
  [1, 'No Poverty', '#E5243B'],
  [2, 'Zero Hunger', '#DDA63A'],
  [3, 'Good Health and Well-being', '#4C9F38'],
  [4, 'Quality Education', '#C5192D'],
  [5, 'Gender Equality', '#FF3A21'],
  [6, 'Clean Water and Sanitation', '#26BDE2'],
  [7, 'Affordable and Clean Energy', '#FCC30B'],
  [8, 'Decent Work and Economic Growth', '#A21942'],
  [9, 'Industry, Innovation and Infrastructure', '#FD6925'],
  [10, 'Reduced Inequalities', '#DD1367'],
  [11, 'Sustainable Cities and Communities', '#FD9D24'],
  [12, 'Responsible Consumption and Production', '#BF8B2E'],
  [13, 'Climate Action', '#3F7E44'],
  [14, 'Life Below Water', '#0A97D9'],
  [15, 'Life on Land', '#56C02B'],
  [16, 'Peace, Justice and Strong Institutions', '#00689D'],
  [17, 'Partnerships for the Goals', '#19486A'],
];

const rolePermissionMap = {
  subscriber: ['questionnaire:read', 'questionnaire:update', 'learning:read', 'learning:update', 'reports:read'],
  esg_manager: [
    'questionnaire:read',
    'questionnaire:update',
    'material_topics:read',
    'material_topics:create',
    'material_topics:update',
    'goals:read',
    'goals:create',
    'goals:update',
    'kpis:read',
    'kpis:create',
    'kpis:update',
    'policies:read',
    'policies:create',
    'policies:update',
    'reports:read',
    'reports:create',
    'reports:generate',
    'learning:read',
    'learning:update',
  ],
  organization_admin: [
    'users:read',
    'users:create',
    'users:update',
    'organizations:read',
    'organizations:update',
    'billing:read',
    'billing:update',
    'audit_logs:read',
    'learning:read',
    'learning:update',
  ],
  platform_super_admin: [],
};

const compassQuestions = [
  ['Do you measure energy consumption monthly?', 'environmental'],
  ['Do you track workplace health, safety, and inclusion indicators?', 'social'],
  ['Do you maintain documented governance and ethics policies?', 'governance'],
  ['Do you have annual ESG objectives approved by leadership?', 'governance'],
  ['Do you monitor waste, water, or emissions reduction initiatives?', 'environmental'],
];

export const seedDatabase = async () => {
  const permissions = [];

  for (const [resource, actions] of Object.entries(permissionGroups)) {
    for (const action of actions) {
      const key = `${resource}:${action}`;
      const permission = await Permission.findOneAndUpdate(
        { key },
        {
          key,
          name: `${resource.replaceAll('_', ' ')} ${action}`,
          category: resource,
          description: `Allows ${action} access for ${resource.replaceAll('_', ' ')}.`,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      permissions.push(permission);
    }
  }

  const permissionByKey = new Map(permissions.map((permission) => [permission.key, permission._id]));
  const allPermissionIds = permissions.map((permission) => permission._id);

  for (const [key, explicitKeys] of Object.entries(rolePermissionMap)) {
    const selectedPermissionIds = key === 'platform_super_admin'
      ? allPermissionIds
      : explicitKeys.map((permissionKey) => permissionByKey.get(permissionKey)).filter(Boolean);

    await Role.findOneAndUpdate(
      { key, organization: null },
      {
        key,
        name: key.replaceAll('_', ' '),
        description: `System role for ${key.replaceAll('_', ' ')} users.`,
        permissions: selectedPermissionIds,
        isSystem: true,
        organization: null,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  for (const [number, name, color] of sdgs) {
    await SDG.findOneAndUpdate(
      { number },
      { number, name, color, description: `${name} aligned ESG impact area.` },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  await PolicyCategory.findOneAndUpdate(
    { organization: null, name: 'Environmental Management' },
    {
      organization: null,
      name: 'Environmental Management',
      pillar: 'environmental',
      description: 'System category for emissions, energy, water, waste, and resource policies.',
      isSystem: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const questionnaire = await Questionnaire.findOneAndUpdate(
    { type: 'compass', version: 1 },
    {
      $setOnInsert: {
        title: 'Sustainability Compass',
        description: 'A fast ESG maturity assessment for visitors and onboarding teams.',
        type: 'compass',
        version: 1,
        questions: compassQuestions.map(([prompt, pillar]) => ({
          prompt,
          pillar,
          inputType: 'scale',
          weight: 2,
          required: true,
          options: [
            { label: 'Not started', value: '1' },
            { label: 'Basic', value: '2' },
            { label: 'Managed', value: '3' },
            { label: 'Advanced', value: '4' },
            { label: 'Leading', value: '5' },
          ],
        })),
      },
      $set: { isPublished: true },
    },
    { upsert: true, new: true },
  );

  const legacyCourse = await Course.findOne({ title: 'ESG Foundations for SMEs' }).lean();
  if (legacyCourse) {
    await Lesson.deleteMany({ course: legacyCourse._id });
    await Module.deleteMany({ course: legacyCourse._id });
    await Course.deleteOne({ _id: legacyCourse._id });
  }

  const totalDurationMinutes = learningModules.reduce((sum, item) => sum + item.durationMinutes, 0);

  const course = await Course.findOneAndUpdate(
    { title: learningHubCourse.title },
    {
      title: learningHubCourse.title,
      description: learningHubCourse.description,
      pillar: 'cross_pillar',
      level: 'beginner',
      durationMinutes: totalDurationMinutes,
      isPublished: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  for (const [index, moduleData] of learningModules.entries()) {
    const order = index + 1;
    const module = await Module.findOneAndUpdate(
      { course: course._id, order },
      {
        course: course._id,
        title: moduleData.title,
        description: moduleData.description,
        order,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await Lesson.findOneAndUpdate(
      { module: module._id, order: 1 },
      {
        course: course._id,
        module: module._id,
        title: moduleData.title,
        content: moduleData.content,
        contentType: 'article',
        durationMinutes: moduleData.durationMinutes,
        order: 1,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  return { permissions: permissions.length, questionnaire: questionnaire.title, course: course.title, modules: learningModules.length };
};
