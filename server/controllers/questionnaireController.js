import { Assessment, Questionnaire, QuestionnaireResponse } from '../models/index.js';
import { created, ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { evaluateAssessment } from '../services/evaluationService.js';

export const getQuestionnaire = asyncHandler(async (req, res) => {
  const type = req.query.type || 'compass';
  const questionnaire = await Questionnaire.findOne({ type, isPublished: true }).sort('-version').lean();
  ok(res, questionnaire, 'Questionnaire');
});

export const submitQuestionnaire = asyncHandler(async (req, res) => {
  const questionnaire = await Questionnaire.findById(req.body.questionnaire);
  const answers = (req.body.answers || []).map((answer) => ({
    questionId: answer.questionId,
    selectedValue: answer.selectedValue ?? answer.value,
    value: answer.value ?? answer.selectedValue,
  }));
  const evaluation = await evaluateAssessment({ questionnaireId: questionnaire._id, answers }, req.organizationId);
  const scores = {
    ...evaluation.pillarScores,
    overall: Math.round(
      (evaluation.pillarScores.environmental + evaluation.pillarScores.social + evaluation.pillarScores.governance) / 3,
    ),
  };

  const assessment = await Assessment.create({
    organization: req.organizationId,
    user: req.user?._id,
    respondentEmail: req.body.respondentEmail || req.user?.email,
    type: questionnaire.type,
    scores,
    status: 'completed',
    completedAt: new Date(),
    recommendations: evaluation.actionAreas.slice(0, 5).map((area) => `Improve ${area.materialTopic} for SDG ${area.linkedSdg}`),
  });

  const response = await QuestionnaireResponse.create({
    organization: req.organizationId,
    user: req.user?._id,
    questionnaire: questionnaire._id,
    assessment: assessment._id,
    answers: answers.map((answer) => ({
      questionId: answer.questionId,
      value: answer.value,
      score: Number(answer.value) * 25,
    })),
    status: 'submitted',
    submittedAt: new Date(),
  });

  created(res, { assessment, response, evaluation }, 'Questionnaire submitted');
});
