import mongoose from 'mongoose';
import { Schema, esgPillars, nameField, optionalText, timestamps } from './common.js';

const questionSchema = new Schema(
  {
    prompt: { type: String, required: true, trim: true, minlength: 5, maxlength: 500 },
    pillar: { type: String, enum: esgPillars, required: true },
    inputType: { type: String, enum: ['scale', 'single_choice', 'multi_choice', 'text', 'number'], required: true },
    options: [{ label: nameField('Option label', 1, 500), value: { type: String, required: true, trim: true } }],
    weight: { type: Number, min: 1, max: 10, default: 1 },
    required: { type: Boolean, default: true },
    
    // --- NEW FIELDS ADDED FROM FIRESTORE ---
    order: { type: Number }, // Maps to "number"
    tooltip: optionalText(1000), 
    category: { type: String, trim: true },
    objective: optionalText(1000),
    indicator: optionalText(1000),
    exampleKpis: optionalText(500),
    industryRelevance: { type: String, trim: true, default: 'All' },
    sdgs: [{ type: String, trim: true }], // Array of strings mapped to SDGs
  },
  { _id: true }
);

const questionnaireSchema = new Schema(
  {
    title: nameField('Questionnaire title', 2, 140),
    description: optionalText(1200),
    type: { type: String, enum: ['compass', 'onboarding', 'annual'], required: true },
    version: { type: Number, min: 1, default: 1 },
    questions: {
      type: [questionSchema],
      validate: [(questions) => questions.length > 0, 'Questionnaire must include questions'],
    },
    isPublished: { type: Boolean, default: false },
  },
  timestamps
);

questionnaireSchema.index({ type: 1, version: -1 }, { unique: true });

export const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);
