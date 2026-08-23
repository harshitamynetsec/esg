import {
  AssessmentResult,
  Goal,
  KPI,
  KPIHistory,
  MaterialTopic,
  Notification,
  Objective,
  Policy,
  Report,
} from '../models/index.js';
import { getSelectedReportSdgs } from '../services/pdfReportService.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const organizationFilter = (req) => ({ organization: req.organizationId });
const pillars = ['environmental', 'social', 'governance'];

const emptyPillarScores = () => pillars.map((pillar) => ({ pillar, score: 0 }));

const toScoreRows = (scores = {}) =>
  pillars.map((pillar) => ({
    pillar,
    score: Math.round(Number(scores[pillar] || 0)),
  }));

const calculateGoalProgress = (goal) => {
  const baseline = Number(goal.baselineValue || 0);
  const target = Number(goal.targetValue || 0);
  const current = Number(goal.currentValue || 0);
  const range = target - baseline;

  if (range <= 0) return 0;
  return Math.round(Math.max(0, Math.min(((current - baseline) / range) * 100, 100)));
};

const buildActivity = ({ type, label, detail, occurredAt, source }) => ({
  type,
  label,
  detail,
  occurredAt,
  source,
});

const buildRecentActivities = ({ latestAssessmentResult, kpiHistories, reports, policies }) => {
  const activities = [];

  if (latestAssessmentResult) {
    activities.push(
      buildActivity({
        type: 'assessment',
        label: 'ESG assessment completed',
        detail: `Overall score ${latestAssessmentResult.pillarScores?.overall ?? 0}%`,
        occurredAt: latestAssessmentResult.completedAt || latestAssessmentResult.updatedAt,
        source: latestAssessmentResult._id,
      }),
    );
  }

  kpiHistories.forEach((history) => {
    activities.push(
      buildActivity({
        type: 'kpi_history',
        label: history.kpi?.name ? `${history.kpi.name} updated` : 'KPI updated',
        detail: `Value recorded: ${history.value}`,
        occurredAt: history.periodEnd || history.updatedAt || history.createdAt,
        source: history._id,
      }),
    );
  });

  reports.forEach((report) => {
    activities.push(
      buildActivity({
        type: 'report',
        label: `${report.title} generated`,
        detail: report.status ? `Status: ${report.status}` : 'Report activity',
        occurredAt: report.updatedAt || report.createdAt,
        source: report._id,
      }),
    );
  });

  policies.forEach((policy) => {
    activities.push(
      buildActivity({
        type: 'policy',
        label: `${policy.title} updated`,
        detail: policy.status ? `Status: ${policy.status}` : 'Policy activity',
        occurredAt: policy.updatedAt || policy.createdAt,
        source: policy._id,
      }),
    );
  });

  return activities
    .filter((activity) => activity.occurredAt)
    .sort((left, right) => new Date(right.occurredAt) - new Date(left.occurredAt))
    .slice(0, 8);
};

const getRecommendedKpiTemplates = async (assessmentResult) => {
  if (!assessmentResult) {
    return [];
  }

  const selectedSdgNumbers = getSelectedReportSdgs(assessmentResult)
    .map((sdg) => Number(sdg))
    .filter((sdg) => Number.isInteger(sdg) && sdg >= 1 && sdg <= 17);

  if (!selectedSdgNumbers.length) {
    return [];
  }

  return KPI.db
    .collection('kpi_templates')
    .find(
      { sdgNumber: { $in: selectedSdgNumbers } },
      {
        projection: {
          _id: 0,
          code: 1,
          name: 1,
          description: 1,
          target: 1,
          unit: 1,
          sdgNumber: 1,
          sdgName: 1,
          sdgId: 1,
        },
      },
    )
    .sort({ sdgNumber: 1, code: 1 })
    .toArray();
};

export const getDashboard = asyncHandler(async (req, res) => {
  const filter = organizationFilter(req);

  const [
    kpis,
    materialTopics,
    materialTopicCount,
    policies,
    reports,
    latestAssessmentResult,
    goals,
    activeObjectiveCount,
    kpiHistories,
    notifications,
  ] = await Promise.all([
    KPI.find(filter).sort('pillar name').lean(),
    MaterialTopic.find(filter).sort('-impactScore -stakeholderPriority').limit(8).lean(),
    MaterialTopic.countDocuments(filter),
    Policy.find(filter).sort('-updatedAt').limit(5).lean(),
    Report.find(filter).sort('-createdAt').limit(5).lean(),
    AssessmentResult.findOne({ ...filter, status: 'completed' }).sort('-completedAt').lean(),
    Goal.find({ ...filter, status: 'active' }).sort('dueDate').limit(5).lean(),
    Objective.countDocuments({ ...filter, status: 'active' }),
    KPIHistory.find(filter).populate('kpi').sort('-periodEnd').limit(8).lean(),
    Notification.find({ ...filter, user: req.user._id, readAt: null }).sort('-createdAt').limit(8).lean(),
  ]);

  const assessmentMaterialTopics = latestAssessmentResult?.selectedMaterialTopics || [];
  const effectiveMaterialTopics = assessmentMaterialTopics.length ? assessmentMaterialTopics : materialTopics;
  const effectiveMaterialTopicCount = assessmentMaterialTopics.length ? assessmentMaterialTopics.length : materialTopicCount;

  const totals = {
    kpis: kpis.length,
    policies: policies.length,
    materialTopics: effectiveMaterialTopicCount,
    reports: reports.length,
    activeObjectives: activeObjectiveCount,
  };

  const pillarScores = latestAssessmentResult ? toScoreRows(latestAssessmentResult.pillarScores) : emptyPillarScores();
  const goalsWithProgress = goals.map((goal) => ({
    ...goal,
    name: goal.title,
    progress: calculateGoalProgress(goal),
  }));
  const recentActivities = buildRecentActivities({
    latestAssessmentResult,
    kpiHistories,
    reports,
    policies,
  });
  const recommendedKpis = await getRecommendedKpiTemplates(latestAssessmentResult);

  ok(res, {
    totals,
    pillarScores,
    recentAssessment: latestAssessmentResult
      ? {
          ...latestAssessmentResult,
          scores: latestAssessmentResult.pillarScores,
        }
      : null,
    materialTopics: effectiveMaterialTopics,
    goals: goalsWithProgress,
    policies,
    reports,
    recentActivities,
    recommendedKpiCount: recommendedKpis.length,
    recommendedKpis,
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
