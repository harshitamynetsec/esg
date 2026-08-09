import { KPI, Policy, Report, ReportVersion } from '../models/index.js';
import { created } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const generateReport = asyncHandler(async (req, res) => {
  const [kpis, policies] = await Promise.all([
    KPI.find({ organization: req.organizationId }).lean(),
    Policy.find({ organization: req.organizationId }).lean(),
  ]);

  const metricsSnapshot = {
    kpis: kpis.length,
    policies: policies.length,
    averageKpiProgress: kpis.length
      ? Math.round(
          kpis.reduce((sum, kpi) => sum + Math.min((kpi.currentValue / Math.max(kpi.targetValue, 1)) * 100, 100), 0) /
            kpis.length,
        )
      : 0,
    generatedAt: new Date().toISOString(),
  };

  const report = await Report.create({
    organization: req.organizationId,
    title: req.body.title,
    type: req.body.type,
    periodStart: req.body.periodStart,
    periodEnd: req.body.periodEnd,
    status: 'ready',
    generatedBy: req.user._id,
    summary: `Generated ${req.body.type.replaceAll('_', ' ')} report with ${kpis.length} KPI records and ${policies.length} policies.`,
    metricsSnapshot,
  });

  const version = await ReportVersion.create({
    organization: req.organizationId,
    report: report._id,
    version: 1,
    createdBy: req.user._id,
    content: {
      title: report.title,
      summary: report.summary,
      metricsSnapshot,
      kpis,
      policies,
    },
  });

  created(res, { report, version }, 'Report generated');
});
