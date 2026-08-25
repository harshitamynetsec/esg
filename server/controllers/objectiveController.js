import { Objective } from '../models/index.js';
import { created, ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listObjectives = (req, baseFilter) => {
  const { $or: searchFilter, ...filter } = baseFilter;
  const organization = req.user?.roleKey === 'platform_super_admin' && req.query.organization
    ? req.query.organization
    : req.organizationId;
  const organizationFilter = organization
    ? { $or: [{ organization }, { organization: null }] }
    : { organization: null };

  return searchFilter ? { ...filter, $and: [organizationFilter, { $or: searchFilter }] } : { ...filter, ...organizationFilter };
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