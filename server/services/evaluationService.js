import { MaterialTopic, Questionnaire } from '../models/index.js';

const PILLARS = ['environmental', 'social', 'governance'];
const MIN_SELECTED_VALUE = 0;
const MAX_SELECTED_VALUE = 4;

export const SDG_KPI_MAPPING = Object.freeze({
  1: ['Living wage coverage', 'Community poverty alleviation spend', 'Inclusive procurement ratio'],
  2: ['Sustainable food sourcing ratio', 'Food waste reduction rate', 'Nutrition support coverage'],
  3: ['Lost time injury frequency rate', 'Employee wellbeing participation', 'Health and safety training coverage'],
  4: ['ESG training completion rate', 'Skills development hours', 'Education partnership reach'],
  5: ['Women in leadership ratio', 'Gender pay equity index', 'Anti-harassment training coverage'],
  6: ['Water withdrawal intensity', 'Wastewater compliance rate', 'Water recycling ratio'],
  7: ['Renewable energy share', 'Energy intensity reduction', 'Clean energy investment'],
  8: ['Employee retention rate', 'Supplier labor compliance rate', 'Decent work incident closure time'],
  9: ['Sustainable innovation spend', 'Operational efficiency improvement', 'Resilient infrastructure coverage'],
  10: ['Diversity representation index', 'Accessibility compliance coverage', 'Inclusive supplier spend'],
  11: ['Local community investment', 'Site resilience readiness', 'Urban impact mitigation actions'],
  12: ['Waste diversion rate', 'Circular material input ratio', 'Responsible sourcing coverage'],
  13: ['Scope emissions intensity', 'Climate risk assessment coverage', 'Decarbonization initiative completion'],
  14: ['Water discharge quality score', 'Marine impact mitigation actions', 'Plastic reduction rate'],
  15: ['Biodiversity impact assessments', 'Land restoration area', 'Deforestation-free sourcing coverage'],
  16: ['Code of conduct completion rate', 'Ethics incident closure time', 'Governance policy coverage'],
  17: ['ESG partnership count', 'Framework reporting coverage', 'Stakeholder engagement completion'],
});

const normalizeSubmission = (submissionData) => {
  if (Array.isArray(submissionData)) {
    return { answers: submissionData, questionnaireId: null };
  }

  return {
    answers: submissionData?.answers || [],
    questionnaireId: submissionData?.questionnaireId || submissionData?.questionnaire || null,
  };
};

const normalizeId = (value) => value?._id?.toString?.() || value?.toString?.() || String(value);

const normalizeSdg = (sdg) => {
  if (sdg == null) return null;
  if (typeof sdg === 'object') {
    return String(sdg.number || sdg.code || sdg.value || sdg._id || '').trim();
  }
  return String(sdg).trim();
};

const normalizeSdgs = (sdgs = []) => [...new Set(sdgs.map(normalizeSdg).filter(Boolean))];

const clampSelectedValue = (value) => {
  const selectedValue = Number(value);
  if (!Number.isInteger(selectedValue) || selectedValue < MIN_SELECTED_VALUE || selectedValue > MAX_SELECTED_VALUE) {
    throw new Error(`selectedValue must be an integer between ${MIN_SELECTED_VALUE} and ${MAX_SELECTED_VALUE}`);
  }
  return selectedValue;
};

const getSelectedValue = (answer) => {
  if (answer.selectedValue !== undefined) return clampSelectedValue(answer.selectedValue);
  return clampSelectedValue(answer.value);
};

const buildQuestionIndex = (questionnaire) => {
  const questions = questionnaire?.questions || [];
  return new Map(questions.map((question) => [normalizeId(question._id), question]));
};

const findQuestionnaireForSubmission = async (questionIds, questionnaireId) => {
  if (questionnaireId) {
    return Questionnaire.findById(questionnaireId).lean();
  }

  return Questionnaire.findOne({ 'questions._id': { $in: questionIds } }).sort('-version').lean();
};

const getMaterialTopics = async (companyId) => {
  const companyFilter = companyId ? [{ organization: companyId }, { organization: null }] : [{ organization: null }];
  return MaterialTopic.find({ $or: companyFilter, status: { $ne: 'archived' } })
    .populate('sdgs')
    .lean();
};

const createEmptyPillarAccumulator = () =>
  PILLARS.reduce((accumulator, pillar) => {
    accumulator[pillar] = { numerator: 0, denominator: 0 };
    return accumulator;
  }, {});

const calculatePillarScores = (evaluatedAnswers) => {
  const pillarTotals = createEmptyPillarAccumulator();

  evaluatedAnswers.forEach(({ question, selectedValue }) => {
    const pillar = question.pillar;
    const weight = Number(question.weight || 1);

    if (!pillarTotals[pillar] || weight <= 0) return;

    pillarTotals[pillar].numerator += selectedValue * weight;
    pillarTotals[pillar].denominator += MAX_SELECTED_VALUE * weight;
  });

  return PILLARS.reduce((scores, pillar) => {
    const { numerator, denominator } = pillarTotals[pillar];
    scores[pillar] = denominator ? Math.round((numerator / denominator) * 100) : 0;
    return scores;
  }, {});
};

