import {
  Assessment,
  KPI,
  KPIHistory,
  MaterialTopic,
  Notification,
  Policy,
  Report,
} from '../models/index.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const organizationFilter = (req) => ({ organization: req.organizationId });

export const getDashboard = asyncHandler(async (req, res) => {
  const filter = organizationFilter(req);

  const [kpis, materialTopics, policies, reports, assessments, notifications] = await Promise.all([
    KPI.find(filter).sort('pillar name').lean(),
    MaterialTopic.find(filter).sort('-impactScore -stakeholderPriority').limit(8).lean(),
    Policy.find(filter).sort('-updatedAt').limit(5).lean(),
    Report.find(filter).sort('-createdAt').limit(5).lean(),
    Assessment.find(filter).sort('-createdAt').limit(1).lean(),
    Notification.find({ ...filter, user: req.user._id, readAt: null }).sort('-createdAt').limit(8).lean(),
  ]);

  const totals = {
    kpis: kpis.length,
    policies: policies.length,
    materialTopics: materialTopics.length,
    reports: reports.length,
  };

  const pillarScores = ['environmental', 'social', 'governance'].map((pillar) => {
    const pillarKpis = kpis.filter((kpi) => kpi.pillar === pillar);
    const score = pillarKpis.length
      ? Math.round(
          pillarKpis.reduce((sum, kpi) => sum + Math.min((kpi.currentValue / Math.max(kpi.targetValue, 1)) * 100, 100), 0) /
            pillarKpis.length,
        )
      : 0;
    return { pillar, score };
  });

  ok(res, {
    totals,
    pillarScores,
    recentAssessment: assessments[0] || null,
    materialTopics,
    policies,
    reports,
    notifications,
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const filter = organizationFilter(req);
  const kpis = await KPI.find(filter).lean();
  const histories = await KPIHistory.find(filter).sort('periodEnd').lean();

  const trend = histories.map((item) => ({
    kpi: item.kpi,
    value: item.value,
    periodEnd: item.periodEnd,
  }));

  const kpiPerformance = kpis.map((kpi) => ({
    id: kpi._id,
    name: kpi.name,
    pillar: kpi.pillar,
    currentValue: kpi.currentValue,
    targetValue: kpi.targetValue,
    progress: Math.round(Math.min((kpi.currentValue / Math.max(kpi.targetValue, 1)) * 100, 100)),
  }));

  ok(res, { trend, kpiPerformance });
});
