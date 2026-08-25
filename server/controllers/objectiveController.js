import { Objective } from '../models/index.js';
import { created, ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const quickCreateObjective = asyncHandler(async (req, res) => {
  if (!req.organizationId) {
    throw new AppError('An organization is required to add an objective', 400, 'ORGANIZATION_REQUIRED');
  }

  const { title, materialTopics } = req.body;
  const startDate = new Date();
  const targetDate = new Date(startDate);
  targetDate.setFullYear(targetDate.getFullYear() + 1);

  const objective = await Objective.create({
    organization: req.organizationId,
    title,
    materialTopics: Array.isArray(materialTopics) ? materialTopics : [],
    owner: req.user._id,
    startDate,
    targetDate,
    smart: {
      specific: title,
      measurable: 'Tracked through linked KPIs and periodic progress reviews.',
      achievable: 'Scoped to be achievable within current organizational capacity.',
      relevant: 'Aligned with the organization\'s ESG priorities.',
      timeBound: `Targeted for completion by ${targetDate.toDateString()}.`,
    },
  });
  created(res, objective, 'Objective added');
});

export const listObjectives = (req, baseFilter) => {
  const { $or: searchFilter, ...filter } = baseFilter;
  delete filter.organization;
  const organization = req.user?.roleKey === 'platform_super_admin' && req.query.organization
    ? req.query.organization
    : req.organizationId;
  const organizationFilter = { organization: { $in: organization ? [organization, null] : [null] } };

  return searchFilter
    ? { ...filter, $and: [organizationFilter, { $or: searchFilter }] }
    : { ...filter, ...organizationFilter };
};

export const activateObjective = asyncHandler(async (req, res) => {
  if (!req.organizationId) {
    throw new AppError('An organization is required to activate an objective', 400, 'ORGANIZATION_REQUIRED');
  }

  const template = await Objective.findOne({ _id: req.params.id, organization: null }).lean();
  if (!template) {
    throw new AppError('Objective template not found', 404, 'NOT_FOUND');
  }

  const existing = await Objective.findOne({
    organization: req.organizationId,
    sdgNumber: template.sdgNumber,
    title: template.title,
  });
  if (existing) {
    ok(res, existing, 'Objective already active');
    return;
  }

  const templateData = { ...template };
  delete templateData._id;
  delete templateData.createdAt;
  delete templateData.updatedAt;
  delete templateData.organization;
  const objective = await Objective.create({
    ...templateData,
    organization: req.organizationId,
  });
  created(res, objective, 'Objective activated');
});