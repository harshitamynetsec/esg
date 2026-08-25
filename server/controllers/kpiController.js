import { KPI, MaterialTopic, Objective } from '../models/index.js';
import { created } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const resolvePillar = async (objectiveId) => {
  if (!objectiveId) return 'environmental';
  const objective = await Objective.findById(objectiveId).lean();
  const materialTopicId = objective?.materialTopics?.[0] || objective?.materialTopic;
  if (!materialTopicId) return 'environmental';
  const materialTopic = await MaterialTopic.findById(materialTopicId).lean();
  return materialTopic?.pillar || 'environmental';
};

export const quickCreateKPI = asyncHandler(async (req, res) => {
  if (!req.organizationId) {
    throw new AppError('An organization is required to add a KPI', 400, 'ORGANIZATION_REQUIRED');
  }

  const { name, trackingStatus, progressStage, startDate, targetDate, objective } = req.body;
  const pillar = await resolvePillar(objective);

  const kpi = await KPI.create({
    organization: req.organizationId,
    objective: objective || undefined,
    name,
    pillar,
    unit: 'count',
    targetValue: 0,
    frequency: 'quarterly',
    trackingStatus,
    progressStage,
    startDate: startDate || undefined,
    targetDate: targetDate || undefined,
    owner: req.user._id,
  });
  created(res, kpi, 'KPI added');
});
