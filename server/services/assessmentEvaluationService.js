import { AssessmentResult, KPI, MaterialTopic, Question, Questionnaire, User, SDG } from '../models/index.js';
import { AppError } from '../utils/AppError.js';

const PILLARS = ['environmental', 'social', 'governance'];
const MIN_SCORE = 0;
const MAX_SCORE = 4;

const normalizeId = (value) => value?._id?.toString?.() || value?.toString?.() || String(value);

const normalizeSdg = (sdg) => {
  if (sdg == null) return null;
  if (typeof sdg === 'object') {
    return String(sdg.number || sdg.code || sdg.value || sdg._id || '').trim();
  }
  return String(sdg).trim();
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const validateSelectedValue = (value) => {
  const selectedValue = Number(value);
  if (!Number.isInteger(selectedValue) || selectedValue < MIN_SCORE || selectedValue > MAX_SCORE) {
    throw new AppError(`Answer selectedValue must be an integer from ${MIN_SCORE} to ${MAX_SCORE}`, 400, 'INVALID_ANSWER_SCORE');
  }
  return selectedValue;
};

const getQuestionText = (question) => question.text || question.prompt || question.indicator || question.objective || 'Assessment question';

const getPublishedAssessmentQuestionnaire = async () => {
  const typeFilter = { type: { $in: ['onboarding', 'compass'] } };
  const publishedQuestionnaire = await Questionnaire.findOne({ ...typeFilter, isPublished: true })
    .sort({ type: -1, version: -1, createdAt: -1 })
    .lean();

  return publishedQuestionnaire || Questionnaire.findOne(typeFilter).sort({ type: -1, version: -1, createdAt: -1 }).lean();
};

const getQuestionnaireQuestions = async () => {
  const questionnaire = await getPublishedAssessmentQuestionnaire();
  return questionnaire?.questions || [];
};

const serializeTopic = (topic) => ({
  materialTopic: topic._id,
  title: topic.title,
  pillar: topic.pillar,
  sdgs: unique((topic.sdgs || []).map(normalizeSdg)),
});

const serializeQuestionTopics = (question) => (question.materialTopics || []).map(serializeTopic);

const serializeGapOrStrength = ({ question, selectedValue }) => ({
  question: question._id,
  questionText: getQuestionText(question),
  selectedValue,
  pillar: question.pillar,
  materialTopics: serializeQuestionTopics(question),
  sdgs: unique((question.sdgs || []).map(normalizeSdg)),
});

const normalizePillar = (pillar) => {
  if (!pillar) return 'governance';
  const str = String(pillar).trim().toLowerCase();
  if (str === 'g' || str === 'governance' || str.includes('gov')) return 'governance';
  if (str === 'e' || str === 'environmental' || str.includes('env')) return 'environmental';
  if (str === 's' || str === 'social' || str.includes('soc')) return 'social';
  return str;
};

const calculatePillarScores = (evaluatedAnswers) => {
  const totals = PILLARS.reduce((accumulator, pillar) => {
    accumulator[pillar] = { numerator: 0, denominator: 0 };
    return accumulator;
  }, {});

  evaluatedAnswers.forEach(({ question, selectedValue }) => {
    const pillarKey = normalizePillar(question.pillar);
    const weight = Number(question.weight || 1);
    if (!totals[pillarKey] || weight <= 0) return;

    // Each answer contributes selectedValue / 4, scaled by the configured question weight.
    totals[pillarKey].numerator += selectedValue * weight;
    totals[pillarKey].denominator += MAX_SCORE * weight;
  });

  const scores = PILLARS.reduce((result, pillar) => {
    const { numerator, denominator } = totals[pillar];
    result[pillar] = denominator ? Math.round((numerator / denominator) * 100) : 0;
    return result;
  }, {});

  const activePillars = PILLARS.filter((p) => totals[p].denominator > 0);
  const divisor = activePillars.length || PILLARS.length;
  scores.overall = Math.round(
    (activePillars.length ? activePillars.reduce((sum, p) => sum + scores[p], 0) : (scores.environmental + scores.social + scores.governance)) / divisor
  );
  return scores;
};

const loadQuestionsForAnswers = async (answers) => {
  const questionIds = answers.map((answer) => answer.questionId).filter(Boolean);
  const questions = await Question.find({ _id: { $in: questionIds }, isActive: true })
    .populate({ path: 'materialTopics', populate: { path: 'sdgs' } })
    .populate('sdgs')
    .lean();

  const questionById = new Map(questions.map((question) => [normalizeId(question._id), question]));
  if (questionById.size < questionIds.length) {
    const questionnaireQuestions = await getQuestionnaireQuestions();
    questionnaireQuestions.forEach((question) => {
      const key = normalizeId(question._id);
      if (questionIds.some((questionId) => normalizeId(questionId) === key) && !questionById.has(key)) {
        questionById.set(key, { ...question, materialTopics: question.materialTopics || [] });
      }
    });
  }

  return answers.map((answer) => {
    const question = questionById.get(normalizeId(answer.questionId));
    if (!question) {
      throw new AppError(`Question not found or inactive: ${normalizeId(answer.questionId)}`, 400, 'QUESTION_NOT_FOUND');
    }

    return {
      question,
      selectedValue: validateSelectedValue(answer.selectedValue ?? answer.value),
    };
  });
};

const getRelevantTopicIds = (items) =>
  unique(items.flatMap(({ question }) => (question.materialTopics || []).map((topic) => normalizeId(topic._id))));

const getRelevantSdgNumbers = (items) =>
  unique(items.flatMap(({ question }) => (question.sdgs || []).map(normalizeSdg)));

const loadRecommendedKpis = async ({ organizationId, gapItems, strengthItems }) => {
  const relevantItems = [...gapItems, ...strengthItems];
  const materialTopicIds = getRelevantTopicIds(relevantItems);
  
  const rawSdgValues = unique(relevantItems.flatMap(({ question }) => (question.sdgs || []).map(normalizeSdg)));
  const numericSdgCodes = [];
  const directSdgIds = [];
  
  rawSdgValues.forEach(value => {
    if (/^[0-9a-fA-F]{24}$/.test(value)) {
      directSdgIds.push(value);
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        numericSdgCodes.push(num);
      }
    }
  });

  const fetchedSdgIds = [];
  if (numericSdgCodes.length > 0) {
    const dbSdgs = await SDG.find({ number: { $in: numericSdgCodes } }).select('_id').lean();
    dbSdgs.forEach(s => fetchedSdgIds.push(s._id.toString()));
  }
  
  const sdgIds = unique([...directSdgIds, ...fetchedSdgIds]);
  const sdgNumbers = getRelevantSdgNumbers(relevantItems);

  if (!materialTopicIds.length && !sdgIds.length) return [];

  const organizationFilter = organizationId ? [{ organization: organizationId }, { organization: null }] : [{ organization: null }];

  const kpis = await KPI.find({
    $and: [
      { $or: organizationFilter },
      { status: { $ne: 'archived' } },
      {
        // Relation traversal:
        // selected/gap Question -> MaterialTopic and SDG -> KPI linked by matching materialTopic or sdgs.
        $or: [{ materialTopic: { $in: materialTopicIds } }, { sdgs: { $in: sdgIds } }],
      },
    ],
  })
    .populate('materialTopic')
    .populate('sdgs')
    .lean();

  const seen = new Set();
  return kpis
    .map((kpi) => {
      const sdg = (kpi.sdgs || []).map(normalizeSdg).find((value) => sdgNumbers.includes(value)) || null;
      return {
        kpi: kpi._id,
        name: kpi.name,
        pillar: kpi.pillar,
        unit: kpi.unit,
        frequency: kpi.frequency,
        materialTopic: kpi.materialTopic?._id || kpi.materialTopic,
        sdg,
      };
    })
    .filter((kpi) => {
      const key = normalizeId(kpi.kpi);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

export const fetchAllMaterialTopics = async (companyId, pagination) => {
  const organizationFilter = companyId ? [{ organization: companyId }, { organization: null }] : [{ organization: null }];

  const scopedFilter = { $or: organizationFilter, status: { $ne: 'archived' } };
  const scopedQuery = MaterialTopic.find(scopedFilter).populate('sdgs').sort('pillar serialNum title').lean();
  const scopedTopics = pagination
    ? await scopedQuery.skip((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    : await scopedQuery;
  const scopedTotal = pagination ? await MaterialTopic.countDocuments(scopedFilter) : scopedTopics.length;

  if (scopedTotal) {
    if (!pagination) return scopedTopics;
    return { data: scopedTopics, meta: { page: pagination.page, limit: pagination.limit, total: scopedTotal, pages: Math.max(Math.ceil(scopedTotal / pagination.limit), 1) } };
  }

  const allFilter = { status: { $ne: 'archived' } };
  const allQuery = MaterialTopic.find(allFilter).populate('sdgs').sort('pillar serialNum title').lean();
  const allTopics = pagination
    ? await allQuery.skip((pagination.page - 1) * pagination.limit).limit(pagination.limit)
    : await allQuery;
  const allTotal = pagination ? await MaterialTopic.countDocuments(allFilter) : allTopics.length;

  if (allTotal) {
    if (!pagination) return allTopics;
    return { data: allTopics, meta: { page: pagination.page, limit: pagination.limit, total: allTotal, pages: Math.max(Math.ceil(allTotal / pagination.limit), 1) } };
  }

  const legacyCollection = MaterialTopic.db.collection('material_topics');
  const legacyFilter = { status: { $ne: 'archived' } };
  const legacyQuery = legacyCollection.find(legacyFilter).sort({ pillar: 1, category: 1, serialNum: 1, title: 1, name: 1 });
  const legacyTopics = pagination
    ? await legacyQuery.skip((pagination.page - 1) * pagination.limit).limit(pagination.limit).toArray()
    : await legacyQuery.toArray();
  const legacyTotal = pagination ? await legacyCollection.countDocuments(legacyFilter) : legacyTopics.length;

  const normalizedLegacyTopics = legacyTopics.map((topic) => ({
    ...topic,
    title: topic.title || topic.name,
    pillar: topic.pillar || topic.category,
    impactScore: topic.impactScore || 3,
    stakeholderPriority: topic.stakeholderPriority || 3,
    financialMateriality: topic.financialMateriality || 3,
    sdgs: topic.sdgs || topic.sdgIds || [],
  }));
  if (!pagination) return normalizedLegacyTopics;
  return {
    data: normalizedLegacyTopics,
    meta: { page: pagination.page, limit: pagination.limit, total: legacyTotal, pages: Math.max(Math.ceil(legacyTotal / pagination.limit), 1) },
  };
};

export const buildAssessmentQuestions = async (selectedTopicIds) => {
  if (!Array.isArray(selectedTopicIds) || !selectedTopicIds.length) {
    throw new AppError('Select at least one material topic before starting the assessment', 400, 'MATERIAL_TOPICS_REQUIRED');
  }

  const topics = await MaterialTopic.find({ _id: { $in: selectedTopicIds } }).populate('sdgs').lean();
  const selectedSdgIds = unique(topics.flatMap((topic) => (topic.sdgs || []).map((sdg) => normalizeId(sdg._id || sdg))));
  const selectedPillars = unique(topics.map((topic) => topic.pillar));
  const selectedSdgValues = unique(topics.flatMap((topic) => (topic.sdgs || []).map(normalizeSdg)));

  const linkedQuestions = await Question.find({
    isActive: true,
    // A question is eligible when it directly references a selected Material Topic
    // or references an SDG attached to a selected Material Topic.
    $or: [{ materialTopics: { $in: selectedTopicIds } }, { sdgs: { $in: selectedSdgIds } }],
  })
    .populate({ path: 'materialTopics', populate: { path: 'sdgs' } })
    .populate('sdgs')
    .sort('pillar order createdAt')
    .lean();

  if (linkedQuestions.length) {
    return linkedQuestions;
  }

  const questionnaireQuestions = await getQuestionnaireQuestions();
  return questionnaireQuestions
    .filter((question) => {
      const questionSdgs = unique((question.sdgs || []).map(normalizeSdg));
      return selectedPillars.includes(question.pillar) || questionSdgs.some((sdg) => selectedSdgValues.includes(sdg));
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const evaluateAndSaveAssessment = async ({ userId, answers, selectedTopicIds = [] }) => {
  if (!userId) {
    throw new AppError('userId is required', 400, 'USER_REQUIRED');
  }

  if (!Array.isArray(answers) || !answers.length) {
    throw new AppError('answers must include at least one response', 400, 'ANSWERS_REQUIRED');
  }

  const user = await User.findById(userId).select('organization').lean();
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const evaluatedAnswers = await loadQuestionsForAnswers(answers);
  const pillarScores = calculatePillarScores(evaluatedAnswers);
  const gapItems = evaluatedAnswers.filter(({ selectedValue }) => selectedValue <= 1);
  const strengthItems = evaluatedAnswers.filter(({ selectedValue }) => selectedValue >= 3);
  const recommendedKpis = await loadRecommendedKpis({
    organizationId: user.organization,
    gapItems,
    strengthItems,
  });

  const selectedTopics = selectedTopicIds.length
    ? await MaterialTopic.find({ _id: { $in: selectedTopicIds } }).populate('sdgs').lean()
    : [];

  const prioritizedMaterialTopics = unique(
    [...gapItems, ...strengthItems].flatMap(({ question }) => (question.materialTopics || []).map((topic) => normalizeId(topic._id))),
  )
    .map((topicId) => [...gapItems, ...strengthItems].flatMap(({ question }) => question.materialTopics || []).find((topic) => normalizeId(topic._id) === topicId))
    .filter(Boolean)
    .map(serializeTopic);

  const result = await AssessmentResult.create({
    user: userId,
    organization: user.organization,
    selectedMaterialTopics: selectedTopics.map(serializeTopic),
    answers: evaluatedAnswers.map(({ question, selectedValue }) => ({
      question: question._id,
      questionText: getQuestionText(question),
      selectedValue,
      weight: Number(question.weight || 1),
      pillar: question.pillar,
    })),
    pillarScores,
    complianceGaps: gapItems.map(serializeGapOrStrength),
    strengths: strengthItems.map(serializeGapOrStrength),
    prioritizedMaterialTopics,
    recommendedKpis,
    status: 'completed',
    completedAt: new Date(),
  });

  return result.toObject();
};

export const getLatestAssessmentResult = async (userId) => {
  const result = await AssessmentResult.findOne({ user: userId, status: 'completed' }).sort('-completedAt').lean();
  if (!result) {
    throw new AppError('Complete the ESG assessment before viewing dashboard analytics', 400, 'ASSESSMENT_REQUIRED');
  }
  return result;
};

export const buildDashboardAnalytics = async (userId) => {
  const result = await getLatestAssessmentResult(userId);
  return {
    assessmentId: result._id,
    completedAt: result.completedAt,
    pillarScores: result.pillarScores,
    prioritizedMaterialTopics: result.prioritizedMaterialTopics,
    kpisToTrack: result.recommendedKpis,
    complianceGaps: result.complianceGaps,
  };
};
