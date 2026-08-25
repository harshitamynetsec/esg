import {
  buildAssessmentQuestions,
  buildDashboardAnalytics,
  evaluateAndSaveAssessment,
  fetchAllMaterialTopics,
  getLatestAssessmentResult,
} from '../services/assessmentEvaluationService.js';
import { generateAssessmentPdf } from '../services/pdfReportService.js';
import { ok, created } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getUserId = (req) => req?.params?.userId || req?.body?.userId || req?.user?._id;

export const listMaterialTopics = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const result = await fetchAllMaterialTopics(req.organizationId, { page, limit });
  ok(res, result.data, 'Material topics fetched', 200, result.meta);
});

export const startAssessment = asyncHandler(async (req, res) => {
  const questions = await buildAssessmentQuestions(req.body.selectedTopicIds || []);
  ok(res, { questions }, 'Assessment questions generated');
});

export const submitAssessment = asyncHandler(async (req, res) => {
  const result = await evaluateAndSaveAssessment({
    userId: getUserId(req),
    answers: req.body.answers || [],
    selectedTopicIds: req.body.selectedTopicIds || [],
  });
  created(res, result, 'Assessment evaluated');
});

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const analytics = await buildDashboardAnalytics(getUserId(req));
  ok(res, analytics, 'Dashboard analytics');
});

export const generateReport = asyncHandler(async (req, res) => {
  const assessmentResult = await getLatestAssessmentResult(getUserId(req));
  const pdfBuffer = await generateAssessmentPdf(assessmentResult);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="esg-assessment-${assessmentResult._id}.pdf"`);
  res.setHeader('Content-Length', pdfBuffer.length);
  res.status(200).send(pdfBuffer);
});
