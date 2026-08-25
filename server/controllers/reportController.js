import { KPI, Policy, Report, ReportVersion } from '../models/index.js';
import { created, ok } from '../utils/apiResponse.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateManagementReportPdf } from '../services/managementReportPdfService.js';
import { streamGridFSFile, uploadBufferToGridFS } from '../utils/gridfs.js';

const findOrgReport = async (req) => {
  const report = await Report.findOne({ _id: req.params.id, organization: req.organizationId }).lean();
  if (!report) {
    throw new AppError('Report not found', 404, 'NOT_FOUND');
  }
  return report;
};

const findLatestVersion = (reportId) => ReportVersion.findOne({ report: reportId }).sort('-version').lean();

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

  const pdfBuffer = await generateManagementReportPdf({ report, kpis, policies });
  const pdfFileId = await uploadBufferToGridFS(pdfBuffer, `${report._id}.pdf`, {
    organization: String(req.organizationId),
    report: String(report._id),
  });

  const version = await ReportVersion.create({
    organization: req.organizationId,
    report: report._id,
    version: 1,
    createdBy: req.user._id,
    pdfFileId,
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

export const getReportDetail = asyncHandler(async (req, res) => {
  const report = await findOrgReport(req);
  const version = await findLatestVersion(report._id);
  ok(res, { report, version }, 'Report detail');
});

export const downloadReportPdf = asyncHandler(async (req, res) => {
  const report = await findOrgReport(req);
  const version = await findLatestVersion(report._id);
  if (!version?.pdfFileId) {
    throw new AppError('No PDF is available for this report', 404, 'PDF_NOT_AVAILABLE');
  }
  streamGridFSFile(version.pdfFileId, res, {
    filename: `${report.title.replace(/[^a-z0-9]+/gi, '-')}.pdf`,
    contentType: 'application/pdf',
  });
});
