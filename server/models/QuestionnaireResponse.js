import mongoose from 'mongoose';
import { Schema, objectId, optionalText, timestamps } from './common.js';

const answerSchema = new Schema(
  {
    questionId: { type: Schema.Types.ObjectId, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    score: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false },
);

const questionnaireResponseSchema = new Schema(
  {
    organization: objectId('Organization'),
    user: objectId('User'),
    questionnaire: objectId('Questionnaire', true),
    assessment: objectId('Assessment'),
    answers: {
      type: [answerSchema],
      validate: [(answers) => answers.length > 0, 'Response must include answers'],
    },
    status: { type: String, enum: ['draft', 'submitted'], default: 'draft' },
    submittedAt: Date,
    notes: optionalText(1000),
  },
  timestamps,
);

questionnaireResponseSchema.index({ organization: 1, questionnaire: 1, createdAt: -1 });

export const QuestionnaireResponse = mongoose.model('QuestionnaireResponse', questionnaireResponseSchema);