const groupMaterialTopicsBySdg = (materialTopics) => {
  const topicsBySdg = new Map();

  materialTopics.forEach((topic) => {
    normalizeSdgs(topic.sdgs).forEach((sdg) => {
      if (!topicsBySdg.has(sdg)) {
        topicsBySdg.set(sdg, []);
      }

      // The topic is indexed once per SDG so flaw and strength answers can be
      // projected into dashboard-ready material topic rows without another DB pass.
      topicsBySdg.get(sdg).push({
        id: normalizeId(topic._id),
        title: topic.title,
        pillar: topic.pillar,
      });
    });
  });

  return topicsBySdg;
};

const buildAreaRows = ({ evaluatedAnswers, topicsBySdg, predicate, type }) => {
  const rows = [];
  const seen = new Set();

  evaluatedAnswers.filter(predicate).forEach(({ answer, question, selectedValue }) => {
    normalizeSdgs(question.sdgs).forEach((sdg) => {
      const materialTopics = topicsBySdg.get(sdg) || [{ id: null, title: 'Unmapped material topic', pillar: question.pillar }];

      materialTopics.forEach((topic) => {
        const rowKey = `${type}:${normalizeId(answer.questionId)}:${sdg}:${topic.id || topic.title}`;
        if (seen.has(rowKey)) return;
        seen.add(rowKey);

        rows.push({
          materialTopic: topic.title,
          materialTopicId: topic.id,
          pillar: topic.pillar || question.pillar,
          linkedSdg: sdg,
          questionId: normalizeId(answer.questionId),
          issue: question.prompt || question.indicator || question.objective || 'Question response requires review',
          selectedValue,
        });
      });
    });
  });

  return rows;
};

const buildReportReadinessData = ({ prioritizedSdgs, topicsBySdg, flawSdgs, strengthSdgs }) => ({
  prioritizedSdgs: prioritizedSdgs.map((sdg) => ({
    sdg,
    status: flawSdgs.has(sdg) && strengthSdgs.has(sdg)
      ? 'mixed'
      : flawSdgs.has(sdg)
        ? 'improvement_required'
        : 'strength',
    materialTopics: (topicsBySdg.get(sdg) || []).map((topic) => ({
      id: topic.id,
      title: topic.title,
      pillar: topic.pillar,
    })),
    kpis: SDG_KPI_MAPPING[sdg] || [],
  })),
});

const assertKpiMappingCompleteness = () => {
  const missingSdgs = Array.from({ length: 17 }, (_, index) => String(index + 1)).filter((sdg) => !SDG_KPI_MAPPING[sdg]);
  const invalidSdgs = Object.entries(SDG_KPI_MAPPING)
    .filter(([, kpis]) => !Array.isArray(kpis) || kpis.length !== 3)
    .map(([sdg]) => sdg);

  if (missingSdgs.length || invalidSdgs.length) {
    throw new Error(
      `Every SDG must have exactly 3 KPIs. Missing SDGs: ${missingSdgs.join(', ') || 'none'}. Invalid SDGs: ${
        invalidSdgs.join(', ') || 'none'
      }`,
    );
  }
};

export const evaluateAssessment = async (submissionData, companyId) => {
  assertKpiMappingCompleteness();

  const { answers, questionnaireId } = normalizeSubmission(submissionData);
  if (!answers.length) {
    throw new Error('Assessment submission must include at least one answer');
  }

  const questionIds = answers.map((answer) => answer.questionId).filter(Boolean);
  const questionnaire = await findQuestionnaireForSubmission(questionIds, questionnaireId);

  if (!questionnaire) {
    throw new Error('No questionnaire found for submitted answers');
  }

  const questionIndex = buildQuestionIndex(questionnaire);
  const evaluatedAnswers = answers.map((answer) => {
    const question = questionIndex.get(normalizeId(answer.questionId));
    if (!question) {
      throw new Error(`Question not found for answer: ${normalizeId(answer.questionId)}`);
    }

    return {
      answer,
      question,
      selectedValue: getSelectedValue(answer),
    };
  });

  const materialTopics = await getMaterialTopics(companyId);
  const topicsBySdg = groupMaterialTopicsBySdg(materialTopics);
  const pillarScores = calculatePillarScores(evaluatedAnswers);

  const flaws = evaluatedAnswers.filter(({ selectedValue }) => selectedValue <= 1);
  const strengthsByAnswer = evaluatedAnswers.filter(({ selectedValue }) => selectedValue >= 3);
  const flawSdgs = new Set(flaws.flatMap(({ question }) => normalizeSdgs(question.sdgs)));
  const strengthSdgs = new Set(strengthsByAnswer.flatMap(({ question }) => normalizeSdgs(question.sdgs)));
  const prioritizedSdgs = [...new Set([...flawSdgs, ...strengthSdgs])].sort((a, b) => Number(a) - Number(b));

  const actionAreas = buildAreaRows({
    evaluatedAnswers,
    topicsBySdg,
    predicate: ({ selectedValue }) => selectedValue <= 1,
    type: 'flaw',
  });

  const strengths = buildAreaRows({
    evaluatedAnswers,
    topicsBySdg,
    predicate: ({ selectedValue }) => selectedValue >= 3,
    type: 'strength',
  });

  return {
    pillarScores,
    actionAreas,
    strengths,
    reportReadinessData: buildReportReadinessData({
      prioritizedSdgs,
      topicsBySdg,
      flawSdgs,
      strengthSdgs,
    }),
  };
};
