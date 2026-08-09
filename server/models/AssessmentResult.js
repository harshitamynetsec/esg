import mongoose from 'mongoose';
import { Schema, objectId, timestamps } from './common.js';

const selectedTopicSchema = new Schema(
  {
    materialTopic: objectId('MaterialTopic', true),
    title: { type: String, required: true, trim: true },
    pillar: { type: String, required: true, trim: true },
    sdgs: [{ type: String, trim: true }],
  },
  { _id: false },
);

const gapStrengthSchema = new Schema(
  {
    question: objectId('Question'),
    questionText: { type: String, required: true, trim: true },
    selectedValue: { type: Number, min: 0, max: 4, required: true },
    pillar: { type: String, required: true, trim: true },
    materialTopics: [selectedTopicSchema],
    sdgs: [{ type: String, trim: true }],
  },
  { _id: false },
);

const kpiRecommendationSchema = new Schema(
  {
    kpi: objectId('KPI'),
    name: { type: String, required: true, trim: true },
    pillar: { type: String, trim: true },
    unit: { type: String, trim: true },
    frequency: { type: String, trim: true },
    materialTopic: objectId('MaterialTopic'),
    sdg: { type: String, trim: true },
  },
  { _id: false },
);

const assessmentResultSchema = new Schema(
  {
    user: objectId('User', true),
    organization: objectId('Organization'),
    selectedMaterialTopics: [selectedTopicSchema],
    answers: [
      {
        question: objectId('Question'),
        questionText: { type: String, required: true, trim: true },
        selectedValue: { type: Number, min: 0, max: 4, required: true },
        weight: { type: Number, min: 1, max: 10, required: true },
        pillar: { type: String, required: true, trim: true },
      },
    ],
    pillarScores: {
      environmental: { type: Number, min: 0, max: 100, default: 0 },
      social: { type: Number, min: 0, max: 100, default: 0 },
      governance: { type: Number, min: 0, max: 100, default: 0 },
      overall: { type: Number, min: 0, max: 100, default: 0 },
    },
    complianceGaps: [gapStrengthSchema],
    strengths: [gapStrengthSchema],
    prioritizedMaterialTopics: [selectedTopicSchema],
    recommendedKpis: [kpiRecommendationSchema],
    status: { type: String, enum: ['completed'], default: 'completed', index: true },
    completedAt: { type: Date, default: Date.now, index: true },
  },
  timestamps,
);

assessmentResultSchema.index({ user: 1, completedAt: -1 });
assessmentResultSchema.index({ organization: 1, completedAt: -1 });

export const AssessmentResult =
  mongoose.models.AssessmentResult || mongoose.model('AssessmentResult', assessmentResultSchema);
